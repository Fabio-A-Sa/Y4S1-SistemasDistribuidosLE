const GCounter = require('./GCounter.js');

module.exports = class AWORSet {

    constructor(owner, id, name, url, loaded = true) {
        this.id = id;
        this.deleted = false;
        this.loaded = loaded;
        this.owner = owner;
        this.name = name;
        this.url = url;
        this.set = []; // [(element, gcounter, cc)]
        this.cc = [];  // [(cc)] = [(id, version)]
    }

    // When deleting, also delete all its internal structures
    delete() {
        this.deleted = true;
        this.owner = null;
        this.name = null;
        this.set = [];
        this.cc = [];
    }

    /*
        Example of unique tag construction algorithm
        this.id = C
        this.cc = [(A, 1), (C, 1), (C, 2), (A, 2), (B, 1)]
        this.utag() = (C, 3)
    */
    utag() {
        const indexes = this.cc
            .filter(entry => entry[0] === this.id && typeof entry[1] === 'number')
            .map(entry => entry[1]);
        const index = indexes.length ? Math.max(...indexes) : 0;
        return [this.id, index + 1];
    }

    /*
        A new item is associated with a unique tag, including its version and identification of 
        the node responsible for the change
    */
    createItem(itemName, current = 0, total = 0) {
        if (!this.elements().includes(itemName)) {
            const tag = this.utag();
            this.set.push([itemName, new GCounter(current, total), tag]);
            this.cc.push(tag);
            return "Item successfully added";
        }
        return "Error: This item already exists in this list";
    }

    // Deletion is simple: remove the item from this.set
    deleteItem(itemName) {
        this.set = this.set.filter((node) => {
            return node[0] !== itemName
        });
    }

    /*
        Updating quantities involves:
        - merging the GCounters
        - applying a new tag to the list element for versioning purposes
    */
    updateQuantities(itemName, current, total) {
        if (this.elements().includes(itemName)) {
            for (let item of this.set) {
                if (item[0] === itemName) {
                    item[1].merge({current: current, total: total});
                    const newTag = this.utag()
                    item[2] = newTag;
                    this.cc.push(newTag)
                    return "Successfully updated";
                }
            }
        }
        return "Error: This item doesn't exist in this list";
    }

    elements() {
        const uniqueSet = new Set(this.set.map((node) => node[0]));
        return Array.from(uniqueSet);
    }

    // For object serialization purposes
    itemInfo(itemName) {

        /*
            The quantity of an item is the merge of the GCounters 
            from all versions of that element
        */
        if (this.elements().includes(itemName)) {
            let counter = new GCounter();
            for (const [item, gcounter, cc] of this.set) {
                if (item === itemName) {
                    counter.merge(gcounter);
                }
            }

            return {
                name: itemName,
                current: counter.current,
                total: counter.total,
            }
        }
    }

    // For object serialization purposes
    toString() {

        const cc = this.cc.map(([id, version]) => {
            return {
                id: id,
                version: version,
            }
        });

        const set = this.set.map(([item, counter, [id, version]]) => {
            return {
                name: item,
                current: counter.current,
                total: counter.total,
                id: id,
                version: version,
            };
        })

        return {
            name: this.name,
            url: this.url, 
            deleted: this.deleted,
            owner: this.owner,
            loaded: this.loaded,
            cc: cc,
            set: set,
        };  
    }

    // For frontend purposes
    info() {

        const items = this.elements().map(
            (itemName) => {
                return this.itemInfo(itemName);
            }
        )

        return {
            name: this.name,
            url: this.url, 
            deleted: this.deleted,
            owner: this.owner,
            loaded: this.loaded,
            items: items,
        };  
    }

    /*
        Returns elements from A that do not have their causal context present
        in set B, meaning, non-deleted elements
    */
    preserve(a, b) {

        let result = []
        for (const elementA of a) {
            const {
                name: nameA, 
                current: currentA,
                total: totalA,
                id: ccIdA, 
                version: ccVersionA
            } = elementA;
            let found = false;

            for (const ccB of b) {
                const {id: ccIdB, version: ccVersionB} = ccB;


                if (ccIdA === ccIdB && ccVersionA === ccVersionB) {
                    found = true;
                }
            }

            if (!found) result.push(elementA);
        }

        // Transformation of the output in a internal representation (string, GCounter, causalContext)
        result =  result.map((element) => {
            return [element.name, new GCounter(element.current, element.total), [element.id, element.version]];
        })

        return result;
    }

    merge(AWORSet) {

        // merge attributes if unknown or not loaded
        if (!this.loaded && AWORSet.loaded) {
            this.name = AWORSet.name;
            this.owner = AWORSet.owner;
            this.loaded = true;
        }

        let newSet = [];

        // this.set INTERSECT AWORSet.set
        for (const elementA of this.set) {
            const [nameA, gcounterA, [ccIdA, ccVersionA]] = elementA;
    
            for (const elementB of AWORSet.set) {
                const {
                    name: nameB, 
                    current: currentB, 
                    total: totalB,
                    id: ccIdB, 
                    version: ccVersionB
                } = elementB;
    
                if (nameA === nameB && ccIdA === ccIdB && ccVersionA === ccVersionB) {
                    newSet.push(elementA);
                    break;
                }
            }
        }

        // this.set INTERSECT AWORSet.cc
        newSet.push(...this.preserve(this.toString().set, AWORSet.cc))

        // AWORSet.set INTERSECT this.cc
        newSet.push(...this.preserve(AWORSet.set, this.toString().cc))

        // update internal set
        this.set = newSet

        // this.causalContext UNION AWORSet.causalContext
        const externalCC = AWORSet.cc.map((cc) => [cc.id, cc.version]);
        this.cc = Array.from(new Set([...this.cc, ...externalCC]
                       .map(JSON.stringify)), JSON.parse);
    }
}

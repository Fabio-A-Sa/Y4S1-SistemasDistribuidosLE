const Cart = require('./crdt/Cart.js');
const { Worker, isMainThread } = require('worker_threads');
const zmq = require("zeromq");
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

async function startServer(port) {
    // Creation and loading of the database
    const dbFile = `../database/servers/${port}.db`;
    let db = null
    if (!fs.existsSync(dbFile)) { // create local database if there isnt one
        db = new sqlite3.Database(dbFile);

        // Read the schema.sql file
        const schemaPath = '../database/schema.sql';
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute the schema.sql SQL statements
        db.exec(schema, (err) => {
            if (err) {
            console.error(err.message);
            } else {
            console.log('Schema has been executed successfully');
            }
        });
    } else { // If db already exists
        db = new sqlite3.Database(dbFile);
    }

    let cart = new Cart(port);
    cart.load(db)

    let mergeLock = false;
    async function withLock(callback) {
        while (mergeLock) {
            // Wait until the lock is released
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    
        mergeLock = true;
    
        try {
            // Perform the critical section
            await callback();
        } finally {
            // Release the lock
            mergeLock = false;
        }
    }

    const dbUpdateThread = new Worker('./workers/db_thread.js', {workerData: { dbFile: `../database/servers/${port}.db` }});
    setInterval(check_cart_isChanged, config.db_update)

    function check_cart_isChanged() {
        if(cart.changed()) {
            dbUpdateThread.postMessage({ type: 'updateDB', cart: cart.info() });
        }
    }

    // Worker thread responsável por enviar updates aos vizinhos e receber updates vindos dos outros servers
    const updateWorker = new Worker('./workers/servers_thread.js', { workerData: { httpPort: port } });

    updateWorker.on('message', async (message) => {
        if(message.type === 'updateCart') {
            try {
                await withLock(async () => {
                  cart.merge(message.cart);
                });
            } catch (error) {
                console.error(error);
            }
        }
    })

    //De 5 em 5 segundos, server manda updates para os seus vizinhos
    async function sendingUpdates() {
        updateWorker.postMessage({ type: 'updateNeighbors', cart: cart.toString()});
    }

    setInterval(sendingUpdates, config.server_neighbor_update);

    const context = new zmq.Context()
    const sock = new zmq.Reply(context)
    sock.connect("tcp://localhost:9000")
    console.log(`Server ${port} started and ready to work... (pid = ${process.pid})`);

    for await (const [delimiter, id, response] of sock) {
        console.log(port + " received a message related to client ", id.toString(),"\n")
        
        let reply
        try {
            await withLock(async () => {
              reply = cart.merge(response, true);
            });
        } catch (error) {
            console.error(error);
        }
        console.log(port + " current cart:")
        let info = cart.info();
        console.log("", info);
    
        await sock.send(["", id, reply])
    }
}

module.exports = startServer;

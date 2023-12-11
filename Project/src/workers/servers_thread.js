const { isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require('zeromq');
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

let skip = 0;
let updated = 0;
let port

// Send a cart to a neighbor
async function updateNeighboor(neighborPort, cart) {

    // Current server connects to the neighbor
    const requester = new zmq.Request;
    requester.connect(`tcp://localhost:${neighborPort}`);
    console.log(`\n${port} Sending update to server ${neighborPort}`);

    // Current server sends a cart to the neighbor
    requester.send(cart);

    // Timeout response promise
    const timeoutPromise = (neighborPort) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error(`Task timeout - Server ${neighborPort} not responding...`));
            }, 2000);
        });
    };

    try {
        // Waits for the response from the neighbor server or times out
        const [response] = await Promise.race([requester.receive(), timeoutPromise(neighborPort)]);
        updated++;

    } catch (error) {
        console.error(error.message);
        skip++;
    } finally {
        requester.close();
    }
}

// Send a cart to all neighbors
async function updateAllNeighboors(httpPort, cart) {
    port = httpPort
    skip = 0;
    updated = 0;
    while (updated !== config.neighbors) {
        let pos = config.servers.indexOf(parseInt(httpPort));
        let neighbor = config.servers[(pos + updated + skip + 1) % config.servers.length];

        if(neighbor === parseInt(httpPort)) {
            skip++;
        }

        await updateNeighboor(neighbor, cart);
    }
}

async function listeningToUpdates(httpPort) {
    const responder = new zmq.Reply();
    await responder.bind(`tcp://127.0.0.1:${httpPort}`);

    while (true) {
        // Worker thread receives an update from another server
        const messages = await responder.receive();

        if (messages.length > 0) {
            const [request] = messages;

            // Worker thread notifies the main thread that it has received a new update and needs to perform a cart merge
            parentPort.postMessage({ type: 'updateCart', cart: request.toString()});
        }

        // Sends acknowledgment to the server that sent the update
        responder.send("ACK");
    }
}

if (!isMainThread) {
    let { httpPort } = workerData;

    // Worker thread is attentive to updates sent by other servers
    listeningToUpdates(httpPort);

    parentPort.on('message', async (message) => {
        if(message.type === "updateNeighbors") {
            await updateAllNeighboors(httpPort, message.cart);
        }
    })
}
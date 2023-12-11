const { isMainThread, parentPort, workerData } = require('worker_threads');
const zmq = require("zeromq");
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

if (!isMainThread) {
    let { port, cart } = workerData;

    const context = new zmq.Context();
    let sock = new zmq.Request(context);
    sock.connect("tcp://localhost:8000");
    sock.sendTimeout = 0;

    async function subscribeProxy() {
        parentPort.postMessage({ type: 'loadCart' });

        // Waiting for the response from MainThread
        await new Promise(resolve => setTimeout(resolve, 10));
        try {
            await sock.send(["", port, cart]);
        } catch (err) {
            console.error("Error sending to proxy");
            return; // Log the error and return from the function
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Cart successfully sent!")

        for await (const [_, id, response] of sock) {
            if (id.toString() == port.toString()) {
                console.log("Response Received!");
                cart = response.toString();
                break;
            }
        }

        parentPort.postMessage({ type: 'responseFromServer', cart: cart });
    }

    parentPort.on('message', (message) => {
        if (message.type === 'updateCart') {
            cart = message.cart;
        }
    });

    setInterval(subscribeProxy, config.client_cloud_update);
}

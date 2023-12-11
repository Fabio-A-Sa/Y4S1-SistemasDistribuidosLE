const Cart = require('./crdt/Cart.js');
const { Worker, isMainThread } = require('worker_threads');

if (isMainThread) {
  const express = require('express');
  const fs = require('fs');
  const path = require('path');
  const sqlite3 = require('sqlite3').verbose();
  const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
  
  const app = express();
  app.use(express.json());
  
  // Check if a port is provided as a command-line argument
  const port = process.argv[2];
  
  if (!port) {
    console.log('Please provide a <PORT> on the command \x1b[3mnode client.js <PORT>\x1b[0m. (Example: node client.js 5500)');
    process.exit(1); // Exit the script
  }
  
  // Creates the 'Live Server' where User is running
  app.get('/', (req, res) => { // Gets the index.html content and gives the port of the Client
    const filePath = path.join(__dirname, '../src/index.html');
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Error loading index.html');
      } else {
        // Replace {{PORT}} with the actual port
        const htmlContent = data.toString().replace('{{PORT}}', port);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(htmlContent);
      }
    });
  });
  
  // Gets the rest of the files of "src" folder
  app.use(express.static(path.join(__dirname, '../src')));
  
  // Creation and loading of the database
  const dbFile = `../database/local/${port}.db`;
  if (!fs.existsSync(dbFile)) { // create local database if there isnt one
    var db = new sqlite3.Database(dbFile);
  
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
    var db = new sqlite3.Database(dbFile);
  }

  let cart = new Cart(port);
  cart.load(db);

  let lock = false;
  async function withLock(callback) {
    while (lock) {
      // Wait until the lock is released
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  
    lock = true;
  
    try {
      // Perform the critical section
      await callback();
    } finally {
      // Release the lock
      lock = false;
    }
  }

  // GET requests
  app.get('/lists', (req, res) => { // reads all the Users shopping lists
    let info = cart.info();
    console.log("Info:\n", info);
    res.status(200).send(info);
  });

  // get a list
  app.get('/lists/:url', (req, res) => {
    const fullUrl = req.params.url;
    const url = fullUrl.replace(/^\/lists\//, '');
    // Fetch list name based on the provided URL
    let list = cart.getList(url);
    //console.log("List: ", list);
    res.status(200).send(list);
  });

  app.post('/deleteList', async (req, res) => { // delete the list with that url
    const url = req.body.url;
    let response;
    if (cart.getList(url).owner == port) {
      try {
        await withLock(async () => {
          response = cart.deleteList(url)
        });
      } catch (error) {
        console.error(error);
      }
    }
    else {
      response = "You are not the owner of this list";
    }
    //console.log(response)
    res.status(200).send(json = {message: response});
  });

  // POST Requests
  app.post('/createList', async (req, res) => { // create a new shopping list
    const name = req.body.name;
    let list = null
    try {
      await withLock(async () => {
        list = cart.createList(name);
      });
    } catch (error) {
      console.error(error);
    }
    //console.log(list);
    res.status(200).send(json = {message: `Created the List`, url: list})
  });

  app.post('/joinList', async (req, res) => { // join a list with that url
    let listaUrl = req.body.listUrl;
    try {
      await withLock(async () => {
        cart.createList("Waiting for load...", listaUrl, 'unknown', false);
      });
    } catch (error) {
      console.error(error);
    }
    let createdList = cart.getList(listaUrl);
    //console.log("Cart Info ", cart.info());
    res.status(200).send(json = {message: `Joined the List`, url: listaUrl, list: createdList});
  });

  app.post('/changeItems', async (req, res) => {
    const items = req.body.changes;
    const listUrl = req.body.listUrl;
    let addedChanges = items[0];
    let removedChanges = items[1];
    let updatedChanges = items[2];
    try {
      await withLock(async () => {
        for (var key in addedChanges) {
          let itemToAdd = addedChanges[key];
          cart.createItem(listUrl, itemToAdd['name']);
          cart.updateQuantities(listUrl, itemToAdd['name'], 0, itemToAdd['total'])
        }
        for (var key in removedChanges) {
          let itemToRemove = removedChanges[key];
          cart.deleteItem(listUrl, itemToRemove['name']);
        }
        for (var key in updatedChanges) {
          let itemToUpdate = updatedChanges[key];
          cart.updateQuantities(listUrl, itemToUpdate['name'], itemToUpdate['current'], itemToUpdate['total']);
        }
      });
    } catch (error) {
      console.error(error);
    } 
    //console.log(cart.getList(listUrl));
    res.status(200).json({message: `Correctly changed items`, cart: cart.info()});
  });

  app.listen(port, () => {
    console.log(`Web interface is running on http://localhost:${port}`);
  });

  const dbUpdateThread = new Worker('./workers/db_thread.js', {workerData: { dbFile: `../database/local/${port}.db` }});
  setInterval(check_cart_isChanged, config.db_update)

  function check_cart_isChanged() {
    if(cart.changed()) {
      dbUpdateThread.postMessage({ type: 'updateDB', cart: cart.info() });
    }
  }

  const cloudThread = new Worker('./workers/cloud_thread.js', { workerData: { port: port, cart: cart.toString() } });

  // Handle messages from the database update thread
  cloudThread.on('message', async (message) => {
    if(message.type === 'loadCart'){
      cloudThread.postMessage({ type: 'updateCart', cart: cart.toString() });
    } else if(message.type === 'responseFromServer') {
      try {
        await withLock(async () => {
          cart.merge(message.cart);
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      // Handle other types of messages from the database update thread
      console.log('Message from cloud thread:', message);
    }
  });
}

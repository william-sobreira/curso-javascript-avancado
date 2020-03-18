// MODULE PATTERN - Making sure your connection is the same!


// var ConnectionFactory = (function () { - Working with modules! import and export 
    
// These "global" variables just exist inside the anonymous function 
// CONST!!! You can't assign a new value directly!
const stores = ['negociacoes'];
const version = 4;
const dbName = 'aluraframe';

let connection = null;
let close = null;

// A class inside a function must return something - MODULE PATTERN
export class ConnectionFactory {
// Must be a static method and return a Promise
// connection must be the same as the previous one ALWAYS
// Connection must be closed by NO ONE !!!! Just by the class ConnectionFactory

constructor(){

    throw new Error('Não é possível criar instâncias de ConnectionFactory!');
}

static getConnection(){

    return new Promise((resolve, reject) => {

        let openRequest = window.indexedDB.open(dbName, version);
        // TRIAD!!
        openRequest.onupgradeneeded = event => {
        
            ConnectionFactory._createStores(event.target.result); 
        };
        
        openRequest.onsuccess = event => {
            // Ensure your connection is UNIQUE!
            if(!connection) {
                connection = event.target.result; 
                // MONKEY PATCH - Forces a modification in an API - Destroy the method connection.close()
                close = connection.close.bind(connection); // You must store the method before you destroy it to call it after. And must bind it!
                connection.close = function() {
                    throw new Error ('Você não pode fechar diretamente a conexão');
                }
            }
            resolve(connection);
        };
        
        openRequest.onerror = event => {
            
            console.log(event.target.error);
            reject(event.target.error.name);
        };
        
    });
}

static _createStores(connection){ // connection = event.target.result

    // Checks if the store has been already created - true? then delete each store!
    stores.forEach(store => {
        if (connection.objectStoreNames.contains(store)) 
            connection.deleteObjecStore(store);
        connection.createObjectStore(store, { autoIncrement: true });
    });
    
}
static closeConnection(){

    if(connection){
        close();
        // To reset the connection status and able to GET a new connection
        connection = null;
    }
}
}
// }) (); // Here you call your anonymous function - it's a self-invoked function

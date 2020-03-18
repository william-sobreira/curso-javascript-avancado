'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, stores, version, dbName, connection, close, ConnectionFactory;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _createClass = function () {
                function defineProperties(target, props) {
                    for (var i = 0; i < props.length; i++) {
                        var descriptor = props[i];
                        descriptor.enumerable = descriptor.enumerable || false;
                        descriptor.configurable = true;
                        if ("value" in descriptor) descriptor.writable = true;
                        Object.defineProperty(target, descriptor.key, descriptor);
                    }
                }

                return function (Constructor, protoProps, staticProps) {
                    if (protoProps) defineProperties(Constructor.prototype, protoProps);
                    if (staticProps) defineProperties(Constructor, staticProps);
                    return Constructor;
                };
            }();

            stores = ['negociacoes'];
            version = 4;
            dbName = 'aluraframe';
            connection = null;
            close = null;

            _export('ConnectionFactory', ConnectionFactory = function () {
                // Must be a static method and return a Promise
                // connection must be the same as the previous one ALWAYS
                // Connection must be closed by NO ONE !!!! Just by the class ConnectionFactory

                function ConnectionFactory() {
                    _classCallCheck(this, ConnectionFactory);

                    throw new Error('Não é possível criar instâncias de ConnectionFactory!');
                }

                _createClass(ConnectionFactory, null, [{
                    key: 'getConnection',
                    value: function getConnection() {

                        return new Promise(function (resolve, reject) {

                            var openRequest = window.indexedDB.open(dbName, version);
                            // TRIAD!!
                            openRequest.onupgradeneeded = function (event) {

                                ConnectionFactory._createStores(event.target.result);
                            };

                            openRequest.onsuccess = function (event) {
                                // Ensure your connection is UNIQUE!
                                if (!connection) {
                                    connection = event.target.result;
                                    // MONKEY PATCH - Forces a modification in an API - Destroy the method connection.close()
                                    close = connection.close.bind(connection); // You must store the method before you destroy it to call it after. And must bind it!
                                    connection.close = function () {
                                        throw new Error('Você não pode fechar diretamente a conexão');
                                    };
                                }
                                resolve(connection);
                            };

                            openRequest.onerror = function (event) {

                                console.log(event.target.error);
                                reject(event.target.error.name);
                            };
                        });
                    }
                }, {
                    key: '_createStores',
                    value: function _createStores(connection) {
                        // connection = event.target.result

                        // Checks if the store has been already created - true? then delete each store!
                        stores.forEach(function (store) {
                            if (connection.objectStoreNames.contains(store)) connection.deleteObjecStore(store);
                            connection.createObjectStore(store, { autoIncrement: true });
                        });
                    }
                }, {
                    key: 'closeConnection',
                    value: function closeConnection() {

                        if (connection) {
                            close();
                            // To reset the connection status and able to GET a new connection
                            connection = null;
                        }
                    }
                }]);

                return ConnectionFactory;
            }());

            _export('ConnectionFactory', ConnectionFactory);
        }
    };
});
//# sourceMappingURL=ConnectionFactory.js.map
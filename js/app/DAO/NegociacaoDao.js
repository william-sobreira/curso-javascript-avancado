'use strict';

System.register(['../models/Negociacao'], function (_export, _context) {
    "use strict";

    var Negociacao, _createClass, NegociacaoDao;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }],
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

            _export('NegociacaoDao', NegociacaoDao = function () {
                function NegociacaoDao(connection) {
                    _classCallCheck(this, NegociacaoDao);

                    this._connection = connection;
                    this._store = 'negociacoes';
                }

                _createClass(NegociacaoDao, [{
                    key: 'adiciona',
                    value: function adiciona(negociacao) {
                        var _this = this;

                        return new Promise(function (resolve, reject) {

                            // Transaction to save inside your ObjectStore - you can read&write - obtaining your ObjectStore
                            var request = _this._connection.transaction([_this._store], 'readwrite') // Open a connection
                            .objectStore(_this._store) // Pick an object of this transaction
                            .add(negociacao); // add a negociacao

                            // #### VAI CANCELAR A TRANSAÇÃO. O evento onabort será chamado.
                            /*
                            transaction.abort(); 
                            transaction.onabort = e => {
                                console.log(e);
                                console.log('Transação abortada');
                            };
                            */

                            // If the request has been successful onsuccess - For the NegociacaoController resolve() 
                            request.onsuccess = function (event) {
                                resolve();
                            };
                            request.onerror = function (event) {
                                console.log(event.target.error);
                                reject('Não foi possível adicionar a negociação!');
                            };
                        });
                    }
                }, {
                    key: 'listaTodos',
                    value: function listaTodos() {
                        var _this2 = this;

                        return new Promise(function (resolve, reject) {

                            var cursor = _this2._connection.transaction([_this2._store], 'readwrite').objectStore(_this2._store) // Place where you store your js objects
                            .openCursor(); // Parse through your objectStore

                            // To iterate through your store (objectStore('negociacoes')) - needs a cursor
                            // A Pointer is a type of data which stores a local place in your memory with an address

                            var negociacoes = [];

                            cursor.onsuccess = function (event) {

                                var atual = event.target.result; // It's a pointer
                                if (atual) {

                                    var dado = atual.value;

                                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                                    // Needed to keep iterating through your objectStore
                                    atual.continue();
                                } else {
                                    resolve(negociacoes); // Return a array filled with your negotiations!
                                }
                            };

                            cursor.onerror = function (event) {

                                console.log(event.target.error);
                                reject('Não foi possível listar as negociações!');
                            };
                        });
                    }
                }, {
                    key: 'apagaTodos',
                    value: function apagaTodos() {
                        var _this3 = this;

                        return new Promise(function (resolve, reject) {

                            var request = _this3._connection.transaction([_this3._store], 'readwrite').objectStore(_this3._store) // Place where you store your js objects
                            .clear(); // Clear your object store

                            request.onsuccess = function (event) {
                                resolve('Negociações apagadas com sucesso');
                            };
                            request.onerror = function (event) {
                                console.log(event.target.error);
                                reject('Não foi possível apagar as negociações');
                            };
                        });
                    }
                }]);

                return NegociacaoDao;
            }());

            _export('NegociacaoDao', NegociacaoDao);
        }
    };
});
//# sourceMappingURL=NegociacaoDao.js.map
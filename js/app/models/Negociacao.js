"use strict";

System.register([], function (_export, _context) {
    "use strict";

    var _createClass, Negociacao;

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

            _export("Negociacao", Negociacao = function () {
                function Negociacao(data, quantidade, valor) {
                    _classCallCheck(this, Negociacao);

                    // Propriedades da classe
                    this._data = new Date(data.getTime()); // _data - _ é uma CONVENÇÃO que diz propriedades PRIVADAS. getTime() = Imutável!
                    this._quantidade = quantidade;
                    this._valor = valor;
                    Object.freeze(this); // Não é o suficiente para congelar alterações. É SHALLOW (rasa)
                }

                // get volume é uma função, mas como está em classe, é um MÉTODO!


                _createClass(Negociacao, [{
                    key: "isEquals",
                    value: function isEquals(outraNegociacao) {
                        return JSON.stringify(this) == JSON.stringify(outraNegociacao);
                    }
                }, {
                    key: "volume",
                    get: function get() {
                        // MÉTODO DE LEITURA getProperty
                        return this._quantidade * this._valor;
                    }
                }, {
                    key: "data",
                    get: function get() {
                        // Métodos dentro da CLASSE podem acessar atributos com _ 
                        return new Date(this._data.getTime()); // Apenas _data é rasa e MUTÁVEL. Programação defensiva!!
                    }
                }, {
                    key: "quantidade",
                    get: function get() {
                        // São propriedades PRIVADAS!
                        return this._quantidade;
                    }
                }, {
                    key: "valor",
                    get: function get() {
                        return this._valor;
                    }
                }]);

                return Negociacao;
            }());

            _export("Negociacao", Negociacao);
        }
    };
});
//# sourceMappingURL=Negociacao.js.map
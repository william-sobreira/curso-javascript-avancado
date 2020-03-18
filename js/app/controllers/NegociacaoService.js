'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.NegociacaoService = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _HttpService = require('./HttpService');

var _ConnectionFactory = require('../services/ConnectionFactory');

var _Negociacao = require('../models/Negociacao');

var _NegociacaoDao = require('../DAO/NegociacaoDao');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NegociacaoService = exports.NegociacaoService = function () {
    function NegociacaoService() {
        _classCallCheck(this, NegociacaoService);

        this._http = new _HttpService.HttpService();
    }

    _createClass(NegociacaoService, [{
        key: 'obterNegociacoes',
        value: function obterNegociacoes() {

            return Promise.all([this.obterNegociacoesDaSemana(), this.obterNegociacoesDaSemanaAnterior(), this.obterNegociacoesDaSemanaRetrasada()]
            // If ok then do this
            ).then(function (periodos) {
                // Transform first your array into a usable array with elements. Flatting your array!
                var negociacoes = periodos.reduce(function (dados, periodo) {
                    return dados.concat(periodo);
                }, []);
                return negociacoes;
            })
            // If there's an error to that
            .catch(function (erro) {
                throw new Error(erro);
            });
        }
    }, {
        key: 'obterNegociacoesDaSemana',
        value: function obterNegociacoesDaSemana() {
            var _this = this;

            return new Promise(function (resolve, reject) {

                _this._http.get('negociacoes/semana').then(function (negociacoes) {
                    resolve(negociacoes.map(function (objeto) {
                        return new _Negociacao.Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                    }));
                }).catch(function (erro) {
                    console.log(erro);
                    reject('Não foi possível obter as negociações da semana');
                });
            });
        }

        /* CALLBACK ERROR-FIST METHOD!!
        // cb = call back function - Substituted by PROMISE PATTERN
        obterNegociacoesDaSemana(){
            let xhr = new XMLHttpRequest();
            xhr.open('GET', 'negociacoes/semana');
                xhr.onreadystatechange = () => {
                    if(xhr.readyState == 4) {
                        if (xhr.status == 200){ 
                            cb(null, JSON.parse(xhr.responseText)
                                .map(objeto => 
                                    new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)
                                ))
                                
                        } else {
                            console.log(xhr.responseText);
                            cb('Não foi possível obter as negociações', null);
                        }
                    }
                };
            xhr.send();
        }
        */

    }, {
        key: 'obterNegociacoesDaSemanaAnterior',
        value: function obterNegociacoesDaSemanaAnterior() {

            // return new Promise((resolve, reject) => {

            return this._http.get('negociacoes/anterior').then(function (negociacoes) {
                return negociacoes.map(function (objeto) {
                    return new _Negociacao.Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                });
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações da semana anterior');
            });
        }
    }, {
        key: 'obterNegociacoesDaSemanaRetrasada',
        value: function obterNegociacoesDaSemanaRetrasada() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {

                _this2._http.get('negociacoes/retrasada').then(function (negociacoes) {
                    resolve(negociacoes.map(function (objeto) {
                        return new _Negociacao.Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor);
                    }));
                }).catch(function (erro) {
                    console.log(erro);
                    reject('Não foi possível obter as negociações da semana retrasada');
                });
            });
        }
    }, {
        key: 'envia',
        value: function envia(listaAtual) {

            return this._http.post('negociacoes', negociacoes).then(function (negociacoes) {
                return negociacoes.filter(function (negociacao) {
                    return (
                        /* WATCH OUT - n1 == n2 (false - 'cause you've got an attribute that creates a new Date) 
                        - They are in different memory positions!
                        TRY TO STRINGIFY YOUR OBJECT FIRST!!*/
                        !listaAtual.some(function (negociacaoExistente) {
                            return (
                                /*Must be in class Negociacao method isEquals
                                JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente))) */
                                negociacao.isEquals(negociacaoExistente)
                            );
                        })
                    );
                });
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível buscar negociações para importar');
            });

            /*
            .resolve(negociacoes => { 
                // resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)))
            })
            .catch(erro => {
                console.log(erro);
                reject('Não foi possível enviar as negociações');
            })
            */
        }
    }, {
        key: 'cadastra',
        value: function cadastra(negociacao) {

            return _ConnectionFactory.ConnectionFactory.getConnection().then(function (connection) {
                return new _NegociacaoDao.NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.adiciona(negociacao);
            }).then(function () {
                return 'Negociação adiciona com sucesso';
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível adicionar a negociação');
            });
        }
    }, {
        key: 'lista',
        value: function lista() {

            return _ConnectionFactory.ConnectionFactory.getConnection().then(function (connection) {
                return new _NegociacaoDao.NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.listaTodos();
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações');
            });
        }
    }, {
        key: 'apaga',
        value: function apaga() {
            return _ConnectionFactory.ConnectionFactory.getConnection().then(function (connection) {
                return new _NegociacaoDao.NegociacaoDao(connection);
            }).then(function (dao) {
                return dao.apagaTodos();
            }).then(function () {
                return 'Negociações apagadas com sucesso';
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível apagar as negociações');
            });
        }
    }, {
        key: 'importa',
        value: function importa(listaAtual) {

            return this.obterNegociacoes()
            // Avoiding the user to import more than once
            .then(function (negociacoes) {
                return negociacoes.filter(function (negociacao) {
                    return (
                        /* WATCH OUT - n1 == n2 (false - 'cause you've got an attribute that creates a new Date) 
                        - They are in different memory positions!
                        TRY TO STRINGIFY YOUR OBJECT FIRST!!*/
                        !listaAtual.some(function (negociacaoExistente) {
                            return (
                                /*Must be in class Negociacao method isEquals
                                JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente))) */
                                negociacao.isEquals(negociacaoExistente)
                            );
                        })
                    );
                });
            }).catch(function (erro) {
                console.log(erro);
                throw new Error('Não foi possível buscar negociações para importar');
            });
        }
        /* I've Created a new method to catch all negotiations - obterNegociacoes() - 
            letting your method to flat your array into the class NegociacaoService.js
        // Solve all promises in THIS ORDER!!!!
        Promise.all([
            service.obterNegociacoesDaSemana(), 
            service.obterNegociacoesDaSemanaAnterior(), 
            service.obterNegociacoesDaSemanaRetrasada()]
        // If ok then do this
        ).then(negociacoes => {
            negociacoes
                // Transform first your array into a usable array with elements. Flatting your array!
                .reduce((flatArray, array) => flatArray.concat(array), [])
                .forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações importadas com sucesso';
        }
        // If there's an error to that
        ).catch(error => this._mensagem.texto = error);
        */

        /* IT DOESEN'T SOLVE THE ASSYNC IMPORT PROBLEM
        // Promise is a future result of an operation
        service.obterNegociacoesDaSemana()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações da Semana obtida com sucesso';
            })
            .catch(erro => {
                this._mensagem.texto = erro;
            });
        
        service.obterNegociacoesDaSemanaAnterior()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações da Semana Anterior obtida com sucesso';
            })
            .catch(erro => {
                this._mensagem.texto = erro;
            });
            
        service.obterNegociacoesDaSemanaRetrasada()
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao))
                this._mensagem.texto = 'Negociações da Semana Retrasada obtida com sucesso';
            })
            .catch(erro => {
                this._mensagem.texto = erro;
            });
        */

        /*
        // Error first Method!
        service.obterNegociacoesDaSemana((err, negociacoes) => {
            if(err){
                this._mensagem.texto = err;
                return;
            } 
              negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
            this._mensagem.texto = 'Negociações importadas com sucesso';
        });
        */

    }]);

    return NegociacaoService;
}();
//# sourceMappingURL=NegociacaoService.js.map
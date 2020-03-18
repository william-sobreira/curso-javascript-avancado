'use strict';

System.register(['../models/ListaNegociacoes', '../models/Mensagem', '../models/Negociacao', '../views/NegociacoesView', '../views/MensagemView', '../services/NegociacaoService', '../DAO/NegociacaoDao', '../helpers/DateHelper', '../helpers/Bind'], function (_export, _context) {
    "use strict";

    var ListaNegociacoes, Mensagem, Negociacao, NegociacoesView, MensagemView, NegociacaoService, NegociacaoDao, DateHelper, Bind, _createClass, NegociacaoController;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_modelsListaNegociacoes) {
            ListaNegociacoes = _modelsListaNegociacoes.ListaNegociacoes;
        }, function (_modelsMensagem) {
            Mensagem = _modelsMensagem.Mensagem;
        }, function (_modelsNegociacao) {
            Negociacao = _modelsNegociacao.Negociacao;
        }, function (_viewsNegociacoesView) {
            NegociacoesView = _viewsNegociacoesView.NegociacoesView;
        }, function (_viewsMensagemView) {
            MensagemView = _viewsMensagemView.MensagemView;
        }, function (_servicesNegociacaoService) {
            NegociacaoService = _servicesNegociacaoService.NegociacaoService;
        }, function (_DAONegociacaoDao) {
            NegociacaoDao = _DAONegociacaoDao.NegociacaoDao;
        }, function (_helpersDateHelper) {
            DateHelper = _helpersDateHelper.DateHelper;
        }, function (_helpersBind) {
            Bind = _helpersBind.Bind;
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

            _export('NegociacaoController', NegociacaoController = function () {
                function NegociacaoController() {
                    _classCallCheck(this, NegociacaoController);

                    var $ = document.querySelector.bind(document); // Simple jQuery

                    this._inputData = $("#data"); // PRIVATE PROPERTIES/ATTR
                    this._inputQuantidade = $("#quantidade");
                    this._inputValor = $("#valor");

                    // this._negociacoesView.update(this._listaNegociacoes);

                    // It's a model
                    this._listaNegociacoes = new Bind(new ListaNegociacoes(), new NegociacoesView($('#negociacoesView')), 'adiciona', 'esvazia', 'ordenaTabela', 'inverteOrdem');
                    /* Hiding inside your Bind Helper!
                    ProxyFactory.create(
                        new ListaNegociacoes(), // The object from ProxyFactory
                        ['adiciona', 'esvazia'], // The Properties from ProxyFactory
                        // The action to run - arrow function to use NegociacaoController as (this)
                        (model) => { 
                            this._negociacoesView.update(model);
                        }
                    )
                    */

                    //function(this) - (this) = dynamic (depend on context - so this = model)
                    //To correct the parameter on function > use Reflect.apply
                    // Reflect.apply(this._armadilha, this._contexto, [this]);
                    //Arrow Function (this) = lexicon (don't change - so this = NegociacaoController)

                    /*this._listaNegociacoes = new ListaNegociacoes(model =>            
                        this._negociacoesView.update(model)); */

                    // this._mensagemView.update(this._mensagem);

                    this._mensagem = new Bind(new ListaNegociacoes(), new MensagemView($('#mensagemView')), 'texto');

                    /*
                    ProxyFactory.create(
                        new Mensagem(),
                        ['texto'],
                        (model) => {
                            this._mensagemView.update(model);
                        }
                    )
                    */
                    this._ordemAtual = '';

                    this._service = new NegociacaoService();

                    this._init();
                }

                _createClass(NegociacaoController, [{
                    key: '_init',
                    value: function _init() {
                        var _this = this;

                        this._service.lista().then(function (negociacoes) {
                            return negociacoes.forEach(function (negociacao) {
                                return _this._listaNegociacoes.adiciona(negociacao);
                            });
                        }).catch(function (erro) {
                            return _this._mensagem.texto = error;
                        });
                        /*
                            new NegociacaoDao(connection)
                                .listaTodos()
                                .then(negociacoes => {
                                      negociacoes.forEach(negociacao => {
                                        this._listaNegociacoes.adiciona(negociacao);
                                    });
                                });
                        });
                        */
                        setInterval(function () {
                            _this.importaNegociacoes();
                        }, 3000);
                    }
                }, {
                    key: 'adiciona',
                    value: function adiciona(event) {
                        var _this2 = this;

                        event.preventDefault();

                        var negociacao = this._criaNegociacao();

                        this._service.cadastra(negociacao).then(function (mensagem) {
                            _this2._listaNegociacoes.adiciona(negociacao);
                            _this2._mensagem.texto = mensagem;
                            _this2._limpaFormulario();
                        }).catch(function (erro) {
                            return _this2._mensagem.texto = erro;
                        });

                        /*  Solved by the NegociacaoDao - inside NegociacaoService - Responsible to make the unique connection then 
                        create a new negotiation insider your DB
                        try{
                              this._listaNegociacoes.adiciona(this._criaNegociacao());
                            this._mensagem.texto = 'Negociação adicionada com sucesso';
                            this._limpaFormulario();
                          } catch(erro) {
                            this._mensagem.texto = erro;
                        }
                        */
                    }
                }, {
                    key: 'enviaNegociacoes',
                    value: function enviaNegociacoes() {
                        this._service.envia(ListaNegociacoes);
                    }
                }, {
                    key: 'importaNegociacoes',
                    value: function importaNegociacoes() {
                        var _this3 = this;

                        this._service.importa(this._listaNegociacoes.negociacoes).then(function (negociacoes) {
                            negociacoes.forEach(function (negociacao) {
                                return _this3._listaNegociacoes.adiciona(negociacao);
                            });
                            _this3._mensagem.texto = 'Negociações importadas com sucesso';
                        }).catch(function (error) {
                            return _this3._mensagem.texto = error;
                        });
                    }
                }, {
                    key: 'apaga',
                    value: function apaga() {
                        var _this4 = this;

                        this._service.apaga().then(function (mensagem) {
                            _this4._mensagem.texto = mensagem;
                            _this4._listaNegociacoes.esvazia();
                        }).catch(function (erro) {
                            return _this4._mensagem.texto = erro;
                        });
                    }
                }, {
                    key: '_criaNegociacao',
                    value: function _criaNegociacao() {

                        return new Negociacao(DateHelper.textoParaData(this._inputData.value), parseInt(this._inputQuantidade.value), parseFloat(this._inputValor.value));

                        //DATEHELPER METHOD!
                        // let dataMesAno = negociacao.data.getDate() 
                        // + '/' + (negociacao.data.getMonth() + 1) // Fix month array [0~11]
                        // + '/' + negociacao.data.getFullYear();


                        // console.log(typeof(this._inputData.value)); //string
                        // let data = new Date(this._inputData.value.split('-')); Same as the bottom code
                        // let data = new Date(this._inputData.value.replace(/-/g, ','));

                        //DATEHELPER METHOD!
                        //Transforming 'yyyy-mm-dd' into new Date(yyyy, mm-1, dd)     
                        // let data = new Date(
                        //     // ... spread operator creates an array with each element
                        //     ...this._inputData.value
                        //         .split('-')
                        //         //Fixing month (0~11 not 1-12) with function MAP   
                        //         .map((item, indice) => item - indice % 2) // ARROW FUNCTION!!!
                        //         // .map(function(item, indice){ return item - indice % 2 });
                        // );        

                        // Calling your DateHelper method
                        // let helper = new DateHelper(); With static method you don't need
                    }
                }, {
                    key: '_limpaFormulario',
                    value: function _limpaFormulario() {

                        this._inputData.value = '';
                        this._inputQuantidade.value = 1;
                        this._inputValor.value = 0.0;

                        this._inputData.focus();
                    }
                }, {
                    key: 'ordenaTabela',
                    value: function ordenaTabela(coluna) {

                        if (this._ordemAtual == coluna) {
                            this._listaNegociacoes.inverteOrdem();
                        } else {
                            this._listaNegociacoes.ordenaTabela(function (a, b) {
                                return a[coluna] - b[coluna];
                            });
                        }
                        this._ordemAtual = coluna;
                    }
                }]);

                return NegociacaoController;
            }());

            _export('NegociacaoController', NegociacaoController);
        }
    };
});
//# sourceMappingURL=NegociacaoController.js.map
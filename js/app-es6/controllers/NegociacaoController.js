import {ListaNegociacoes} from '../models/ListaNegociacoes';
import {Mensagem} from '../models/Mensagem'; 
import {Negociacao} from '../models/Negociacao';

import {NegociacoesView} from '../views/NegociacoesView';
import {MensagemView} from '../views/MensagemView';

import {NegociacaoService} from '../services/NegociacaoService';
import {NegociacaoDao} from '../DAO/NegociacaoDao';

import {DateHelper} from '../helpers/DateHelper';
import {Bind} from '../helpers/Bind';


export class NegociacaoController {

    constructor() {
        
        let $ = document.querySelector.bind(document); // Simple jQuery
        
        this._inputData = $("#data"); // PRIVATE PROPERTIES/ATTR
        this._inputQuantidade = $("#quantidade");
        this._inputValor = $("#valor");
    
        // this._negociacoesView.update(this._listaNegociacoes);
        
        // It's a model
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            new NegociacoesView($('#negociacoesView')),
            'adiciona', 'esvazia', 'ordenaTabela', 'inverteOrdem'
        ) 
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

        this._mensagem = new Bind(
            new ListaNegociacoes(),
            new MensagemView($('#mensagemView')),
            'texto'
        );
            
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
    
    _init(){
        
        this._service
            .lista()
            .then(negociacoes =>
                negociacoes.forEach(negociacao => 
                    this._listaNegociacoes.adiciona(negociacao))
            ).catch(erro => this._mensagem.texto = error);
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
         setInterval(() => {
             this.importaNegociacoes();    
         }, 3000);
    }

    adiciona(event){
        
        event.preventDefault();

        let negociacao = this._criaNegociacao();

        this._service
            .cadastra(negociacao)
            .then(mensagem => {
                this._listaNegociacoes.adiciona(negociacao);
                this._mensagem.texto = mensagem;
                this._limpaFormulario();
            })
            .catch(erro => this._mensagem.texto = erro);


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

    enviaNegociacoes(){
        this._service
            .envia(ListaNegociacoes);
    }

    importaNegociacoes(){

        this._service
            .importa(this._listaNegociacoes.negociacoes)
            .then(negociacoes => {
                negociacoes.forEach(negociacao => this._listaNegociacoes.adiciona(negociacao));
                this._mensagem.texto = 'Negociações importadas com sucesso';
            })
            .catch(error => this._mensagem.texto = error);
    }

    apaga(){

        this._service
            .apaga()
            .then(mensagem => {
                this._mensagem.texto = mensagem;
                this._listaNegociacoes.esvazia();
            })
            .catch(erro => this._mensagem.texto = erro);

    }


    _criaNegociacao(){

        return new Negociacao(
            DateHelper.textoParaData(this._inputData.value), 
            parseInt(this._inputQuantidade.value),
            parseFloat(this._inputValor.value)
        )
    
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


    _limpaFormulario(){

        this._inputData.value = '';
        this._inputQuantidade.value = 1;
        this._inputValor.value =  0.0;

        this._inputData.focus();

    }

    ordenaTabela(coluna) {

        if(this._ordemAtual == coluna){
            this._listaNegociacoes.inverteOrdem();
        } else {
            this._listaNegociacoes.ordenaTabela((a, b) => a[coluna] - b[coluna]);
        }
        this._ordemAtual = coluna;
    }

}

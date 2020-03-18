import {HttpService} from './HttpService';
import {ConnectionFactory} from '../services/ConnectionFactory';
import {Negociacao} from '../models/Negociacao';
import {NegociacaoDao} from '../DAO/NegociacaoDao';

export class NegociacaoService {

    constructor(){
        
        this._http = new HttpService();
    }

    obterNegociacoes() {

        return Promise.all([
            this.obterNegociacoesDaSemana(), 
            this.obterNegociacoesDaSemanaAnterior(), 
            this.obterNegociacoesDaSemanaRetrasada()]
        // If ok then do this
        )
        .then(periodos => {
            // Transform first your array into a usable array with elements. Flatting your array!
            let negociacoes = periodos.reduce((dados, periodo) => dados.concat(periodo), [])
            return negociacoes;
        })
        // If there's an error to that
        .catch(erro => {
            throw new Error(erro)
        });
    }

        obterNegociacoesDaSemana(){
            
            return new Promise((resolve, reject) => {
                
                this._http
                .get('negociacoes/semana')
                    .then(negociacoes => { 
                        resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)))
                    })
                    .catch(erro => {
                        console.log(erro);
                        reject('Não foi possível obter as negociações da semana');
                    })
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

        obterNegociacoesDaSemanaAnterior(){

                // return new Promise((resolve, reject) => {
                        
                return this._http
                    .get('negociacoes/anterior')
                        .then(negociacoes => { 
                            return negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor))
                        })
                        .catch(erro => {
                            console.log(erro);
                            throw new Error ('Não foi possível obter as negociações da semana anterior');
                    });
            }


        obterNegociacoesDaSemanaRetrasada(){

            return new Promise((resolve, reject) => {
                    
                this._http
                .get('negociacoes/retrasada')
                    .then(negociacoes => { 
                        resolve(negociacoes.map(objeto => new Negociacao(new Date(objeto.data), objeto.quantidade, objeto.valor)))
                    })
                    .catch(erro => {
                        console.log(erro);
                        reject('Não foi possível obter as negociações da semana retrasada');
                })
            }); 
        }

    envia(listaAtual){

        return this._http
            .post('negociacoes', negociacoes)
            .then(negociacoes => 
                negociacoes.filter(negociacao => 
                    /* WATCH OUT - n1 == n2 (false - 'cause you've got an attribute that creates a new Date) 
                    - They are in different memory positions!
                    TRY TO STRINGIFY YOUR OBJECT FIRST!!*/
                    !listaAtual.some(negociacaoExistente => 
                        /*Must be in class Negociacao method isEquals
                        JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente))) */
                        negociacao.isEquals(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível buscar negociações para importar');
            })

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
    
    cadastra(negociacao){
        
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.adiciona(negociacao))
            .then(() => 'Negociação adiciona com sucesso')
            .catch(erro => { 
                console.log(erro);
                throw new Error('Não foi possível adicionar a negociação')
            });
    }

    lista(){
    
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.listaTodos())
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível obter as negociações')
            });
    }

    apaga(){
        return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(() => 'Negociações apagadas com sucesso')
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível apagar as negociações')
            });
    }

    importa(listaAtual){

        return this.obterNegociacoes()
            // Avoiding the user to import more than once
            .then(negociacoes => 
                    negociacoes.filter(negociacao => 
                        /* WATCH OUT - n1 == n2 (false - 'cause you've got an attribute that creates a new Date) 
                        - They are in different memory positions!
                        TRY TO STRINGIFY YOUR OBJECT FIRST!!*/
                        !listaAtual.some(negociacaoExistente => 
                            /*Must be in class Negociacao method isEquals
                            JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente))) */
                            negociacao.isEquals(negociacaoExistente)))
            )
            .catch(erro => {
                console.log(erro);
                throw new Error('Não foi possível buscar negociações para importar');
            })
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

}





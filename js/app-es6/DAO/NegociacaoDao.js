/* DAO - Data Access Object - Responsible to use the methods add & listaTodos & remove
    It's great to isolate the responsability of the methods which access your repository (DB)
    It's part of a persistence layer that works as a facade from our IndexedDB
*/

import {Negociacao} from '../models/Negociacao';

export class NegociacaoDao {

    constructor(connection){

        this._connection = connection;
        this._store = 'negociacoes';
    }

    adiciona(negociacao){

        return new Promise((resolve, reject) =>{

            // Transaction to save inside your ObjectStore - you can read&write - obtaining your ObjectStore
            let request = this._connection
                .transaction([this._store], 'readwrite') // Open a connection
                .objectStore(this._store) // Pick an object of this transaction
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
            request.onsuccess = event => {
                resolve();
            };
            request.onerror = event => {
                console.log(event.target.error);
                reject('Não foi possível adicionar a negociação!');
            };

        });
    }

    listaTodos(){

        return new Promise((resolve, reject) => {

            let cursor = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store) // Place where you store your js objects
                .openCursor(); // Parse through your objectStore
            
            // To iterate through your store (objectStore('negociacoes')) - needs a cursor
            // A Pointer is a type of data which stores a local place in your memory with an address

            let negociacoes = [];

            cursor.onsuccess = event => {

                let atual = event.target.result; // It's a pointer
                if(atual){
                    
                    let dado = atual.value;
                    
                    negociacoes.push(new Negociacao(dado._data, dado._quantidade, dado._valor));
                    // Needed to keep iterating through your objectStore
                    atual.continue();

                } else {
                    resolve(negociacoes); // Return a array filled with your negotiations!
                }
            };

            cursor.onerror = event => {

                console.log(event.target.error);
                reject('Não foi possível listar as negociações!');
            };
        });
    }

    apagaTodos(){

        return new Promise((resolve, reject) => {
            
            let request = this._connection
                .transaction([this._store], 'readwrite')
                .objectStore(this._store) // Place where you store your js objects
                .clear(); // Clear your object store

            request.onsuccess = event => {
                resolve('Negociações apagadas com sucesso');
            };
            request.onerror = event => {
                console.log(event.target.error);
                reject('Não foi possível apagar as negociações');
            };
        });
    }

}
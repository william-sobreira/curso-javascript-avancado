export class ListaNegociacoes {

    constructor(armadilha){

        this._negociacoes = []
        // Create a trigger
        // this._armadilha = armadilha;
    }

    adiciona(negociacao) {
        
        this._negociacoes.push(negociacao);
        // this._negociacoes = [].concat(this_negociacoes, negociacao); - Not good for high number of inputs
        // this._armadilha(this);
    }

    ordenaTabela(criterio){

        this._negociacoes.sort(criterio);
    }

    inverteOrdem(){
        this._negociacoes.reverse();
    }

    get negociacoes(){
        // return this._negociacoes; this way you don't shield your array
        // Shielding your array properly!
        return [].concat(this._negociacoes); // Creates a new array (copy)
    }
    
    esvazia(){
        // Erase and create a new array 
        this._negociacoes = [];
        // this._armadilha(this);
    }

    get volumeTotal(){
        return this._negociacoes.reduce((total, n) => total + n.volume, 0.0);
    }

}


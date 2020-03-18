// Começa com letra maiúscula, pois define que é uma CLASSE!

export class Negociacao {

    constructor(data, quantidade, valor){ // Propriedades da classe
        this._data = new Date(data.getTime()); // _data - _ é uma CONVENÇÃO que diz propriedades PRIVADAS. getTime() = Imutável!
        this._quantidade = quantidade;
        this._valor = valor;
        Object.freeze(this); // Não é o suficiente para congelar alterações. É SHALLOW (rasa)
    }

    // get volume é uma função, mas como está em classe, é um MÉTODO!
    get volume(){ // MÉTODO DE LEITURA getProperty
        return this._quantidade * this._valor;
    }

    get data(){ // Métodos dentro da CLASSE podem acessar atributos com _ 
        return new Date(this._data.getTime()); // Apenas _data é rasa e MUTÁVEL. Programação defensiva!!
    }

    get quantidade(){ // São propriedades PRIVADAS!
        return this._quantidade;
    }
    
    get valor(){
        return this._valor;
    }

    isEquals(outraNegociacao) {
        return JSON.stringify(this) == JSON.stringify(outraNegociacao);
    }

}
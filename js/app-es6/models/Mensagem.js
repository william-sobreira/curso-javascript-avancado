export class Mensagem {

    // For EDGE constructor(texto) { this._texto = texto || ''; ...}
    constructor(texto='') { // If you don't insert a value, the default's gonna be ''

        this._texto = texto;
    }

    get texto() {

        return this._texto;
    }

    set texto(texto){

        this._texto = texto;
    }

}
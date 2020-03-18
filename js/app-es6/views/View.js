export class View {

    constructor(elemento){

        this._elemento = elemento;
    }

    template(){

        // Avoid dev forgetting to implement template method
        throw new Error('O método template deve ser implementado');
    }

    update(model) {

        this._elemento.innerHTML = this.template(model);
    }


}
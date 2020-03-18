import {View} from './View'

export class MensagemView extends View {

    constructor(elemento) {

        // MUST receive & inherit the elemento from the dad (super)
        super(elemento);
    }

    template(model) {

        return model.texto ?  `<p class="alert alert-info">${model.texto}</p>` : `<p></p>`;
    }
}
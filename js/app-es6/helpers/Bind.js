/* ...props = REST OPERATOR!!!! Any argument passed is going to be an array
        this._listaNegociacoes = new Bind(
            new ListaNegociacoes(),
            this._negociacoesView,
            ['adiciona', 'esvazia']
        ) 
*/
import {ProxyFactory} from '../services/ProxyFactory';

export class Bind {

    constructor(model, view, ...props){

        //Creating your Proxy with the service - ProxyFactory
        let proxy = ProxyFactory.create(model, props, (model) => {
            view.update(model);
        });
        // Render the view for the first time (html)
        view.update(model);

        return proxy;
    }
}
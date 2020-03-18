import {View} from './View';
import {DateHelper} from '../helpers/DateHelper';

export class NegociacoesView extends View {

    constructor(elemento) {

        // MUST receive & inherit the "elemento" from the dad (super)
        super(elemento);

    }

    template(model) {

        // Comes as a string 'cause you're using .innerHTML inside ``
        return `
        <table class="table table-hover table-bordered">
            <thead>
                <tr>
                    <th onclick="negociacaoController.ordenaTabela('data')">DATA</th>
                    <th onclick="negociacaoController.ordenaTabela('quantidade')">QUANTIDADE</th>
                    <th onclick="negociacaoController.ordenaTabela('valor')">VALOR</th>
                    <th onclick="negociacaoController.ordenaTabela('volume')">VOLUME</th>
                </tr>
            </thead>
            
            <tbody>
                ${ 
                    // Create a new line with the updated data sent by the user
                    model.negociacoes.map(n => `
                        
                        <tr>
                            <td>${DateHelper.dataParaTexto(n.data)}</td>
                            <td>${n.quantidade}</td>
                            <td>${n.valor}</td>
                            <td>${n.volume}</td>
                        </tr>
                    
                `// Return a new array as a string, 'cause we're using string template
                ).join('')} 
            </tbody>

            <tfoot>
                <td colspan="3">Total</td>
                <td>${model.volumeTotal
                    /* It must on your ListaNegociacoes to respect the MVC method 
                    reduce(total, n, function 0.0) reduce an array in a single value 
                    model.negociacoes.reduce((total, n) => total + n.volume, 0.0) */
                }</td>
            </tfoot>
        </table>
        `;
    }

}


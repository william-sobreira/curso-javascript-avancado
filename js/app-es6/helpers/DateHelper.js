export class DateHelper {
    
    constructor(){
        throw new Error('Esta classe não pode ser instanciada');
    }

    static dataParaTexto(data){ // Static Method allows you to call the method without instantiate it
        // return data.getDate() 
        // + '/' + (data.getMonth() + 1)
        // + '/' + data.getFullYear();

        return `${data.getDate()}/${data.getMonth()+1}/${data.getFullYear()}`; // String template ${let}

    }

    static textoParaData(texto){
        
        // Regular expression pick 4 digits, then 2 and finally 2 digits 
        
            if(!/^\d{4}-\d{2}-\d{2}$/.test(texto)){
                throw new Error('Deve estar no formato yyyy-mm-dd');
            }
            return new Date (...texto.split('-').map((item, indice) => item - indice % 2));
        

        /* method Date() doesn't work on Firefox
        if(!/\d{2}\/\d{2}\/\d{4}/.test(texto)) 
            throw new Error('Deve estar no formato dd/mm/aaaa');
            return new Date(...texto.split('/').reverse().map((item, indice) => item - indice % 2));
        */
    }
}


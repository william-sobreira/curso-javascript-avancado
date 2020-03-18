export class ProxyFactory {

    static create(objeto, props, acao) {

        return new Proxy(objeto, {
            //FOR METHODS!!!! GET
            //target = real object | prop = property being accessed | receiver = reference for your proxy
            get(target, prop, receiver){
                // Method adiciona & esvazia includes a property? && add/esvazia == function?
                if(props.includes(prop) && ProxyFactory.isFunction(target[prop])) {
                    // Must be function. This DYNAMIC
                    return function(){
                        console.log(`interceptando um ${prop}`);
                        /* arguments is a var that allows you to access all parameters of a calling function
                        You've stored "retorno" 'cause you need to keep it to return it
                        */
                        let retorno = Reflect.apply(target[prop], target, arguments);
                        acao(target);
                        return retorno;
                    }

                }else{
                    // Return the value of the property (target, prop[, receiver])
                    return Reflect.get(target, prop, receiver);
                }
            }, 
            //FOR PROPERTIES!!!! SET
            set(target, prop, value, receiver){
                let retorno = Reflect.set(target, prop, value, receiver);
                if(props.includes(prop)){
                    acao(target); // Execute the action on your target (object)             
                }
                return retorno; // Change the property
            }
        });

    }

    static isFunction(func){

        return typeof(func) == typeof(Function);
    }

}
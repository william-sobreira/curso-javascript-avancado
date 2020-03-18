export class HttpService {

    _handleErrors(res) {

        if(!res.ok) throw new Error (res.statusText);
        return res;
    }

    get(url) {

        // Substitute the whole code before
        return fetch(url)
            // Promise (resolve, reject)
            .then(res => this._handleErrors(res))
            .then(res => res.json());
            /*.then(res => {
                if(res.ok) { // res.ok = assures you that the request was successful!
                    return res.json(); // Substitute JSON.parse
                } else {
                    throw new Error
                }
            } 
            */


        /*
        // Returns a future result - resolve (code if OK) - OR - return reject (code if something went wrong)
        return new Promise((resolve, reject) =>{

            let xhr = new XMLHttpRequest();
            // Type of your request / Address or URL to get
            xhr.open('GET', url);
    
                // Configurations before to send it
                
                // Everytime your xhr status has changed execute a function
    
                // 0: Requist not initiated / 1: Server connection has been estabilished
                // 2: Request received / 3: Processing request / 4: Request concluded - response is ready 
                xhr.onreadystatechange = () => {
                    if(xhr.readyState == 4) {
                        if (xhr.status == 200){ // Operation is OKAY 
                            // JSON.parse(xhr.resonseText()) - Convert the text into an JS object
                            resolve(JSON.parse(xhr.responseText))
                        } else {
                            reject(xhr.responseText);
                        }
                    }
                };
            // To execute the operation you need to send it
            xhr.send();
        });
        */
    }

    post(url, dado) {

        return fetch(url, {
            // Object = dado
            headers: {'Content-type' : 'application/json'},
            method: 'post', 
            body: JSON.stringify(dado) // who you're posting
        })
        .then(res => this._handleErrors(res));

        /*
        return new Promise((resolve, reject) => {

            let xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = () => {

                if (xhr.readyState == 4) {

                    if (xhr.status == 200) {

                        resolve(JSON.parse(xhr.responseText));
                    } else {

                        reject(xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify(dado)); // JSON.stringify converts an object into a string (format JSON)
        });
        */
    }
}


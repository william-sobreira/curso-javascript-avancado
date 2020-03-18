'use strict';

// We need to create a polyfill (script that emules some behavior) - in this case for the method array.includes()

if (!Array.prototype.includes) {
    // If doesen't exist, add
    console.log('Polyfill for Array.includes applied');

    Array.prototype.includes = function (element) {
        return this.indexOf(element) != -1;
    };
}
//# sourceMappingURL=es6.js.map
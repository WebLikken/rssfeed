'use strict';
/**
 *
 * @param obj
 * @param underscoreSuppression boolean pour remplacer le underscore du  début propriétés
 * @param copyarrayOrObject boolean Copie des Array de l'objet
 * @returns {{}}
 */
let cloneSimpleOject = function (obj, underscoreSuppression, copyarray) {
    this.copyarray = copyarray !== false;
    let newObj = {};
    for (let property in obj) {
        if (obj.hasOwnProperty(property)) {

            // Optionnel Suppression underscore du début des propriétés
            let newProperty = underscoreSuppression ? property.replace('_', '') : property;
            if (!(obj[property] instanceof Array)) {
                newObj[newProperty] = obj[property];

            } else{
                if (copyarray) {
                    newObj[newProperty] = obj[property];

                }
            }


        }
    }
    return newObj;
};

exports.cloneSimpleOject = cloneSimpleOject;

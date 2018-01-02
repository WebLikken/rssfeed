'use strict';

let uuid = require('uuid');

class User {
    constructor(IDUser, Email) {
        this.IDUser = IDUser || uuid.v1();
        this.Email = Email; //Clé de partition primaire
        this.firstName = undefined;
        this.lastName = undefined;
        this.dateCreation = Date.now();
        this.dateUpdate = Date.now();
    }
}

let userType = {
    IDUser: "S",
    Email: "S",
    firstName: "S",
    lastName: "S",
    dateCreation: "S",
    dateUpdate: "S"

};
exports.User = User;
exports.userType = userType;
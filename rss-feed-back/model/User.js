'use strict';

let moment = require('moment');

class User {
    constructor(IDUser,Email) {
        this.IDUser = IDUser;
        this.Email=Email;
        this.firstName=undefined;
        this.lastName=undefined;
        this.dateCreation=Date.now();
        this.dateUpdate=Date.now();
    }
}
exports.User = User;
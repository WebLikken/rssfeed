'use strict';
let uuid = require('uuid'),
    AWS_CONFIG = require(__base + 'config/dto-config').AWS_CONFIG;


class Category {
    constructor(IDUser, IDCategory, text, title, channels) {
        this.IDUser = IDUser; //Clé de partition primaire
        this.IDCategory = IDCategory || uuid.v1(); //Clé de tri primaire
        this.text = text;
        this.title = title;
        this.channels = channels;
    }
}

let categoryType = {
        IDUser: "S",
        IDCategory: "S",
        text: "S",
        title: "S",
        channels: "SS"
    },
    CetegoryDefault = function () {
        this.text = 'Sans catégorie';
        this.title = 'Sans catégorie';
        this.channels = [];
    };
exports.Category = Category;
exports.categoryType = categoryType;
exports.CetegoryDefault = CetegoryDefault;
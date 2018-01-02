'use strict';
let uuid = require('uuid');

class Channel {
    constructor(title, text, htmlUrl, type, xmlUrl) {
        this.IDChannel = uuid.v1(); //Clé de partition primaire
        this.title = title;
        this.text = text;
        this.htmlUrl = htmlUrl;
        this.type = type;
        this.xmlUrl = xmlUrl;
        this.publishedFeed =['null'];
    }
};

let channelType = {
        IDChannel: "S",
        title: "S",
        text: "S",
        htmlUrl: "S",
        type: "S",
        xmlUrl: "S",
        publishedFeed: "SS"
    },
    ChannelDefault = function () {
        this.publishedFeed = ['null'];
    };
exports.Channel = Channel;
exports.channelType = channelType;
'use strict';
let uuid = require('uuid');

class Channel {
    constructor(title, text, htmlUrl, type, xmlUrl) {
        this.IDChannel = uuid.v1();
        this.title = title;
        this.text = text;
        this.htmlUrl = htmlUrl;
        this.type = type;
        this.xmlUrl = xmlUrl;
    }
};

let channelType = {
    IDChannel: "S",
    title: "S",
    text: "S",
    htmlUrl: "S",
    type: "S",
    xmlUrl: "S"
};
exports.Channel = Channel;
exports.channelType = channelType;
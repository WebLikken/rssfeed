'use strict';

class Channel {
    constructor(IDChannel, IDCategory, title, text, htmlUrl, type, xmlUrl {
        this.IDChannel = IDChannel;
        this.IDCategory = IDCategory;
        this.title = title;
        this.text = text;
        this.htmlUrl = htmlUrl;
        this.type = type;
        this.xmlUrl = xmlUrl;
    }
}

exports.Channel = Channel;
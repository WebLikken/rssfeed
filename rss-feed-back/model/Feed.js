'use strict';


class Feed {
    constructor(IDChannel, title, content, published, author, link, feed) {
        this.IDChannel = IDChannel; //Clé de partition primaire
        this.published = new Date(published).getTime();  //Clé de tri primaire
        this.title = title;
        this.content = content;
        this.author = author;
        this.link = link;
        this.feed = feed;
        if (typeof published === 'undefined') {
            console.log('published non renseigné pour feed : ', IDChannel, title, content, published, author, link, feed);
        }
    }
};
let feedType = {
    IDChannel: "S",
    published: "S",
    title: "S",
    content: "S",
    author: "S",
    link: "S",
    feed: "M"
};

exports.Feed = Feed;
exports.feedType = feedType;
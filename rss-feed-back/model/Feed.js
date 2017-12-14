'use strict';


class Feed {
    constructor(IDChannel, title, content, published, author, link, feed) {
        this.IDChannel = IDChannel;
        this.published = published;
        this.IDFeed = this.IDChannel + '_' + this.published;
        this.title = title;
        this.content = content;
        this.author = author;
        this.link = link;
        this.feed = feed;
        if (typeof published === 'undefined') {
            console.warn('published non renseigné pour feed : ', IDChannel, title, content, published, author, link, feed);
        }
    }
};
let feedType = {
    published: "S",
    IDChannel: "S",
    IDFeed: "S",
    title: "S",
    content: "S",
    author: "S",
    link: "S",
    feed : "M"

}
;

exports.Feed = Feed;
exports.feedType = feedType;
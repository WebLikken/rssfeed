'use strict';


class Feed {
    constructor(IDFeed, IDChannel, title, content, published, author, link, feed) {
        this.IDFeed = IDFeed;
        this.IDChannel = IDChannel;
        this.title = title;
        this.content = content;
        this.published = published;
        this.author = author;
        this.link = link;
        this.feed = feed;
    }
}

exports.Feed = Feed;
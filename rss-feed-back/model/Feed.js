'use strict';


class Feed {
    constructor(IdFeed, IdChannel, title, content, published, author, link, feed) {
        this.IdFeed = IdFeed;
        this.IdChannel = IdChannel;
        this.title = title;
        this.content = content;
        this.published = published;
        this.author = author;
        this.link = link;
        this.feed = feed;
    }
}

exports.Feed = Feed;
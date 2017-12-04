'use strict';

let utiltyService = require(__base + '/services/utility-service'),
    Category = require(__base + '/model/category').Category,
    ChannelService = require(__base + '/services/channel-service'),
    categoryService = require(__base + '/services/category-service'),
    CATEGORY_DEFAULT = require(__base + 'model/Category').CATEGORY_DEFAULT,
    util = require('util');

/**
 *
 * @param opml OPLM to JSON Object
 * @returns {Array} Of categories and channels
 */
let getCategoriesAndChannels = function (opml) {

        let oplmCategories = opml.body.outline,
            categoriesAndChannels = [], unclassifiedCategory = CATEGORY_DEFAULT;

        if (oplmCategories.length > 0) {
            for (let i = 0; i < oplmCategories.length; i += 1) {
                let oplmCategory = oplmCategories[i];
                if (util.isArray(oplmCategory.outline)) {
                    let category = utiltyService.cloneSimpleOject(oplmCategory, true, false);
                    category.channels = [];
                    for (let j = 0; j < oplmCategory.outline.length; j++) {
                        let cloneObj = utiltyService.cloneSimpleOject(oplmCategory.outline[j], true, false);
                        category.channels.push(cloneObj);
                    }
                    categoriesAndChannels.push(category);
                } else if (typeof oplmCategory.outline === 'undefined') {
                    let cloneObj = utiltyService.cloneSimpleOject(oplmCategory, true);
                    unclassifiedCategory.channels.push(cloneObj);

                } else {
                    let category = utiltyService.cloneSimpleOject(oplmCategory, true),
                        channel = utiltyService.cloneSimpleOject(oplmCategory.outline, true);
                    delete category.outline;
                    category.channels = [channel];
                    categoriesAndChannels.push(category);
                }
            }
        }
        categoriesAndChannels.push(unclassifiedCategory);
        return categoriesAndChannels;
    },
    getAllChannels = function (opml) {
        let categoriesAndChannels = this.getCategoriesAndChannels(opml),
            channels = [];
        categoriesAndChannels.forEach(function (category) {
            if (category && category.channels && category.channels.length > 0) {
                category.channels.forEach(function (channel) {
                    channels.push(channel);
                });
            }
        });
        return channels;

    },
    importCategoriesAndChannels = function (opml, IDUser) {
        let channels = [], categories = [];
        this.getAllChannels(opml).forEach(function (channel) {
            channels.push(ChannelService.createChannelClass(channel));
        });

        this.getCategoriesAndChannels(opml).forEach(function (_category) {
            let category = utiltyService.cloneSimpleOject(_category, true, false);
            category.channels = [];
            if (_category.channels && _category.channels.length > 0) {
                _category.channels.forEach(function (_channel) {

                    let IDChannel;
                    for (let i = 0; i < channels.length; i += 1) {
                        let channel = channels[i];
                        if (channel.xmlUrl === _channel.xmlUrl) {
                            IDChannel = channel.IDChannel;
                            console.log(i,IDChannel );
                            break;
                        }
                    }
                    let isPresent = category.channels.some(
                        function(_ID){
                            return _ID===IDChannel;
                        });
                    console.log(isPresent);
                    category.channels.push(IDChannel);
                });
            }
            categories.push(category);
        });
        categoryService.createCategoriesAndSave_P(IDUser, categories)
            .then(
                function (data) {
                    console.log(data);
                },
                function (error) {
                    console.error(error);
                });
    };

exports.getCategoriesAndChannels = getCategoriesAndChannels;
exports.importCategoriesAndChannels = importCategoriesAndChannels;
exports.getAllChannels = getAllChannels;

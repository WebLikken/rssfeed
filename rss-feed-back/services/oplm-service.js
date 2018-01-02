'use strict';
let utiltyService = require(__base + '/services/utility-service');
let channelService = require(__base + '/services/channel-service');
let categoryService = require(__base + '/services/category-service');
let feedService = require(__base + '/services/feed-service');
let CetegoryDefault = require(__base + '/model/Category').CetegoryDefault;
let dtoCategory = require(__base + 'dto-services/dto-category-service');
let util = require('util');
let feed = require("feed-read");

var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed

let getCategoriesAndChannels;
let getAllChannels;
let importCategoriesAndChannels_p;
let importValidatedChannels_p;
/**
 *  Extraction des Catégories et des channels associés
 * @param opml OPLM to JSON Object
 * @returns {Array} Of categories and channels
 */
getCategoriesAndChannels = function (opml) {

    let oplmCategories = opml.body.outline,
        categoriesAndChannels = [], unclassifiedCategory = new CetegoryDefault();

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
};
/**
 * Extraction des Channels du fichier d'import oplm
 * @param opml OPLM to JSON Object
 * @returns {Array}
 */
getAllChannels = function (opml) {
    let categoriesAndChannels = getCategoriesAndChannels(opml),
        channels = [];
    categoriesAndChannels.forEach(function (category) {
        if (category && category.channels && category.channels.length > 0) {
            category.channels.forEach(function (channel) {
                channels.push(channel);
            });
        }
    });
    return channels;

};
/**
 * Méthode générale d'import du oplm avec écriture en base des catégories et channels
 * @param opml
 * @param IDUser
 */
importCategoriesAndChannels_p = function (opml, IDUser) {
    return new Promise((resolve, reject) => {
        let that = this;
        let channels = [],
            validatedChannels = [],
            categories = [],
            dbExistingCategories,
            dbExistingChannel;
        console.log('oplm-service - importCategoriesAndChannels - Enterring in function');

// Validation flux channels
        this.importValidatedChannels_p(opml, IDUser)
            .then(
                function (allChannels) {

                    console.log('oplm-service - importCategoriesAndChannels - importValidatedChannels_p get ', allChannels.length, ' channels');

                    allChannels.forEach(function (channelValidation) {
                        if (!channelValidation.error) {
                            validatedChannels.push(channelValidation.channel);
                        } else {
                            console.log('oplm-service - importCategoriesAndChannels - importValidatedChannels_p error' + channelValidation.channel.xmlUrl);
                        }
                    });
                    channelService.getAllChannels_p().then(function (allChannels) {
                        console.log('oplm-service - importCategoriesAndChannels - getAllChannels_p get ' + allChannels.length + ' channels');

                        dbExistingChannel = allChannels;
                        validatedChannels.forEach(function (channel) {
                            // Si channel non présente en db on l'ajoute
                            if (!channelService.getChannelIfExists(channel, dbExistingChannel)) {
                                console.log('oplm-service - importCategoriesAndChannels - creation Array push ', JSON.stringify(channel));
                                channels.push(channelService.createChannelClass(channel));

                            }
                        });
                        console.log('oplm-service - importCategoriesAndChannels - saveChannels_P of ', channels.length, ' new channels');
                        channelService.saveChannels_P(IDUser, channels)
                            .then(
                                function (result) {
                                    console.log('oplm-service - importCategoriesAndChannels - saveChannels_P finished result : ', JSON.stringify(result));

                                    console.log('oplm-service - importCategoriesAndChannels - getAllCategoriesByUSer_P : ', IDUser);

                                    categoryService.getAllCategoriesByUSer_P(IDUser)
                                        .then(
                                            function (response) {
                                                dbExistingCategories = response;
                                                console.log('oplm-service - importCategoriesAndChannels - getAllCategoriesByUSer_finished result get ', response.length, ' categories');

                                                that.getCategoriesAndChannels(opml).forEach(function (_category) {
                                                    let categoryIfExists = categoryService.getCategoryIfExists(_category, dbExistingCategories),
                                                        category, IDChannelOfCategory = [];
                                                    // Initialisation category
                                                    if (!categoryIfExists) {

                                                        // Si nouvelle catégorie
                                                        category = categoryService.createCategoryClass(IDUser, utiltyService.cloneSimpleOject(_category, true, false));
                                                        console.log('oplm-service - importCategoriesAndChannels - getCategoriesAndChannels New Category ', JSON.stringify(category));
                                                    } else {
                                                        // Si catégorie déjà présente en DB
                                                        category = categoryIfExists;
                                                        // Récupération des IDChannels associées à category
                                                        category.channels.values.forEach(function (channel) {
                                                            if (typeof channel === 'undefined') {
                                                                console.log('toto');
                                                            }
                                                            IDChannelOfCategory.push(channel);
                                                        });
                                                        console.log('oplm-service - importCategoriesAndChannels - getCategoriesAndChannels Existing Category ', JSON.stringify(category));
                                                        console.log('oplm-service - importCategoriesAndChannels - getCategoriesAndChannels Existing Category Updating channels', JSON.stringify(category.channels));

                                                    }

                                                    if (_category.channels && _category.channels.length > 0) {
                                                        _category.channels.forEach(function (_channel) {
                                                            let IDChannel,
                                                                existingChannel = channelService.getChannelIfExists(_channel, dbExistingChannel),
                                                                isIDPresentInChannelOfCategory;

                                                            if (existingChannel) {
                                                                IDChannel = existingChannel.IDChannel;

                                                            } else {
                                                                for (let i = 0; i < channels.length; i += 1) {
                                                                    let channel = channels[i];
                                                                    if (channel.xmlUrl === _channel.xmlUrl) {
                                                                        IDChannel = channel.IDChannel;
                                                                        break;
                                                                    }
                                                                }
                                                            }
                                                            isIDPresentInChannelOfCategory = IDChannelOfCategory.some(function (element) {
                                                                return (element === IDChannel);
                                                            });
                                                            if (!isIDPresentInChannelOfCategory) {

                                                                if (typeof IDChannel !== 'undefined') {
                                                                    IDChannelOfCategory.push(IDChannel);
                                                                    console.log('oplm-service - importCategoriesAndChannels - getCategoriesAndChannels Existing Category Updating channels pushing new channel: ', IDChannel);
                                                                }

                                                            }
                                                        });
                                                    }

                                                    if (categoryIfExists) {
                                                        console.log('oplm-service - importCategoriesAndChannels - updateChannels Updating to DB existing Category :', categoryIfExists.IDCategory, ' / Channels :', JSON.stringify(IDChannelOfCategory));

                                                        dtoCategory.updateChannels(IDUser, categoryIfExists.IDCategory, IDChannelOfCategory,
                                                            function (response) {
                                                                console.log('oplm-service - importCategoriesAndChannels - updateChannels Updating to DB existing Category :', categoryIfExists.IDCategory, ' / Retour :', JSON.stringify(response));

                                                            });

                                                    } else {
                                                        category.channels = IDChannelOfCategory;
                                                        console.log('oplm-service - importCategoriesAndChannels - New Category Ajout channel : ', JSON.stringify(IDChannelOfCategory));
                                                        if (category.channels.length > 0) {
                                                            console.log('oplm-service - importCategoriesAndChannels - Add New Category to Array : ', JSON.stringify(category));
                                                            categories.push(category);
                                                        } else {
                                                            console.log('oplm-service - importCategoriesAndChannels - Suppression category car pas de channel attaché : ', JSON.stringify(category));
                                                        }
                                                    }
                                                });
                                                console.log('oplm-service - importCategoriesAndChannels - Saving ', categories.length, ' Categories to DB : ');

                                                categories.forEach(function (category, index) {
                                                    console.log('oplm-service - importCategoriesAndChannels - Category ', index, ' : ', JSON.stringify(category));

                                                });
                                                categoryService.saveCategories_P(categories)
                                                    .then(
                                                        function (result) {
                                                            console.log('oplm-service - importCategoriesAndChannels - Saved Result : ', JSON.stringify(result));
                                                            resolve(result);
                                                        },
                                                        function (err) {
                                                            console.log('oplm-service - importCategoriesAndChannels - saveCategories_P error : ', JSON.stringify(err));
                                                            reject(err);
                                                        });
                                            },
                                            function (error) {
                                                console.log('oplm-service - importCategoriesAndChannels - getAllCategoriesByUSer_P error : ', JSON.stringify(error));
                                                reject(error);
                                            });
                                },
                                function (error) {
                                    console.log('oplm-service - importCategoriesAndChannels - saveChannels_P error : ', JSON.stringify(error));
                                    reject(error);
                                });
                    });
                }, function (error) {
                    console.log('oplm-service - importCategoriesAndChannels - importValidatedChannels_p error : ', JSON.stringify(error));

                    reject(error);
                });
    });
};
/**
 * Méthode générale d'import du oplm avec écriture en base des catégories et channels
 * @param opml
 * @param IDUser
 */
importValidatedChannels_p = function (opml, IDUser) {

    let promises = [];
    getAllChannels(opml).forEach(function (channel) {
        promises.push(new Promise(function (resolve, reject) {
            return feedService.readFeeds_P(channel).then(
                function (result) {
                    resolve({error: null, channel: channel, data: result});
                },
                function (error) {
                    resolve({error: error, channel: channel, data: []});
                });
        }));
    });
    return Promise.all(promises);
};

exports.getCategoriesAndChannels = getCategoriesAndChannels;
exports.getAllChannels = getAllChannels;
exports.importCategoriesAndChannels_p = importCategoriesAndChannels_p;
exports.importValidatedChannels_p = importValidatedChannels_p;
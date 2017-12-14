'use strict';
let utiltyService = require(__base + '/services/utility-service');
let channelService = require(__base + '/services/channel-service');
let categoryService = require(__base + '/services/category-service');
let CetegoryDefault = require(__base + '/model/Category').CetegoryDefault;
let dtoCategory = require(__base + 'dto-services/dto-category-service');
let util = require('util');
let feed = require("feed-read");

let getCategoriesAndChannels;
let getAllChannels;
let importCategoriesAndChannels;
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
importCategoriesAndChannels = function (opml, IDUser) {
    let that = this;
    let channels = [],
        validatedChannels = [],
        categories = [],
        dbExistingCategories,
        dbExistingChannel;


// Validation flux channels
    this.importValidatedChannels_p(opml, IDUser).then(function (allChannels) {
        allChannels.forEach(function (channelValidation) {
            if (!channelValidation.error) {
                validatedChannels.push(channelValidation.channel);
            }
        });
        channelService.getAllChannels_p().then(function (allChannels) {
            dbExistingChannel = allChannels;
            validatedChannels.forEach(function (channel) {
                // Si channel non présente en db on l'ajoute
                if (!channelService.getChannelIfExists(channel, dbExistingChannel)) {
                    channels.push(channelService.createChannelClass(channel));
                }
            });
            console.log('Ecriture en base des channels validés et triés si déjà présents');
            console.log(JSON.stringify(channels));
            channelService.saveChannels_P(IDUser, channels).then(
                function (result) {
                    console.log(JSON.stringify(result));

                    categoryService.getAllCategoriesByUSer(IDUser).then(function (response) {
                        dbExistingCategories = response.Items;


                        that.getCategoriesAndChannels(opml).forEach(function (_category) {
                            let categoryIfExists = categoryService.getCategoryIfExists(_category, dbExistingCategories),
                                category, IDChannelOfCategory = [];
                            // Initialisation category
                            if (!categoryIfExists) {
                                // Si nouvelle catégorie
                                category = categoryService.createCategoryClass(IDUser, utiltyService.cloneSimpleOject(_category, true, false));
                            } else {
                                // Si catégorie déjà présente en DB
                                category = categoryIfExists;
                                // Récupération des IDChannels associées à category
                                category.channels.values.forEach(function (channel) {
                                    IDChannelOfCategory.push(channel);
                                });
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

                                        IDChannelOfCategory.push(IDChannel);
                                    }
                                });
                            }

                            if (categoryIfExists) {
                                dtoCategory.updateChannels(IDUser, categoryIfExists.IDCategory, IDChannelOfCategory,
                                    function (response) {
                                    });

                            } else {
                                category.channels = IDChannelOfCategory;
                                categories.push(category);
                            }
                        });
                        categoryService.saveCategories_P(categories)
                            .then();
                    }, function (err) {
                        console.log(err);
                    });
                });
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
        promises.push(
            new Promise((resolve, reject) => {
                feed(channel.xmlUrl, function (error, data) {
                    resolve({error: error, channel: channel, data: data});
                });
            })
        );
    });
    return Promise.all(promises);
};

exports.getCategoriesAndChannels = getCategoriesAndChannels;
exports.getAllChannels = getAllChannels;
exports.importCategoriesAndChannels = importCategoriesAndChannels;
exports.importValidatedChannels_p = importValidatedChannels_p;
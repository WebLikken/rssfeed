'use strict';

const utiltyService = require(__base + '/services/utility-service');
/**
 *
 * @param opml OPLM to JSON Object
 * @returns {Array} Of categories and channels
 */
let getCategoriesAndChannels = function (opml) {

    let oplmCategories = opml.body.outline,
        categoriesAndChannels = [];

    if (oplmCategories.length > 0) {
        for (let i = 0; i < oplmCategories.length; i += 1) {
            let oplmCategory = oplmCategories[i];
            if (oplmCategory.outline && oplmCategory.outline.length > 0) {
                let category = utiltyService.cloneSimpleOject(oplmCategory, true, false);
                category.channels = [];
                for (let j = 0; j < oplmCategory.outline.length; j++) {
                    let cloneObj = utiltyService.cloneSimpleOject(oplmCategory.outline[j], true, false);
                    category.channels.push(cloneObj);
                }
                categoriesAndChannels.push(category);
            }
        }
    }
    return categoriesAndChannels;

};
let getAllChannels = function (opml) {

    let oplmCategories = opml.body.outline,
        allChannels = [];

    if (oplmCategories.length > 0) {
        for (let i = 0; i < oplmCategories.length; i += 1) {
            let oplmCategory = oplmCategories[i];
            if (oplmCategory.outline && oplmCategory.outline.length > 0) {
                for (let j = 0; j < oplmCategory.outline.length; j++) {
                    let cloneObj = utiltyService.cloneSimpleOject(oplmCategory.outline[j], true, false);
                    allChannels.push(cloneObj);
                }
            } else if(oplmCategory && oplmCategory.outline) {
                let cloneObj = utiltyService.cloneSimpleOject(oplmCategory.outline, true, false);
                allChannels.push(cloneObj);
            }
        }
    }
    return allChannels;

};
exports.getCategoriesAndChannels = getCategoriesAndChannels;
exports.getAllChannels = getAllChannels;
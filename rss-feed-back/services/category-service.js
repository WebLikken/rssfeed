'use strict';
let Category = require(__base + 'model/Category').Category;
let dto = require(__base + 'dto-services/dto-general-service');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;


let getCategories, createCategoryAndSave_P, getCategoryIfExists, createCategoryClass, saveCategories_P,
    addChannelOnCategory,
    getAllCategoriesByUSer_P;

/*getCategories = function (opml) {
    return getChanel(url, function (err, result) {
        return result.feed;
    });
};*/
createCategoryAndSave_P = function (IDUser, _category) {

    return new Promise((resolve, reject) => {
        let category = createCategoryClass(IDUser, _category);
        dto.put(AWS_CONFIG.TABLE_CATEGORY, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};
/**
 *
 * @param _category
 * @param allUserCategories
 * @returns {Object}
 */
getCategoryIfExists = function (_category, allUserCategories) {
    let propertiesToCkeck = ['text', 'title'], i;
    for (i = 0; i < allUserCategories.length; i += 1) {
        let category = allUserCategories[i], exist;
        for (let j = 0; j < propertiesToCkeck.length; j += 1) {
            let prop = propertiesToCkeck[j],
                check = category[prop] === _category[prop];

            exist = typeof exist === 'undefined' ? check : exist && check;
        }
        if (exist) {
            return category;
        }
    }
};
createCategoryClass = function (IDUser, _category) {
    return new Category(IDUser, _category.IDCategory, _category.text, _category.title, _category.channels);
};
/**
 *
 * @param IDUser {String}
 * @param _categories {Array of category}
 * @returns {Promise}
 */
saveCategories_P = function (categories) {
    return new Promise((resolve, reject) => {

        dto.batchWriteItem(AWS_CONFIG.TABLE_CATEGORY, categories, function (error, data) {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
};
getAllCategoriesByUSer_P = function (IDUser) {
    return new Promise((resolve, reject) => {
        let key = 'IDUser';
        let params = {};

        params.TableName = AWS_CONFIG.TABLE_CATEGORY;
        params.KeyConditionExpression = '#' + key + ' = :' + key;
        params.ExpressionAttributeNames = {};
        params.ExpressionAttributeNames['#' + key] = key;
        params.ExpressionAttributeValues = {};
        params.ExpressionAttributeValues[':' + key] = IDUser;

        dto.query(params).then(function (data) {
            resolve(data.Items);
        }, function (err) {
            reject(err);
        });

    });
};
addChannelOnCategory = function () {

};
exports.createCategoryAndSave_P = createCategoryAndSave_P;
exports.saveCategories_P = saveCategories_P;
exports.createCategoryClass = createCategoryClass;
exports.getCategoryIfExists = getCategoryIfExists;
exports.getAllCategoriesByUSer_P = getAllCategoriesByUSer_P;

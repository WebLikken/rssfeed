'use strict';
let Category = require(__base + 'model/Category').Category,
    dto = require(__base + 'dto-services/dto-service'),
    AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;


/**
 *
 * @param opml OPLM to JSON Object
 * @returns {Array} Of categories and
 */
let getCategories = function (opml) {
        return getChanel(url, function (err, result) {
            return result.feed;
        });
    },
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
    },
    createCategoryClass = function (IDUser, _category) {
        let category = new Category(IDUser);
        category.text = _category.text;
        category.title = _category.title;
        if (_category.channels && _category.channels.length) {
            category.channels = _category.channels;
        }
        return category;
    },
    createCategoriesAndSave_P = function (IDUser, _categories) {
        return new Promise((resolve, reject) => {
            let categories = [], that = this;
            _categories.forEach(function (category) {
                categories.push(that.createCategoryClass(IDUser, category));
            });
            dto.batchWriteItem(AWS_CONFIG.TABLE_CATEGORY,categories, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    };
//exports.getFeedsFromChannel = getFeedsFromChannel;
exports.createCategoryAndSave_P = createCategoryAndSave_P;
exports.createCategoriesAndSave_P = createCategoriesAndSave_P;
exports.createCategoryClass = createCategoryClass;

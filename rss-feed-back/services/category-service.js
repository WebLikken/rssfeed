'use strict';
let Category = require(__base + 'model/Category').Category,
    dtoCategory = require(__base + 'dto-services/dto-category');


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
            let category = createCategory(IDUser, _category);
            dtoCategory.put(category, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    },
    createCategory = function (IDUser, _category) {
        let category = new Category(IDUser);
        category.text = _category.text;
        category.title = _category.title;
        return category;
    },
    createCategoriesAndSave_P = function (IDUser, _categories) {
        let categories = [];
        _categories.forEach(function (category) {
            categories.push(createCategory(IDUser, category));
        });
        return new Promise((resolve, reject) => {
            dtoCategory.batchWriteItem(categories, function (error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    } ;
//exports.getFeedsFromChannel = getFeedsFromChannel;
exports.createCategoryAndSave_P = createCategoryAndSave_P;
exports.createCategoriesAndSave_P = createCategoriesAndSave_P;

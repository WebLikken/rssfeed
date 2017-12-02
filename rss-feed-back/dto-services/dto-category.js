'use strict';
const AWS = require('aws-sdk');
const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG,
    categoryType = require(__base + 'model/Category').categoryType;

AWS.config.update({region: 'us-east-2'});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient(),
    dynamoDb = new AWS.DynamoDB();


let put = (Item, callback) => {
        let params = {
            TableName: AWS_CONFIG.TABLE_CATEGORY,
            Item: Item
        };

        dynamoDbDocumentClient.put(params, (error, data) => {
            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    },
    batchWriteItem = (items, callback) => {
        let objectRequest = {
            RequestItems: {}
        };
        objectRequest.RequestItems[AWS_CONFIG.TABLE_CATEGORY] = [];
        items.forEach(function (category) {
            let item = {};
            for (let property in category) {
                if (category.hasOwnProperty(property)) {
                    let typeKey = categoryType[property];
                    item[property] = {};
                    item[property][typeKey] = category[property];
                }
            }
            objectRequest.RequestItems[AWS_CONFIG.TABLE_CATEGORY].push({PutRequest: {Item: item}});
        });

        dynamoDb.batchWriteItem(objectRequest, (error, data) => {

            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    },
    query = (IDUser, callback) => {
        let key = 'IDUser',
            params = {};

        params.TableName = AWS_CONFIG.TABLE_CATEGORY;
        params.KeyConditionExpression = '#' + key + ' = :' + key;
        params.ExpressionAttributeNames = {};
        params.ExpressionAttributeNames['#' + key] = key;
        params.ExpressionAttributeValues = {};
        params.ExpressionAttributeValues[':' + key] = IDUser;



        dynamoDbDocumentClient.query(params, (error, data) => {
            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    }
;

exports.put = put;
exports.batchWriteItem = batchWriteItem;
exports.query = query;
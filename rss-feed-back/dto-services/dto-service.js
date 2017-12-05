'use strict';
const AWS = require('aws-sdk');
const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG,
    channelType = require(__base + 'model/Channel').channelType,
    categoryType = require(__base + 'model/Category').categoryType;

AWS.config.update({region: 'us-east-2'});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient(),
    dynamoDb = new AWS.DynamoDB();

let put = (table, Item, callback) => {
        let params = {
            TableName: table,
            Item: Item
        };

        dynamoDbDocumentClient.put(params, (error, data) => {
            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    },
    batchWriteItem = (table, items, callback) => {
        let objectRequest = {
            RequestItems: {}
        }, types;

        switch (table) {
            case AWS_CONFIG.TABLE_CATEGORY:
                types = categoryType;
                break;
            case  AWS_CONFIG.TABLE_CHANNEL:
                types = channelType;
                break;
        }
        objectRequest.RequestItems[table] = [];
        items.forEach(function (_item) {
            let item = {};
            for (let property in _item) {
                if (_item.hasOwnProperty(property)) {
                    let typeKey = types[property];
                    // Les propriétés dont leurs valeurs sont undefined ne sont pas ajoutées
                    if (_item[property]) {
                        item[property] = {};
                        item[property][typeKey] = _item[property];
                    }
                }
            }
            objectRequest.RequestItems[table].push({PutRequest: {Item: item}});
        });
        dynamoDb.batchWriteItem(objectRequest, (error, data) => {
            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    },
    query = (table, IDUser, callback) => {
        let key = 'IDUser',
            params = {};

        params.TableName = table;
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

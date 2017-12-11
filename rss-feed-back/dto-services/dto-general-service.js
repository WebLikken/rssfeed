'use strict';
const AWS = require('aws-sdk');
const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG,
    channelType = require(__base + 'model/Channel').channelType,
    categoryType = require(__base + 'model/Category').categoryType;

AWS.config.update({region: 'us-east-2'});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient(),
    dynamoDb = new AWS.DynamoDB();
/**
 * dynamoDbDocumentClient put operation
 * @param table
 * @param Item
 * @param callback
 */
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
    getItem = (params, callback) => {
        dynamoDb.getItem(params, (error, data) => {
            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    },
    /**
     * dynamoDbDocumentClient batchWriteItem operation
     * @param table
     * @param items
     * @param callback
     */
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
        if(objectRequest.RequestItems[table].length>0){
            dynamoDb.batchWriteItem(objectRequest, (error, data) => {
                if (error) {
                    console.error(error);
                }
                callback(error, data);
            });
        }

    },
    /**
     * dynamoDbDocumentClient Scan operation
     * @param table
     * @param IDUser
     * @param callback
     */
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
    },
    /**
     * dynamoDbDocumentClient Scan operation
     * @param table
     * @param params
     * @returns {Promise}
     */
    scan = (params) => {
        return new Promise(function executor(resolve, reject) {
            let dataArray = [],
                count = 0,
                onScan = function (err, data) {
                    if (err) {
                        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
                        reject(err);
                    } else {
                        data.Items.forEach(function (itemdata) {
                            dataArray.push(itemdata);
                        });

                        // continue scanning if we have more items
                        if (typeof data.LastEvaluatedKey !== "undefined") {
                            console.log("Scanning for more...");
                            params.ExclusiveStartKey = data.LastEvaluatedKey;
                            dynamoDbDocumentClient.scan(params, onScan);
                        } else {
                            resolve(dataArray);
                        }
                    }
                };
            dynamoDbDocumentClient.scan(params, onScan);
        });

    },
    convertDynamoDBRecordToJSObject = (dynamoDbRecord) => {
        return AWS.DynamoDB.Converter.output(dynamoDbRecord);
    };

exports.put = put;
exports.batchWriteItem = batchWriteItem;
exports.query = query;
exports.scan = scan;
exports.getItem = getItem;
exports.convertDynamoDBRecordToJSObject = convertDynamoDBRecordToJSObject;
'use strict';
let AWS = require('aws-sdk');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
let channelType = require(__base + 'model/Channel').channelType;
let categoryType = require(__base + 'model/Category').categoryType;
let feedType = require(__base + 'model/Feed').feedType;
let attr = require('dynamodb-data-types').AttributeValue;

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
                console.log(error);
            }
            callback(error, data);
        });
    },
    update = (params, callback) => {
        dynamoDbDocumentClient.update(params, (error, data) => {
            if (error) {
                console.log(error);
            }
            callback(error, data);
        });
    },
    getItem = (params, callback) => {
        dynamoDb.getItem(params, (error, data) => {
            if (error) {
                console.log(error);
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
            case  AWS_CONFIG.TABLE_FEED:
                types = feedType;
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
                        if (typeKey === 'S') {
                            item[property][typeKey] = _item[property].toString();

                        } else if (typeKey === "M") {
                            item[property][typeKey] = attr.wrap(_item[property]);

                        } else {
                            item[property][typeKey] = _item[property];

                        }
                    }
                }
            }
            objectRequest.RequestItems[table].push({PutRequest: {Item: item}});
        });
        if (objectRequest.RequestItems[table].length > 0) {
            dynamoDb.batchWriteItem(objectRequest, (error, data) => {
                if (error) {
                    console.log(error);
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
    query = (params) => {

        return new Promise(function (resolve, reject) {
            dynamoDbDocumentClient.query(params, (error, data) => {
                if (!error) {
                    resolve(data);
                } else {
                    reject(error);
                }
            });
        });


    };
/**
 * dynamoDbDocumentClient Scan operation
 * @param table
 * @param params
 * @returns {Promise}
 */
let scan = function (params) {
    return new Promise(function (resolve, reject) {
        let dataArray = [];

        function onScan(err, data) {
            if (err) {
                console.log("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
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
        }

        dynamoDbDocumentClient.scan(params, onScan);
    });

};
let deleteTable = function (table) {
    return new Promise(function (resolve, reject) {
        let params = {
            TableName: table
        };

        dynamoDb.deleteTable(params, function (err, data) {
            resolve(err, data);
        });
    });
};
let waitingStatusTableActive = function (table, redirectCount) {
    redirectCount = redirectCount || 0;
    if (redirectCount > 1000) {
        throw new Error("Redirected too many times.");
    }

    return new Promise(function (resolve) {
        let params = {
            TableName: table
        };
        dynamoDb.describeTable(params, function (err, data) {
            resolve({err: err, data: data});
        });
    }).then(function (result) {
        if (result.err) {
            return result.err.message;
        }
        let tableStatus = '';
        if (result.data && result.data && result.data.Table && result.data.Table.TableStatus) {
            tableStatus = result.data.Table.TableStatus;
            console.log(table, ', status : ', tableStatus);

        }
        if (tableStatus === '' || tableStatus === 'CREATING' || tableStatus === 'DELETING') {
            return waitingStatusTableActive(table, redirectCount + 1);
        } else {
            return result.data.Table.TableStatus;
        }
    });
};

exports.put = put;
exports.update = update;
exports.batchWriteItem = batchWriteItem;
exports.query = query;
exports.scan = scan;
exports.getItem = getItem;
exports.deleteTable = deleteTable;
exports.waitingStatusTableActive = waitingStatusTableActive;
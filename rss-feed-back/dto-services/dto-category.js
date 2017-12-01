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
        console.log('put', JSON.stringify(Item));

        dynamoDbDocumentClient.put(params, (error, data) => {
            let response;
            // handle potential errors
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
            let response;
            // handle potential errors
            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    },
    batchGetItem = (IDUser, callback) => {
        let key = 'IDUser',
        keyType = categoryType[key];

        let objectRequest = {
                RequestItems: {}
            },
            keyObject = {};
        keyObject[key] = {};
        keyObject[key][keyType] = IDUser;
        objectRequest.RequestItems[AWS_CONFIG.TABLE_CATEGORY] = {Keys:[keyObject]};


        /*let objectRequest = {
            "RequestItems": {
                "Forum": {
                    "Keys": [
                        {
                            "Name": {"S": "Amazon DynamoDB"}
                        },
                        {
                            "Name": {"S": "Amazon RDS"}
                        },
                        {
                            "Name": {"S": "Amazon Redshift"}
                        }
                    ],
                    "ProjectionExpression": "Name, Threads, Messages, Views"
                },
                "Thread": {
                    "Keys": [
                        {
                            "ForumName": {"S": "Amazon DynamoDB"},
                            "Subject": {"S": "Concurrent reads"}
                        }
                    ],
                    "ProjectionExpression": "Tags, Message"
                }
            },
            "ReturnConsumedCapacity": "TOTAL"
        };*/


        dynamoDb.batchGetItem(objectRequest, (error, data) => {
            let response;
            // handle potential errors
            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    }
;

exports.put = put;
exports.batchWriteItem = batchWriteItem;
exports.batchGetItem = batchGetItem;
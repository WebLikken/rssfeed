'use strict';
const AWS = require('aws-sdk');
const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG,
    channelType = require(__base + 'model/Channel').channelType;

AWS.config.update({region: 'us-east-2'});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient(),
    dynamoDb = new AWS.DynamoDB();

// TODO Mutualiser avec dto-category
let put = (Item, callback) => {
        let params = {
            TableName: AWS_CONFIG.TABLE_CHANNEL,
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
        objectRequest.RequestItems[AWS_CONFIG.TABLE_CHANNEL] = [];
        items.forEach(function (channel) {
            let item = {};
            for (let property in channel) {
                if (channel.hasOwnProperty(property)) {
                    let typeKey = channelType[property];
                    item[property] = {};
                    item[property][typeKey] = channelType[property];
                }
            }
            objectRequest.RequestItems[AWS_CONFIG.TABLE_CHANNEL].push({PutRequest: {Item: item}});
        });

        dynamoDb.batchWriteItem(objectRequest, (error, data) => {

            if (error) {
                console.error(error);
            }
            callback(error, data);
        });
    }
;

exports.put = put;
exports.batchWriteItem = batchWriteItem;

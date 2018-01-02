'use strict';
let AWS = require('aws-sdk');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
let channelType = require(__base + 'model/Channel').channelType;
let type = require(__base + 'model/Feed').feedType;
let Dto = require(__base + 'Dto-services/Dto-general-service');

AWS.config.update({region: 'us-east-2'});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient(),
    dynamoDb = new AWS.DynamoDB();

let createTable_P = function () {
    return new Promise((resolve, reject) => {
        let params = {
            AttributeDefinitions: [
                {
                    AttributeName: "IDChannel",
                    AttributeType: type['IDChannel']
                },
                {
                    AttributeName: "published",
                    AttributeType: type['published']
                }
            ],
            KeySchema: [
                {
                    AttributeName: "IDChannel",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "published",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            },
            TableName: "Feed"
        };
        dynamoDb.createTable(params, function (err, data) {
            resolve(err, data);
        });
    });
};
let deleteTable_P = function () {
    return Dto.deleteTable(AWS_CONFIG.TABLE_FEED);
};


exports.createTable_P = createTable_P;
exports.deleteTable_P = deleteTable_P;
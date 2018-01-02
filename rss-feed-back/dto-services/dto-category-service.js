'use strict';
let AWS = require('aws-sdk');
let AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
let channelType = require(__base + 'model/Channel').channelType;
let categoryType = require(__base + 'model/Category').categoryType;
let type = require(__base + 'model/Category').categoryType;
let Dto = require(__base + 'Dto-services/Dto-general-service');

AWS.config.update({region: 'us-east-2'});

const dynamoDbDocumentClient = new AWS.DynamoDB.DocumentClient(),
    dynamoDb = new AWS.DynamoDB();


let updateChannels = (IDUser, IDCategory, channels, callback) => {
    let params = {
        TableName: AWS_CONFIG.TABLE_CATEGORY,
        Key: {
            'IDUser': {'S': IDUser},
            'IDCategory': {'S': IDCategory}
        },
        UpdateExpression: "set channels = :val1",
        ExpressionAttributeValues: {
            ":val1": {"SS": channels}
        },
        ReturnValues: "ALL_NEW"
    };
    /*var params = {
TableName: "TableName",
Key: { MyKeyName: "MyKeyValue" },
UpdateExpression: "ADD #Name1.StringSetName :Value1",
ExpressionAttributeNames: { "#Name1" : "mapName" },
ExpressionAttributeValues: { ":Value1": DB.createSet(["ValueToAdd"]) }
}*/

    dynamoDb.updateItem(params, (error, data) => {
        if (error) {
            console.log(error);
        }
        callback(error, data);
    });
};
let createTable_P = function () {
    return new Promise((resolve, reject) => {
        let params = {
            AttributeDefinitions: [
                {
                    AttributeName: "IDUser",
                    AttributeType: type['IDUser']
                },
                {
                    AttributeName: "IDCategory",
                    AttributeType: type['IDCategory']
                }
            ],
            KeySchema: [
                {
                    AttributeName: "IDUser",
                    KeyType: "HASH"
                },
                {
                    AttributeName: "IDCategory",
                    KeyType: "RANGE"
                }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            },
            TableName: "Category"
        };
        dynamoDb.createTable(params, function (err, data) {
                resolve(err, data);
        });
    });
};
let deleteTable_P = function () {
    return Dto.deleteTable(AWS_CONFIG.TABLE_CATEGORY);
};
exports.updateChannels = updateChannels;
exports.createTable_P = createTable_P;
exports.deleteTable_P = deleteTable_P;
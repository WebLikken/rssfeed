'use strict';
const AWS = require('aws-sdk');
const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG,
    channelType = require(__base + 'model/Channel').channelType,
    categoryType = require(__base + 'model/Category').categoryType;

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
            console.error(error);
        }
        callback(error, data);
    });
};

exports.updateChannels = updateChannels;
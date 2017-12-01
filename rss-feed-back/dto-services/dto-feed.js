'use strict';
const AWS = require('aws-sdk');
const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
AWS.config.update({region: 'us-east-2'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();


let put = (Item, callback) => {
    let params = {
        TableName: AWS_CONFIG.TABLE_FEED,
        Item: Item
    };


    dynamoDb.put(params, (error, data) => {
        let response;
        // handle potential errors
        if (error) {
            console.error(error);
        }
        callback(error, data);
    }
};

exports.put = put;
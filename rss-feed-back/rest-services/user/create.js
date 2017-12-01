'use strict';

const AWS = require('aws-sdk');

AWS.config.update({region:'us-east-2'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;

let create = (object, callback) => {
    const params = {
        TableName: AWS_CONFIG.TABLE_USER,
        Item: object
    };

    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t create the user item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
};
exports.create =create;
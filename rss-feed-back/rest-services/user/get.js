'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

AWS.config.update({region: 'us-east-2'});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;

let get = function(_params, callback) {
    const params = {
        TableName: AWS_CONFIG.TABLE_USER,
        Key: _params
    };

    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.log(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t fetch the todo item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};
exports.get = get;
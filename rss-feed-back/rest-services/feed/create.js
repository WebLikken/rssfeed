'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const AWS_CONFIG = require(__base + '/config/dto-config').AWS_CONFIG;
const feedServices = require(__base + '/services/feed-service');

// Plus nécessaire à mettre dans le dossier local config
// AWS.config.update({region:'us-east-2'});
//const dynamoDb = new AWS.DynamoDB({endpoint: new AWS.Endpoint('http://localhost:8000')}).DocumentClient;
var endPoint = new AWS.Endpoint('http://localhost:8000');
const dynamoDb = new AWS.DynamoDB.DocumentClient();


let create = (object, callback) => {
    const params = {
        TableName: AWS_CONFIG.TABLE_FEED,
        Item: {
            feedHashID:feedServices.getHashIDFeed(object),
            IDUser: uuid.v1(),
            feeds:'tesLBO'
        },
    };
    for(let prop in object){
        if (object.hasOwnProperty(prop)){
            if(object[prop]!==''){
                params.Item[prop] = object[prop];

            }
        }
    }
    console.log(JSON.stringify(params));
    params.Item.IDUser = "toto";

    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.log(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t create the todo item.',
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
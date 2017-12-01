'use strict';
global.__base = __dirname + '/';
require(__base +'/routes');
let dtoCategory = require(__base+'dto-services/dto-category');
let oplmServices = require(__base +'/services/oplm-service');
let oplm = require(__base +'/mock').getOplm;
//let categories = oplmServices.createCategories(oplm,'a941c1b0-d548-11e7-b68b-2df884680a57');



let toto= dtoCategory.batchGetItem('a941c1b0-d548-11e7-b68b-2df884680a57',function(err, data){
    console.log(err, data);
});

/*var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});

var params = {
    TableName: 'TABLE',
    Item: {
        'CUSTOMER_ID' : {N: '001'},
        'CUSTOMER_NAME' : {S: 'Richard Roe'},
    }
};

// Call DynamoDB to add the item to the table
ddb.putItem(params, function(err, data) {
    if (err) {
        console.log("Error", err);
    } else {
        console.log("Success", data);
    }
});*/
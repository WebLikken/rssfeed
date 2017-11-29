'use strict';
global.__base = __dirname + '/';
require(__base +'/routes');


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
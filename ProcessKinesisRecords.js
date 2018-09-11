'use strict'

console.log('Loading function');

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var recCnt = 0;

exports.handler = function(event, context, callback) {
    console.log(JSON.stringify(event, null, 2));
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        var payload = new Buffer(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
        
        recCnt++;
        var params = {
            Body: payload, 
            Bucket: process.env.S3_BUCKET_NAME,
            Key: "rec" + recCnt + ".txt"
        };
        s3.putObject(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        });
    });
    callback(null, "message");
};
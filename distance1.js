'use strict';

//var bodyParser = require('body-parser');
var https = require('https');
var express = require('express');
var app = express();
var data='';
var dataparse='';
var origin='';
var destination='';
var time='';
var distance='';
var globaloptions='';

app.post('/', function(req1, res1) {
//console.log('Printing Origin '+req1.body.origin);
//console.log('Printing Destination '+req1.body.destination);
console.log(req1);
var options = {
  host: 'maps.googleapis.com',
  port: 443,
 /// path: '/maps/api/distancematrix/json?units=imperial&origins=Burlington&destinations=Dallas&key=AIzaSyCOFsgPErRIT4R3cug5x9vwqwuNQaewPV0',
  path: '/maps/api/distancematrix/json?units=imperial&origins='+req1.body.origin+'&destinations='+req1.body.destination+'&key=',
  method: 'GET'
}

globaloptions = options;

//master(req1, res1);
getgoogledata()
.then(function() {
console.log('***********');
constructrestresponse(req1, res1);
});

});

var server = app.listen (3000, function(){
console.log('Distance Service is listening');
});

/*function master(req1, res1) {
getgoogledata()
.then(function() {
console.log('***********');
constructrestresponse(req1, res1);
});

}*/


function getgoogledata(){
    return new Promise(function(resolve) {
    https.request(globaloptions, function(res) {
    res.on('data', function (chunk) {
    data+=chunk;
    dataparse = JSON.parse(data)
    console.log('Origin:      ' + dataparse.origin_addresses);
    console.log('Destination: ' + dataparse.destination_addresses);
    console.log('Distance:    ' + dataparse.rows[0].elements[0].distance.text);
    console.log('Time:        ' + dataparse.rows[0].elements[0].duration.text);
    origin = dataparse.origin_addresses;
    destination = dataparse.destination_addresses;
    distance = dataparse.rows[0].elements[0].distance.text;
    time = dataparse.rows[0].elements[0].duration.text;
    console.log('inside inner res' + origin);
    console.log('inside inner res' + distance);
   // return(resolve);
   resolve();

});
}).end();
//resolve();
});
//});
}


function constructrestresponse(req1, res1) {
 console.log('outside inner res' + origin);
 console.log('outside inner res' + distance);
 res1.setHeader('Content-Type' , 'application/json');
 res1.body = {"Origin" : origin,
               "Destination" : destination,
               "Distance" : distance,
               "Time" : time};
 res1.end(JSON.stringify(res1.body));
}
  


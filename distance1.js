'use strict';

var util = require('util');
var bodyParser = require('body-parser');
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
app.use(bodyParser.json());
app.post('/distance', function(request, response) {
app.use(bodyParser.json());
//console.log('Printing Origin '+req1.body.origin);
//console.log('Printing Destination '+req1.body.destination);
//console.log(request);
//console.log('Request :'+request.object);
//console.log('Response :'+response.object);
var origin1 = request.body.origin;
//origin1=origin1.to_string();
//console.log(origin1);

var destination1 = request.body.destination;
//destination1=destination1.to_string();
//console.log(destination1);

var options = {
  host: 'maps.googleapis.com',
  port: 443,
 /// path: '/maps/api/distancematrix/json?units=imperial&origins=Burlington&destinations=Dallas&key=AIzaSyD3PEmTi0_Y0srMWiuZ0fCQ93Bo4ph120M',
  path: '/maps/api/distancematrix/json?units=imperial&origins='+origin1+'&destinations='+destination1+'&key=AIzaSyD3PEmTi0_YOsrMWiuZOfCQ93Bo4phl2OM',
  method: 'GET'
}

//console.log(options.path);
globaloptions = options;

//master(req1, res1);
getgoogledata()
.then(function() {
//console.log('***********');
constructrestresponse(request, response);
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
   // console.log('inside inner res' + origin);
  //  console.log('inside inner res' + distance);
   // return(resolve);
   resolve();

});
}).end();
//resolve();
});
//});
}


function constructrestresponse(request, response) {
 //console.log('outside inner res' + origin);
 //console.log('outside inner res' + distance);
 response.setHeader('Content-Type' , 'application/json');
 response.body = {"Origin" : origin,
               "Destination" : destination,
               "Distance" : distance,
               "Time" : time};
 response.end(JSON.stringify(response.body));
}

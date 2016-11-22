var request = require('request');
request.debug = true;
require('request-debug')(request);

var somePackage = "https://d3fm2vapipm3k9.cloudfront.net/builds/EXSxwGqYjjJKh3WMJ/1477416387312/oW5pojeAuq/fastclick-1.0.13-os+web.browser+web.cordova.tgz";
request(somePackage, function (error, response, body) {
  if (error) {
    console.error(error);
  } else if (!error && response.statusCode == 200) {
    console.log("OK: %d bytes", body.length);
  }
});
'use strict';

const TOKEN = ''; // TODO
const GIPHY_API_KEY = 'dc6zaTOxFJmzC'; // this is the "public beta key" from https://github.com/Giphy/GiphyAPI
const GIPHY_HOST = 'api.giphy.com';
const GIPHY_PATH = '/v1/gifs/translate';
const ICON = '';

var http = require("http");

console.log('Loading function');
exports.handler = (event, context, callback) => {
    
    // simple url decoding method
    var qs_decode = function (query) {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },

        urlParams = {};
        while ((match = search.exec(query)))
           urlParams[decode(match[1])] = decode(match[2]);
        return urlParams;
    };

    var decoded = qs_decode(event.body);

    if (TOKEN !== '' && decoded.token != TOKEN) {
        callback('bad token, go away');
    }
    
    var request_options = 'http://' + GIPHY_HOST + GIPHY_PATH + '?s=' + decoded.text + '&api_key=' + GIPHY_API_KEY;
    
    console.log(request_options);
    http.get(request_options, (res) => {
        
                var body = '';
                res.on('data', function(chunk){
                    body += chunk;
                    //console.log("Chunk: " + chunk);
                });
                //console.log(body);
                //console.log(JSON.parse(body));
                
                res.on('end', function(){ 
                    var giphy_result = JSON.parse(body);
                    var gif_url = giphy_result.data.images.downsized.url;
                    
                    var text = '##### [' + decoded.text + '](' + giphy_result.data.bitly_url + ")\n"
                                + "*Posted by " + decoded.user_name + " using /giphy " + decoded.text + "*\n"
                                + gif_url;
                    
                    var response = {
                        'response_type' : 'in_channel', 
                        'text': text,
                        'username': decoded.user_name,
                        'icon_url': ICON,
                    };
                    callback(null, response);
                });
    });
    
};

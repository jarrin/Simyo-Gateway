var https = require('https'),
    util  = require("util");

var Tools = 
{
	sendRequest: function (body, o, callback)
	{

		var options =
		{ 
			host: 'mijn.simyo.nl',
			method: 'POST'
		};

		options = Tools.extend(options, o);
		var req = https.request(options, 

			function(response) 
			{
				var str = '';
				response.on('data', function (chunk) {
					str += chunk;
				});

				response.on('end', function () {

					if(response.statusCode >= 200 && response.statusCode <= 202)
					{
						callback(str);
					}
					else
					{
						callback(false);
					}
				});
			}
		);
		req.write(body);
		req.end();
	},
	extend: function(_a,_b,remove)
	{
        remove = remove === undefined ? false : remove;
        var a_traversed = [],
            b_traversed = [];

        function _extend(a,b) {
            if (a_traversed.indexOf(a) == -1 && b_traversed.indexOf(b) == -1){
                a_traversed.push(a);
                b_traversed.push(b);
                if (a instanceof Array){
                    for (var i = 0; i < b.length; i++) {
                        if (a[i]){  // If element exists, keep going recursive so we don't lose the references
                            a[i] = _extend(a[i],b[i]);
                        } else { 
                            a[i] = b[i];    // Object doesn't exist, no reference to lose
                        }
                    }
                    if (remove && b.length < a.length) { // Do we have fewer elements in the new object?
                        a.splice(b.length, a.length - b.length);
                    }
                }
                else if (a instanceof Object){
                    for (var x in b) {
                        if (a.hasOwnProperty(x)) {
                            a[x] = _extend(a[x], b[x]);
                        } else {
                            a[x] = b[x];
                        }
                    }
                    if (remove) for (var x in a) {
                        if (!b.hasOwnProperty(x)) {
                            delete a[x];
                        }
                    }
                }
                else{
                    return b;
                }
                return a;
            }    
        }

        return _extend(_a,_b);
    }
}
module.exports = Tools;
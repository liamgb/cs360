var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "htmls/";

http.createServer(function (req, res) {

	var urlObj = url.parse(req.url, true, false);

	if(urlObj.pathname.indexOf("getcity") !=-1) { // Execute the REST service 

		var jsonresult = [];
		fs.readFile('cities.dat.txt', function (err, data) { 

			if(err) throw err; 

			var cities = data.toString().split("\n");
			var myRe = new RegExp("^" + urlObj.query["q"]); 

			for(var i = 0; i < cities.length; i++) { 

				var result = cities[i].search(myRe); 
				if(result != -1) { 
					jsonresult.push({city:cities[i]});
				}
			}

			if (urlObj.query["q"].length > 0){

				res.writeHead(200); 
				res.end(JSON.stringify(jsonresult));
			} else {

				res.writeHead(200); 
				res.end();
			}
		});

	} else { // do normal file response
		fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {

			if (err) {

				res.writeHead(404);
				res.end(JSON.stringify(err));
				return;
			}

			res.writeHead(200);
			res.end(data);
		});
	}


}).listen(0080);

//vvvdebugvvv
/*var options = {
	hostname: 'localhost',
	port: '0080',
	path: '/test1.html'
};

function handleResponse(response) {

	var serverData = '';

	response.on('data', function (chunk) {
		serverData += chunk;
	});

	response.on('end', function () {
		console.log(serverData);
	});
}

http.request(options, function(response){
	handleResponse(response);
}).end();*/
//^^^debug^^^
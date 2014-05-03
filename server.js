// Next Generation: MultiThread Aysnchronous Event

var http = require('http')
var fs = require("fs")
var url = require("url")

var handler = {}
handler["/"] = start
handler["/client.js"] = client
handler["/picture"] = cloudpicture

function route(pathname, res, postdata) {
	console.log(pathname)

	if(typeof handler[pathname] == "function") {
		handler[pathname](res, postdata)
	} else {
		res.writeHead(404, {'Content-Type': 'text/html'})
		res.write(pathname)
		res.end("404 Not found")
		console.log(pathname)
		console.log("path error!")
	}
}

function start(res, postdata) {
	console.log("start!")

	fs.readFile('index.html', 'utf-8', function(err, data) {
		if(err){
			res.writeHead(404, {'Content-Type': 'text/html'});
			res.write('');
			res.end('')
			console.log(err)
		} else {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.write(data);
			res.end('')
			console.log('OK')
		}
	})
}

function client(res, postdata) {
	console.log("client!")
	fs.readFile('client.js', 'utf-8', function(err, data) {
		if(err){
			res.writeHead(404, {'Content-Type': 'application/javascript'});
			res.write('');
			res.end('')
			console.log(err)
		} else {
			res.writeHead(200, {'Content-Type': 'application/javascript'})
			res.write(data);
			res.end('')
			console.log('OK')
		}
	})
}

function cloudpicture(res, query, postdata) {
	console.log(query.user)
	console.log(query.node)
	res.writeHead(200, {'Content-Type': 'text/html'})
	res.write('');
	res.end('')
}


http.createServer( function(req, res) {
	var pathname = url.parse(req.url).pathname
	var query = url.parse(req.url, true).query
	var postdata = ""
	req.setEncoding("utf8")
	
	req.addListener("data", function(chunk) {
		postdata += chunk
	})

	req.addListener("end", function(chunk) {
		if (query) {
			cloudpicture(res, query, postdata)
		} else{
			route(pathname, res, postdata)
		}
	})
}).listen(3000)

console.log("HTTP server is listening at port 3000.")



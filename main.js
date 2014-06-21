var sys = require('sys'),
    fs = require('fs'),
    http = require('http'),
    url = require('url');
    
var couchdb = require('./libs/node-couchdb/lib/couchdb'),
    client = couchdb.createClient(5984, 'localhost'),
    db = client.db('erdnodeflips');
 
var haml = require('./libs/haml-js/lib/haml');
 
var doc_id = 'e29dfe4b98925f1ccf9651ba3b000e30';
 
http.createServer(function (req, res) {
    var url_parts = url.parse(req.url);
    switch(url_parts.pathname) {
    	case '/':
    		display_root(url_parts.pathname, req, res);
    		break;
    	case '/create':
    		display_create(url_parts.pathname, req, res);
    		break;
    	case '/edit':
    		sys.puts("display edit");
    		break;
    	default:
    		display_404(url_parts.pathname, req, res);
    }
    return;

    function display_root(url, req, res) {
	    res.writeHead(200, {'Content-Type': 'text/html'});
	    db.getDoc(doc_id, function(error, doc) {
		if(error) {
		    fs.readFile('./templates/no-doc.haml', function(e, c) {
			var data = {
			    title: "No Document Found",
			    message: "No document could be found",
			    link: "/create",
			    link_text: "Create a new document"
			};
			var html = haml.render(c.toString(), {locals: data});
			res.end(html);
		    });
		}
		else {
		    fs.readFile('./templates/doc.haml', function(e, c) {
			var data = {title: "Erdnodeflip document: " + doc.name, message: "Your Erdnusflip document was found!",items: doc.items};
			var html = haml.render(c.toString(), {locals: data});
			res.end(html);
		    });
		}
	    });
	}

	function display_404(url, req, res) {
		res.writeHead(404, {'Content-Type':'text/html'});
		res.write("&lt;h1&gt;404 Not Found&lt;/h1&gt;");
		res.end("The page you were looking for: "+url+" can not be found");
	}

	function display_create(url, req, res) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		fs.readFile('./templates/create.haml', function(e, c) {
			var data = {
				title: 'Create New List',
				message: "Please enter up to 5 things to remember",
				url: url
			}
			var html = haml.render(c.toString(), {locals: data});
			res.end(html);
		});
	}

}).listen(8000);

sys.puts('Server running at localhost:8000');

	

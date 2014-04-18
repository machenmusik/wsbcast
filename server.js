var http = require('http');
var svr = http.createServer(function(req,res) {
  res.end('happy');
}).listen(process.env.PORT || 8080);

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({server: svr});

wss.broadcast = function(data) {
    var notme = arguments[1];
    for(var i in this.clients)
	if (this.clients[i] !== notme)
            this.clients[i].send(data);
};

// use like this:
wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    wss.broadcast(message, ws);
  });
});


function startKeepAlive() {
    setInterval(function() {
        var options = {
            host: process.env.HOST,
            port: 80,
            path: '/'
        };
        http.get(options, function(res) {
            res.on('data', function(chunk) {
                try {
                    // optional logging... disable after it's working
                    //console.log("KeepAlive RESPONSE: " + chunk);
                } catch (err) {
                    console.log(err.message);
                }
            });
        }).on('error', function(err) {
            console.log("Error: " + err.message);
        });
    }, 5 * 60 * 1000); // load every 5 minutes
}

startKeepAlive();

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

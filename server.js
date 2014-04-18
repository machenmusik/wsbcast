var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({port: 8080});

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

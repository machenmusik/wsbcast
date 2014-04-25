var http = require('http');
var svr = http.createServer(function(req,res) {
  res.end('happy');
}).listen(process.env.PORT || 8080);

var WebSocketServer = require('ws').Server
  , wss = new WebSocketServer({server: svr, 
    clientTracking:false}); // we're going to do our own

wss.clientMap = {};

wss.broadcast = function(data, ws) {
    for(var i in this.clientMap[ws.upgradeReq.url])
	if (this.clientMap[ws.upgradeReq.url][i] !== ws)
            this.clientMap[ws.upgradeReq.url][i].send(data);
};

// use like this:
wss.on('connection', function(ws) {
  var self = this;

  // make sure we know what URL was used
  console.log(ws.upgradeReq.url);
  if (typeof self.clientMap[ws.upgradeReq.url] === 'undefined')
    self.clientMap[ws.upgradeReq.url] = []; // beware if races are possible
  self.clientMap[ws.upgradeReq.url].push(ws); 

  ws.on('close', function() {
    var i = self.clientMap[ws.upgradeReq.url].indexOf(client);
    if (i != -1) {
      self.clientMap[ws.upgradeReq.url].splice(i, 1);
    }
  });

  ws.on('message', function(message) {
    self.broadcast(message, ws);
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

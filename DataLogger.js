var amqp = require('amqplib');

amqp.connect('amqp://guest:guest@172.19.197.228:5672').then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(chnl) {

    var ok = chnl.assertQueue('iot/BloodSugar', {durable: false});

    ok = ok.then(function(_qok) {
      return chnl.consume('iot/BloodSugar', function(msg) {
        var date = new Date().toLocaleDateString();
        var time = new Date().toLocaleTimeString();
        console.log("[%s  %s] Received Blood Sugar : %s", date, time, msg.content.toString());
      }, {noAck: true});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [Waiting for messages on queue: iot/BloodSugar]');
    });
  });
}).catch(console.warn);


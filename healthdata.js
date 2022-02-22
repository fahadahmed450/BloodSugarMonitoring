var amqp = require('amqplib');

exports.handler = function (context, event) {

    var SugarVal = String(Math.round(Math.random() * (140 - 50)) + 50);

    amqp.connect('amqp://guest:guest@172.19.197.228:5672').then(function (con) {
        return con.createChannel().then(function (chnl) {
            var title = 'iot/BloodSugar';
            var sub = chnl.assertQueue(title, {durable: false});
            return sub.then(function () {
                chnl.sendToQueue(title, Buffer.from(SugarVal));
                return chnl.close();
            });
        }).finally(function () {
            con.close();
        })
    }).catch(console.log);
    context.callback('Message has been Sent');
};
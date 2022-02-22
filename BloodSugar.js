var mqtt = require('mqtt')
var amqp = require('amqplib')
var request = require('request')


const IP = '172.19.197.228';
const KEY = 'd1lwV6AVDCEs1izaG8krf4';
const topic = 'iot/BloodSugar';

var options = {
    host: 'mqtt://' + IP,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'guest',
    password: 'guest',
};

function sendMail() {
    request({
        url: 'https://maker.ifttt.com/trigger/BloodSugar_Mail/with/key/'+KEY,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
        }
    });
}

amqp.connect('amqp://guest:guest@172.19.197.228:5672').then(function(con) {
    process.once('SIGINT', function() { con.close(); });
    return con.createChannel().then(function(chnl) {

        var ok = chnl.assertQueue('iot/BloodSugar', {durable: false});

        ok = ok.then(function(_qok) {
            return chnl.consume('iot/BloodSugar', function(msg) {


                    var bodySugar = msg.content.toString();

                    topicData = "Blood Sugar level: " + bodySugar;
                    send_to_one_topic_mqtt(topic, topicData);

                console.log("BloodSugar received from iot/BloodSugar: " + msg.content);

                if (Number(msg.content) >= 140) {
                    console.log("Abnormal Blood Sugar -> Sending Email to doctor")
                    sendMail();
                }


            }, {noAck: true});
        });

        return ok.then(function(_consumeOk) {
            console.log(' [Waiting for messages on queue: iot/BloodSugar]');
        });
    });
}).catch(console.warn);

async function send_to_one_topic_mqtt(topic, data) {
    var client = mqtt.connect("mqtt://" + IP, options);
    client.on('connect', function () {
        client.publish(topic, data, function () {
            client.end();
        });
    });
}

function bin2string(array) {
    var result = "";
    for (var i = 0; i < array.length; ++i) {
        result += (String.fromCharCode(array[i]));
    }
    return result;
}
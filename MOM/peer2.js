const amqp = require('amqplib/callback_api');
const readline = require('readline')
const { user1, user2 } = require('./usersQueues.json')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
})

const queue = 'user2';

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(user2, {
            durable: false
        });

        rl.on('line', msg => {
            channel.sendToQueue(user1, Buffer.from(msg));
            rl.prompt()
        })


        channel.consume(user2, function(msg) {
            rl.clearLine()
            console.log(`${msg.fields.deliveryTag}> ${msg.content.toString()}`);
            rl.prompt()
        }, {
            noAck: true
        })
        rl.prompt()
    });
});

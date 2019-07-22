const amqp = require('amqplib/callback_api');
const readline = require('readline')
const { user1, user2 } = require('./usersQueues.json')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
})

amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }
        channel.assertQueue(user1, {
            durable: false
        });

        rl.on('line', msg => {
            channel.sendToQueue(user2, Buffer.from(msg));
            rl.prompt()
        })

        channel.consume(user1, function(msg) {
            rl.clearLine()
            console.log(`${msg.fields.deliveryTag}> ${msg.content.toString()}`);
            rl.prompt()
        }, {
            noAck: true
        });
        rl.prompt()
    });
});


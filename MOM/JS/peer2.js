const amqp = require('amqplib/callback_api');
const readline = require('readline')
const { user1, user2 } = require('./usersQueues.json')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
})

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
            let payload = JSON.stringify({
                'username': process.argv[2],
                'message': msg
            })
            channel.sendToQueue(user1, Buffer.from(payload));
            rl.prompt()
        })


        channel.consume(user2, function(msg) {
            let { username, message } = JSON.parse(msg.content.toString())
            console.log(`<${username}> ${message}`);
            rl.prompt()
        }, {
            noAck: true
        })

        rl.prompt()
    });
});

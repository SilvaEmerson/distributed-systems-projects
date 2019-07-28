const amqp = require('amqplib/callback_api');
const readline = require('readline')
const usernames = require('./usersQueues.json').map(el => el.username)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '> '
})

const sender = (usernames.includes(process.argv[2]))
    ? process.argv[2]
    : (() => {
        throw "Sender username invalid"
    })()

const receiver = (usernames.includes(process.argv[3]))
    ? process.argv[3]
    : (() => {
        throw "Receriver username invalid"
    })()


amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
        throw error0;
    }

    connection.createChannel((error1, channel) => {
        if (error1) {
            throw error1;
        }

        channel.assertQueue(sender, {
            durable: false
        });

        rl.on('line', msg => {
            let payload = JSON.stringify({
                'username': sender,
                'message': msg
            })
            channel.sendToQueue(receiver, Buffer.from(payload));
            rl.prompt()
        })

        channel.consume(sender, function(msg) {
            let { username, message } = JSON.parse(msg.content.toString())
            console.log(`<${username}> ${message}`);
            rl.prompt()
        }, {
            noAck: true
        })

        rl.prompt()
    });
});


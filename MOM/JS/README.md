# MOM(Message Oriented Middleware) with RabbitMQ

## Installing

```shell
npm i
```

## Managing users

* To add users, edit `src/users.json` 
* You can only connect with registered users

## Running

### Using Docker:

```shell
docker-compose up
```

and in another shell section:

```shell
node src/peer.js [host-username] [destiny-username]
```

### Don't using Docker

Considering you already have RabbitMQ installed on the machine:

```shell
node src/peer.js [host-username] [destiny-username]
```

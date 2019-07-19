const http = require('http')
const port = process.env.PORT || 8000
const server = http.createServer()

const FUNCTIONS = {
    'validate_cpf': cpf => {
        cpf = cpf.replace(/[^0-9]/ig, '')

        if(cpf.length != 11)
            return false

        weight = 11

        // Calculating the first cpf check digit.
        sum = cpf.slice(0, 9).split('').reduce((acc, curr) => {
            weight -= 1
            return curr * weight + acc
        }, 0)

        verifying_digit = 11 - sum % 11

        first_verifying_digit = (verifying_digit > 9)
            ? 0
            : verifying_digit

        // Calculating the second check digit of cpf.
        weight = 12
        sum = cpf.slice(0, 10).split('').reduce((acc, curr) => {
            weight -= 1
            return curr * weight + acc
        }, 0)

        verifying_digit = 11 - sum % 11

        second_verifying_digit = (verifying_digit > 9)
            ? 0
            : verifying_digit

        if (cpf.slice(-2) === `${first_verifying_digit}${second_verifying_digit}`)
            return true
        return false
    }
}

const readReceivedData = data => {
    let json_parsed = JSON.parse(data.toString())
    result = FUNCTIONS[json_parsed.function](...json_parsed.args, json_parsed.kwargs)
}

const sendResponsePayload = res => _ => {
    result = JSON.stringify({
        response: result
    })
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(result)
}

server.on('request', (req, res) => {
    let result = ''
    if(req.method === 'POST'){
        req.on('data', readReceivedData)
        req.on('end', sendResponsePayload(res))
    }
})

server.listen(port)
console.log(`Server is running at localhost:${port}!`)

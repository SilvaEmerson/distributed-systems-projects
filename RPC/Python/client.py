import xmlrpc.client


SERVER_URL = "http://localhost:8000/"

if __name__ == '__main__':
    cpf = input('Type the cpf: ')

    with xmlrpc.client.ServerProxy(SERVER_URL) as proxy:
        if proxy.validate_cpf(cpf):
            print('Valid CPF')
        else:
            print('Invalid CPF')

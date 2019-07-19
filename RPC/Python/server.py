from xmlrpc.server import SimpleXMLRPCServer
import re


def validate_cpf(cpf):
    """ If cpf in the Brazilian format is valid, it returns True, otherwise, it returns False. """

    # Check if type is str
    if not isinstance(cpf, str):
        return False

    # Remove some unwanted characters
    cpf = re.sub("[^0-9]", "", cpf)

    # Checks if string has 11 characters
    if len(cpf) != 11:
        return False

    sum = 0
    weight = 10

    """ Calculating the first cpf check digit. """
    for n in range(9):
        sum = sum + int(cpf[n]) * weight

        # Decrement weight
        weight = weight - 1

    verifying_digit = 11 - sum % 11

    if verifying_digit > 9:
        first_verifying_digit = 0
    else:
        first_verifying_digit = verifying_digit

    """ Calculating the second check digit of cpf. """
    sum = 0
    weight = 11
    for n in range(10):
        sum = sum + int(cpf[n]) * weight

        # Decrement weight
        weight = weight - 1

    verifying_digit = 11 - sum % 11

    if verifying_digit > 9:
        second_verifying_digit = 0
    else:
        second_verifying_digit = verifying_digit

    if cpf[-2:] == "%s%s" % (first_verifying_digit, second_verifying_digit):
        return True
    return False


server = SimpleXMLRPCServer(("localhost", 8000))
print("Listening on port 8000...")
server.register_function(validate_cpf, "validate_cpf")
server.serve_forever()

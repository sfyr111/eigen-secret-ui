export function buildError(e) {
    const error = {}
    if (e.message.indexOf('user rejected signing')) {
        error.errno = -2
        error.message = 'user rejected signing'
    } else {
        error.errno = -1
        error.message = 'system error'
    }
    return error
}

export function hideAddress(address) {
    const adr = address.replace('eig:', '')
    const visibleCharactersStart = 5;
    const visibleCharactersEnd = 4;
    const ellipsis = '...';

    const start = adr.substring(0, visibleCharactersStart);
    const end = adr.substring(adr.length - visibleCharactersEnd);

    const hiddenCharacters = adr.length - visibleCharactersStart - visibleCharactersEnd;
    const hidden = ellipsis;

    return `${start}${hidden}${end}`;
}

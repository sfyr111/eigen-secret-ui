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

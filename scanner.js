function scan(source) {
    let tokens = [];
    let prev = 0;
    let current = 0;
    let total = source.length;
    function isDigit(x) {
        return x >= '0' && x <= '9';
    }
    function getNumber() {
        while(isDigit(source[current])) {
            current += 1;
        }
        let t = source.substring(prev, current);
        prev = current;
        current -= 1;
        return t;
    }
    function getId() {
        if (source[current] >= 'a' && source[current] <= 'z') {
            current += 1;
        }
        let t = source.substring(prev, current);
        prev = current;
        current -= 1;
        return t;
    }
    while(current < total) {
        let ch = source[current];
        console.log({ch, current})
        if (isDigit(ch)) {
            prev = current;
            let token = getNumber();
            tokens.push(token);
        } else if (ch === '+') {
            tokens.push('+');
        } else if (ch === '-') {
            tokens.push('-')
        } else if (ch === '*') {
            tokens.push('*');
        } else if (ch === '/') {
            tokens.push('/')
        } else if (ch === 'v') {
            if (source[current + 1] === 'a' && source[current + 2] === 'r') {
                current += 2
                tokens.push('var')
            }
        } else if (ch === '=') {
            tokens.push('=')
        } else if (ch === ';') {
            tokens.push(';')
        } else if (ch >= 'a' && ch <= 'z') {
            prev = current;
            let token = getId();
            tokens.push(token);
        }
        current += 1;
    }
    return tokens;
}

module.exports = scan;
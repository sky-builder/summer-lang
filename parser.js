/**
 * Algorithm: Recursive Descent
 * 
 * Grammer Rule:
 * statement -> vars | if | exp | fd
 * fd -> 'fun' identifier'()' '{' block '}'
 * ifs -> 'if' '(' exp ')' block
 * block -> '{' statements* '}'
 * vars -> 'var' identifier (= exp)
 * exp -> pexp
 * pexp -> texp (('+' | '-') texp)*
 * texp -> prefix (('*' | '/') prefix)*
 * prefix -> ('-' | '+') primary
 * primary -> Number | '('exp')' | IDENTIFER | fun_call;
 * 
 * how can we support infinite prefix ?, if (> 2) 
 * 
 * @param {*} tokens 
 * 
 * 1. if
 * 2. fun
 * 3. while
 * 4. interpreter
 * 
 * 
 */

let tokens = [];
let current = 0;

function getPrevious() {
    return tokens[current - 1];
}
function Expression(op, left, right) {
    this.type = 'binary-expression';
    this.op = op;
    this.left = left;
    this.right = right;
}
function getExpression() {
    return pgetExpression();
}

function pgetExpression() {
    let exp = tgetExpression();
    while(tokens[current] === '+' || tokens[current] === '-') {
        current += 1;
        let op = getPrevious();
        let right = tgetExpression();
        exp = new Expression(op, exp, right);
    }
    return exp;
}
function prefix() {
    if(tokens[current] === '+' || tokens[current] === '-') {
        current += 1;
        let op = getPrevious();
        let pp = primary();
        return new UnaryExpression(op, pp);
    } else {
        return primary();
    }
}

function UnaryExpression(op, right) {
    this.op = op;
    this.right = right
}

function tgetExpression() {
    let exp = prefix();
    while(tokens[current] === '*' || tokens[current] === '/') {
        current += 1;
        let op = getPrevious();
        let right = prefix();
        exp = new Expression(op, exp, right);
    }
    return exp;
}

function Identifier(name) {
    this.name = name;
}

function isDigit(x) {
    return x >= '0' && x <= '9';
}

function FC(id) { 
    this.id = id;
}

function primary() {
    if (!isDigit(tokens[current])) {
        let e = tokens[current];
        current += 1;
        if (tokens[current] === '(' && tokens[current + 1] === ')') {
            current += 1;
            current += 1;
            return new FC(e);
        }
         return new Identifier(e);
    } else if (tokens[current] === '(') {
        current += 1;
        let e = getExpression();
        current += 1;
        return e;
    }  else {
        let e = tokens[current];
        current += 1;
        return e;
    }
}

table = {};

function VAR_STATMENT(id, exp) {
    this.type = 'variable_declartion';
    this.id = id;
    this.exp = exp;
}

function getVariableDeclartion() {
    current += 1;
    let id = tokens[current];
    current += 1;
    if (tokens[current] === '=') {
        current += 1;
        let e = getExpression();
        return new VAR_STATMENT(id, e);
    }
    return new VAR_STATMENT(id, e);
}
function consume(t) {
    if (tokens[current] !== t) {
        console.error('unexpect token', tokens[current], 'expected: ', t);
    } else {
        current += 1;
    }
}

function IF_EXPRESSION(cond, block) {
    this.cond = cond;
    this.block = block
}

function block() {
    consume('{')
    let sts = [];
    while(tokens[current] && tokens[current] !== '}') {
        st = sta();
        sts.push(st);
        current += 1;
    }
    consume("}")
    return sts;
}

function getIfStatement() {
    current += 1;
    consume('(')
    let e = getExpression();
    consume(')');
    let b = block();
    return new IF_EXPRESSION(e, b);
}

function FUN(id, block) {
    this.id = id;
    this.block = block;
}

function getFunctionDeclartion() {
    current += 1;
    let id = tokens[current];
    current += 1;
    consume('(')
    consume(')')
    let b = block();
    return new FUN(id, b);
}

function getStatement() {
    switch (tokens[current]) {
        case 'var': {
            let statment = getVariableDeclartion();
            consume(';')
            return statment;
        }
        case 'if': {
            return getIfStatement();
        }
        case 'fun': {
            return getFunctionDeclartion();
        }
        default: {
            let exp = getExpression();
            consume(';')
            return exp;
        }
    }
}

function parse(tokenList) {
    tokens = tokenList;
    let statements = [];
    while(current < tokens.length) {
        let statmenet = getStatement();
        statements.push(statmenet);
    }
    return statements;
}

// let input = [ '(', '1', '-', '-', '1', ')', '*', '-', '1'];
// let input = ['var', 'a', '=', '1', '+', '1', ';', 'a' , '+', '1', ';'];
// let input = ['if', '(', '1', ')', '{', '1', '+', '1', ';', '1', '+', '2', ';','}'];
// let input = ['fun', 'random', '(', ')', '{', '}', 'random', '(', ')', ';']

module.exports = parse;
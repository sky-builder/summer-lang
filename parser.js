/**
 * Algorithm: Recursive Descent
 * 
 * Grammer Rule:
 * statement -> vars | if | exp | fd | returns
 * returns -> 'return' | 'return' expression
 * fd -> 'fun' identifier('()' | '(identifer(','identifier)*)') '{' block '}'
 * ifs -> 'if' '(' exp ')' block
 * block -> '{' statements* '}'
 * vars -> 'var' identifier (= exp)
 * exp -> cp
 * cp -> pexp ('>=' | '<=' | '==' pexp) 
 * pexp -> texp (('+' | '-') texp)*
 * texp -> prefix (('*' | '/') prefix)*
 * prefix -> ('-' | '+') cp
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

let globalId = 1;

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
    return cp();
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
function CP(op, left, right) {
    this.type = 'cp';
    this.op = op;
    this.left = left;
    this.right =right;
}

function cp() {
    let e = pgetExpression();
    if (tokens[current] === '<=' || tokens[current] === '==' || tokens[current] === '>=') {
        let op = tokens[current];
        current += 1;
        let eright = pgetExpression();
        return new CP(op, e, eright)
    }
    return e;
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
    this.type = 'id';
    this.name = name;
}

function isDigit(x) {
    return x >= '0' && x <= '9';
}

function FC(id, args) { 
    this.fid = globalId ++ ;
    this.scope = {};
    this.type = 'fc';
    this.id = id;
    this.args = args;
}

function primary() {
    if (!isDigit(tokens[current])) {
        let e = tokens[current];
        current += 1;
        if (tokens[current] === '(') {
            if (tokens[current + 1] === ')') {
                current += 1;
                current += 1;
                return new FC(e);
            } else {
                current += 1;
                let ep = getExpression();
                let eps = [];
                eps.push(ep);
                while(tokens[current] === ',') {
                    ep = getExpression();
                    eps.push(ep);
                }
                consume(')')
                return new FC(e, eps);
            }
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
    this.type = 'if';
    this.cond = cond;
    this.block = block
}

function block() {
    consume('{')
    let sts = [];
    while(tokens[current] && tokens[current] !== '}') {
        st = getStatement();
        sts.push(st);
        // current += 1;
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

function FUN(id, block, paramters) {
    this.fid = globalId++;
    this.type = 'fun';
    this.id = id;
    this.block = block;
    this.paramters = paramters;
    this.scope = {};
}

function getFunctionDeclartion() {
    current += 1;
    let id = tokens[current];
    current += 1;
    if (tokens[current] === '(' && tokens[current + 1] === ')') {
        current += 2;
        let b = block();
        return new FUN(id, b);
    } else if (tokens[current] === '(') {
        current += 1;
        let ids = [];
        let idd = tokens[current];
        ids.push(idd);
        current += 1;
        while(tokens[current] === ',') {
            current += 1;
            idd = tokens[current];
            current += 1;
        }
        consume(')');
        let b = block();
        return new FUN(id, b, ids);
    }
   
}
function RT(exp) {
    this.type = 'return';
    this.exp = exp;
}

function rs() {
    current += 1;
    if (tokens[current] === ';') {
        return new RT(); 
    }
    let exp = getExpression();
    return new RT(exp);
}

function getStatement() {
    switch (tokens[current]) {
        case 'return': {
            let statement = rs();
            consume(';')
            return statement;
        }
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
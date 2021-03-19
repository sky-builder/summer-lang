let scope = {};

function doOp(op, left, right) {
    if (op === '+') {
        return left + right;
    } else if (op === '-') {
        return left - right;
    }
}



function evaluate(exp) {
    if (exp === 'a') return scope[a];
    let {left, op, right, type} = exp;
    if (type === 'binary-expression') {
        return doOp(op, left, right);
    } else if (+exp) {
        return +exp
    }

}

function runStat(s) {
    if (s.type === 'binary-expression') {
        console.log(1)
        let left = s.left;
        let op = s.op;
        let right = s.right
        console.log(left, right, op);
        if (typeof left === 'object') left = scope['a'];
        if (typeof right === 'object') right = scope['b'];
        let result = doOp(op, Number(left), Number(right))
        console.log({result})
        return result;
    } else if (s.type === 'variable_declartion') {
        console.log(2)
        let {id, exp} = s;
        scope[id] = evaluate(exp);
    }
}



function run(stats) {
    console.log({stats})
    stats.forEach(stat => {
        runStat(stat);
    })
    console.log({scope})
}



module.exports = run;;
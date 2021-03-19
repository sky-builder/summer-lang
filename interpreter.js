let scope = {};

function doOp(op, left, right) {
    if (op === '+') {
        return +left + +right;
    } else if (op === '-') {
        return +left - +right;
    }
}

function evaluate(exp) {
    if (exp === 'a') return scope[a];
    let {left, op, right, type} = exp;
    if (type === 'binary-expression') {
        if (typeof left === 'object') left = scope[left.name];
        if (typeof right === 'object') right = scope[right.name];
        return doOp(op, left, right);
    } else if (+exp) {
        return +exp
    }
}

let funs = [];
function runStat(s) {
    console.log({stype: s.type})
    if (s.type === 'return') {
        let exp = s.exp;
        if (exp) {
            let r = evaluate(exp);
            return r;
        }
        return null;
    } else if (s.type === 'fc') {
        let id = s.id;
        let f = funs.find(item => item.id === id);
        let stats = f.block;
        let args = s.args;
        if (args) {
            let paramters = f.paramters;
            paramters.forEach((item, index)=> {
                scope[item] = args[index]
            })
        }
        let result;
        for(let i = 0; i < stats.length; i += 1) {
            result = runStat(stats[i]);
            if (stats[i] && stats[i].type === 'return') {
                break;
            }
        }
        console.log({result})
    } else if (s.type === 'fun') {
        funs.push(s); 
    } else if (s.type === 'binary-expression') {
        console.log(1)
        let left = s.left;
        let op = s.op;
        let right = s.right
        console.log({left, right, op});
        if (typeof left === 'object') left = scope[left.name];
        if (typeof right === 'object') right = scope[right.name];
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
    stats.forEach(stat => {
        runStat(stat);
    })
    console.log({funs})
    console.log({scope})
}



module.exports = run;;
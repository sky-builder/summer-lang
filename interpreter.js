let scope = {};
let currentFrame = null;

function Scope(scope) {
    this.scope = scope;
    this.prev = null;
}
let plusCount = 0;
let currScope = Scope({});

function doOp(op, left, right) {
    if (op === '+') {
        return +left + +right;
    } else if (op === '-') {
        return +left - +right;
    }
}
function getScope() {
    return currScope.scope;
}

let fcCount= 0;
function runFc(s) {
    fcCount += 1;
    s.isReturn = false;
    let id = s.id;
    let f = funs.find(item => item.id === id);
    let stats = f.block;
    let args = s.args;
    let scope = new Scope({});
    if (args) {
        let paramters = f.paramters;
        paramters.forEach((item, index)=> {
            let x  = evaluate(args[index])
            scope.scope[item] = x;
        })
    }
    let result;
    scope.prev = currScope
    currScope = scope;
    if (currentFrame) {
        s.prev = currentFrame;
    }
    currentFrame = s;
    for(let i = 0; i < stats.length; i += 1) {
        result = runStat(stats[i]);
        if (currentFrame && currentFrame.isReturn) {
            result = currentFrame.result;
            break;
        }
        if (stats[i] && stats[i].type === 'return') {
            break;
        }
    }
    currentFrame = currentFrame && currentFrame.prev ? currentFrame.prev : null;
    currScope = currScope.prev;
    return result;
}

function evaluate(exp) {
    let {left, op, right, type} = exp;
    
    if (type === 'binary-expression') {
        let s = getScope()
        if (op === '+') {
            plusCount += 1;
          
        }
        let l = evaluate(left);
        let rr = evaluate(right);
        let r = doOp(op, l, rr);
        console.log({left: l, op: op, right: rr, result: r});
        return r;
    } else if (type === 'fc') {
        return runFc(exp);
    } else if (type ===  'id') {
        let scope = getScope();
        return scope[exp.name];
    } else if (type === 'cp') {
        if (op === '<=') {
            let haha = evaluate(left) <= evaluate(right);
            return haha;
        } else if (op === '==') {
            let haha2 = evaluate(left) == evaluate(right);
            return haha2
        }
    } else {
        return +exp;
    }
}

let ident = 0;

let funs = [];
function runStat(s) {
    if (s.type === 'return') {
        let exp = s.exp;
        if (exp) {
            let r = evaluate(exp);
            console.log({r, scope: getScope()})
            if (currentFrame) {
                currentFrame.isReturn = true;
                currentFrame.result = r;
            }
            return r;
        }
        return null;
    } else if (s.type === 'if') {
        let cond = s.cond;
        let block = s.block;
        let cd = evaluate(cond);
        if (cd) {
            for(let i = 0; i < block.length; i += 1) {
                runStat(block[i]);
            }
        }
    } else if (s.type === 'fc') {
        ident += 2
        let result = runFc(s);
        ident -= 2;
        console.log({result})
    } else if (s.type === 'fun') {
        funs.push(s); 
    } else if (s.type === 'binary-expression') {
        let left = s.left;
        let op = s.op;
        let right = s.right
        let scope = getScope();
        if (typeof left === 'object') left = scope[left.name];
        if (typeof right === 'object') right = scope[right.name];
        let result = doOp(op, Number(left), Number(right))
        return result;
    } else if (s.type === 'variable_declartion') {
        let {id, exp} = s;
        let scope = getScope();
        scope[id] = evaluate(exp);
    }
}



function run(stats) {
    stats.forEach(stat => {
        runStat(stat);
    })
    console.log({fcCount})
    console.log({plusCount})
    // console.log({funs})
    // console.log({scope})
}



module.exports = run;;
const parse = require('./parser');
const run = require('./interpreter');
const scan = require('./scanner')
const fs = require('fs');
const path = require('path')

function m() {
    // let input = ['1', '+', '1', ';']
    // let input = ['var', 'a', '=', '1', ';', 'a', '+', '1', ';'];
    // let input = ['var', 'a', '=', '1', ';'];
    let file = fs.readFileSync(path.join(__dirname, 'source.sm'));
    let input = file.toString();
    let tokens = scan(input);
    tokens = tokens.filter(item => item.trim())
    console.log({tokens})
    let output = parse(tokens);
    fs.writeFileSync('output.json', JSON.stringify(output))
    console.log({output})
    
    run(output);
}
m();
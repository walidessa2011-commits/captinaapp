import fs from 'fs';
const content = fs.readFileSync('c:\\Users\\Dell\\Desktop\\Captina_app_new\\src\\app\\booking\\page.js', 'utf8');
let openBraces = 0;
let openParens = 0;
let openBrackets = 0;

for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '{') openBraces++;
    else if (char === '}') openBraces--;
    else if (char === '(') openParens++;
    else if (char === ')') openParens--;
    else if (char === '[') openBrackets++;
    else if (char === ']') openBrackets--;
    
    if (openBraces < 0 || openParens < 0 || openBrackets < 0) {
        console.log(`Mismatch at line ${content.substring(0, i).split('\n').length}, char ${i}: braces ${openBraces}, parens ${openParens}, brackets ${openBrackets}`);
    }
}
console.log(`Final counts: braces ${openBraces}, parens ${openParens}, brackets ${openBrackets}`);

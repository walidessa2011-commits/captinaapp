const fs = require('fs');
const content = fs.readFileSync('c:/Users/Dell/Desktop/Captina_app_new/src/app/booking/page.js', 'utf8');

let openBraces = 0;
let closeBraces = 0;
let openParens = 0;
let closeParens = 0;

for (let i = 0; i < content.length; i++) {
    if (content[i] === '{') openBraces++;
    if (content[i] === '}') closeBraces++;
    if (content[i] === '(') openParens++;
    if (content[i] === ')') closeParens++;
}

console.log(`Braces: { = ${openBraces}, } = ${closeBraces} (Diff: ${openBraces - closeBraces})`);
console.log(`Parens: ( = ${openParens}, ) = ${closeParens} (Diff: ${openParens - closeParens})`);

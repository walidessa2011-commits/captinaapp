const fs = require('fs');
const content = fs.readFileSync('c:/Users/Dell/Desktop/Captina_app_new/src/app/booking/page.js', 'utf8');

const s4Start = content.indexOf("{step === 4 && (");
const s4End = content.indexOf("/* Bottom Navigation / Action Bar */");
const step4 = content.substring(s4Start, s4End);

const lines = step4.split('\n');
let balance = 0;
for (let i = 0; i < lines.length; i++) {
    const openCount = (lines[i].match(/<div(?![^>]*\/)/g) || []).length;
    const closeCount = (lines[i].match(/<\/div>/g) || []).length;
    balance += openCount - closeCount;
    if (balance < 0) {
        console.log(`NEGATIVE BALANCE at Line ${i + 1}: ${lines[i]} (Current balance: ${balance})`);
    }
}
console.log(`Final Step 4 Balance: ${balance}`);

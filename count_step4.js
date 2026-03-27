const fs = require('fs');
const content = fs.readFileSync('c:/Users/Dell/Desktop/Captina_app_new/src/app/booking/page.js', 'utf8');

const s4Start = content.indexOf("{step === 4 && (");
const s4End = content.indexOf("/* Bottom Navigation / Action Bar */");
const step4 = content.substring(s4Start, s4End);

let openDivs = 0;
let closeDivs = 0;

const openMatch = step4.match(/<div/g) || [];
const closeMatch = step4.match(/<\/div>/g) || [];

console.log(`Open Divs: ${openMatch.length}, Close Divs: ${closeMatch.length} (Diff: ${openMatch.length - closeMatch.length})`);

let openMotion = step4.match(/<motion\.div/g) || [];
let closeMotion = step4.match(/<\/motion\.div>/g) || [];

console.log(`Open motion: ${openMotion.length}, Close motion: ${closeMotion.length}`);

let openAP = step4.match(/<AnimatePresence/g) || [];
let closeAP = step4.match(/<\/AnimatePresence>/g) || [];

console.log(`Open AP: ${openAP.length}, Close AP: ${closeAP.length}`);

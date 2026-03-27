const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Dell', 'Desktop', 'Captina_app_new', 'src', 'app', 'booking', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add missing AnimatePresence for showTerms
const termsStart = "{showTerms && (";
const termsReplacement = `<AnimatePresence>
                {showTerms && (`;

if (content.includes(termsStart) && !content.includes("<AnimatePresence>\n                {showTerms && (")) {
    console.log("Adding missing AnimatePresence for showTerms...");
    content = content.replace(termsStart, termsReplacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed successfully.");
} else {
    console.log("Could not find showTerms start or it already has AnimatePresence.");
}

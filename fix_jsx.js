const fs = require('fs');
const path = require('path');

const filePath = path.join('c:', 'Users', 'Dell', 'Desktop', 'Captina_app_new', 'src', 'app', 'booking', 'page.js');
let content = fs.readFileSync(filePath, 'utf8');

// The problematic map closure
const oldPart = /\{typeof item\.value === 'object' \? getText\(item\.value\) : item\.value\}\s+<\/p>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>\s+<\/div>/;

if (oldPart.test(content)) {
    console.log("Found broken map closure. Fixing...");
    
    const replacement = `{typeof item.value === 'object' ? getText(item.value) : item.value}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>`;
                                    
    content = content.replace(oldPart, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Fixed successfully.");
} else {
    console.log("Could not find the target section using regex.");
    // Try a more flexible search
    console.log("Trying to find 'item.value' and its surrounding divs...");
    const flexibleMatch = content.indexOf("{typeof item.value === 'object' ? getText(item.value) : item.value}");
    if (flexibleMatch !== -1) {
        console.log("Found 'item.value' at index", flexibleMatch);
        // Let's just find the next 5 </div> tags and replace that section.
    }
}

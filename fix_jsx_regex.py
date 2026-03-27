import os
import re

file_path = r'c:\Users\Dell\Desktop\Captina_app_new\src\app\booking\page.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# We want to find the map section and fix the broken ending.
# Search for the map closing pattern that is missing '))} )'
# It's currently:
# </p>\n</div>\n</div>\n</div>\n</div>\n</div>

# I will find the part after the getText call
pattern = re.compile(r'\{typeof item\.value === \'object\' \? getText\(item\.value\) : item\.value\}\s+</p>\s+</div>\s+</div>\s+</div>\s+</div>\s+</div>', re.DOTALL)

# Let's count how many times it appears.
matches = pattern.findall(content)
print(f"Found {len(matches)} potential broken closures.")

replacement = "{typeof item.value === 'object' ? getText(item.value) : item.value}\\n                                                        </p>\\n                                                    </div>\\n                                                </div>\\n                                            ))}\\n                                        </div>\\n                                    </div>"

if len(matches) > 0:
    content = pattern.sub(replacement, content, count=1)
    with open(file_path, 'w', encoding='utf-8', newline='') as f:
        f.write(content)
    print("Fixed.")
else:
    print("No match.")

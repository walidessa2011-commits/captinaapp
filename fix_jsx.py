import os

file_path = r'c:\Users\Dell\Desktop\Captina_app_new\src\app\booking\page.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the map closure and surrounding divs
# The broken part looks like:
#                                                 </div>
#                                             </div>
#                                         </div>
#                                     </div>
# Looking for the pattern of the map start and then the broken end.
# We want to replace the sequence of 4 divs with the correct closure.

old_block = """                                                </div>
                                            </div>
                                        </div>
                                    </div>"""

new_block = """                                                </div>
                                            ))}
                                        </div>
                                    </div>"""

if old_block in content:
    content = content.replace(old_block, new_block, 1)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully fixed the map closure.")
else:
    print("Could not find the target block. Checking for slightly different spacing...")
    # Try a more flexible match if necessary, but the provided block should match based on view_file.

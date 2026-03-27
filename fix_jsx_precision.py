import os

file_path = r'c:\Users\Dell\Desktop\Captina_app_new\src\app\booking\page.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Search for the Step 4 section (line 1026+) and fix the map closure (line 1077-1080)
# Looking for line 1074: {typeof item.value === 'object' ? getText(item.value) : item.value}
# And then the next series of divs.

for i in range(len(lines)):
    if "{typeof item.value === 'object' ? getText(item.value) : item.value}" in lines[i]:
        # found it. The next few lines should be closures.
        # Lines 1075-1077 are:
        # </p>
        # </div>
        # </div>

        # After that we need to ADD the map closure '))} )' and then the card div.
        # Looking at lines 1078-1080:
        # </div>
        # </div>
        # </div>
        
        # We need to find exactly where it is broken.
        if i + 3 < len(lines) and "</div>" in lines[i+2] and "</div>" in lines[i+3]:
             print(f"Found broken map closure around line {i+1}")
             # Let's fix lines i+3 to i+6
             # We want:
             # 1077: </div>
             # 1078: ))}
             # 1079: </div>
             # 1080: </div>
             # 1081: </div>
             
             # Actually, simpler: search for the specific sequence that exists now:
             pass

# It's better to just replace the whole block again but with a VERY specific search.
content = "".join(lines)
old_piece = "                                                        </p>\\n                                                    </div>\\n                                                </div>\\n                                            </div>\\n                                        </div>\\n                                    </div>"
# wait, my view_file showed:
# 1075:                                                         </p>
# 1076:                                                     </div>
# 1077:                                                 </div>
# 1078:                                             </div>
# 1079:                                         </div>
# 1080:                                     </div>

# I will replace it with the correct one.
target_lines = [
    "                                                        </p>\\n",
    "                                                    </div>\\n",
    "                                                </div>\\n",
    "                                            </div>\\n",
    "                                        </div>\\n",
    "                                    </div>\\n"
]

# I will search for the lines to be absolutely sure.
fixed = False
for i in range(len(lines)-6):
    if "</p>" in lines[i] and "{typeof item.value" in lines[i-1]:
        if "</div>" in lines[i+1] and "</div>" in lines[i+2] and "</div>" in lines[i+3]:
            print(f"Applying fix at line {i+1}")
            lines[i+2] = "                                                </div>\\n"
            lines[i+3] = "                                            ))}\\n"
            lines[i+4] = "                                        </div>\\n"
            lines[i+5] = "                                    </div>\\n"
            # we might have more or fewer divs depending on the damage.
            # Let's look at 1078-1080 in view_file:
            # 1078: </div> -> this is closing 1045 card.
            # 1079: </div> -> this is closing 1043 left column.
            # 1080: </div> -> this is closing 1042 grid.
            
            # If map was NOT closed, then 1077 closed the map item.
            # So 1078 SHOULD close the map itself.
            lines[i+2] = "                                                </div>\\n"
            lines[i+3] = "                                            ))}\\n"
            lines[i+4] = "                                        </div>\\n" # Close 1045 card
            lines[i+5] = "                                    </div>\\n" # Close 1043 left col
            # The next line in the and should be 1081 which is empty.
            fixed = True
            break

if fixed:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.writelines(lines)
    print("Fix applied successfully.")
else:
    print("Could not find the target section to fix.")

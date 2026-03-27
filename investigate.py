import os
file_path = r'c:\Users\Dell\Desktop\Captina_app_new\src\app\booking\page.js'
with open(file_path, 'rb') as f:
    content = f.read()

# find {typeof item.value === 'object' ? getText(item.value) : item.value}
target = b"{typeof item.value === 'object' ? getText(item.value) : item.value}"
idx = content.find(target)
if idx != -1:
    print(f"Found target at {idx}. Showing snippet around it:")
    print(content[idx:idx+300])
else:
    print("Target not found as bytes.")

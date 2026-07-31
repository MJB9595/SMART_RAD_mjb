import re

with open('src/app/globals.css', 'r') as f:
    content = f.read()

def repl(match):
    val = match.group(1)
    if val == '1': # Leave 1px borders alone
        return '1px'
    if val == '21.5': # leave html base font size alone
        return '21.5px'
    # Convert px to rem based on 16px
    rem_val = float(val) / 16
    # format to remove trailing zeros
    rem_str = f"{rem_val:f}".rstrip('0').rstrip('.')
    return f"{rem_str}rem"

# Regex for numbers followed by px
new_content = re.sub(r'([0-9\.]+)px', repl, content)

with open('src/app/globals.css', 'w') as f:
    f.write(new_content)

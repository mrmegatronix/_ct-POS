import re

with open('app.jsx', 'r') as f:
    content = f.read()

# Replace <ShoppingCart ... />
content = re.sub(r'<ShoppingCart[^>]*/>', '🛒', content)

# Replace <Utensils ... />
content = re.sub(r'<Utensils[^>]*/>', '🍽️', content)

# Replace <Coffee ... />
content = re.sub(r'<Coffee[^>]*/>', '☕', content)

# Replace <User ... />
content = re.sub(r'<User[^>]*/>', '👤', content)

# Replace <Minus ... />
content = re.sub(r'<Minus[^>]*/>', '-', content)

# Replace <Plus ... />
content = re.sub(r'<Plus[^>]*/>', '+', content)

# Replace <Trash2 ... />
content = re.sub(r'<Trash2[^>]*/>', '🗑️', content)

# Replace <Printer ... />
content = re.sub(r'<Printer[^>]*/>', '🖨️', content)

# Replace <Ban ... />
content = re.sub(r'<Ban[^>]*/>', '🚫', content)

# Replace <Send ... />
content = re.sub(r'<Send[^>]*/>', '📤', content)

# Replace <CreditCard ... />
content = re.sub(r'<CreditCard[^>]*/>', '💳', content)

# Now fix the bottom grid arrays
content = re.sub(r'icon:\s*[A-Za-z0-9_]+', "icon: null", content)
content = re.sub(r'<btn\.icon[^>]*/>', '', content)

with open('app.jsx', 'w') as f:
    f.write(content)

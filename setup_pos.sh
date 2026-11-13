#!/bin/bash
set -e

# Initialize Vite React TS project
npx -y create-vite@latest . --template react-ts

# Install dependencies including tailwind and lucide-react
npm install
npm install -D tailwindcss postcss autoprefixer
npx -y tailwindcss init -p

# Configure tailwind
cat << 'EOF' > tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOF

# Setup global CSS
cat << 'EOF' > src/index.css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #0f172a; /* Tailwind slate-900 */
}
EOF

npm install lucide-react

# Add posData.ts script and run it
cat << 'EOF' > generate_pos_data.py
import json
import os
import uuid

food_menu = [
    {"name": "Flat Bread", "price": 16.0, "category": "Pizza"},
    {"name": "Pepperoni Pizza", "price": 22.0, "category": "Pizza"},
    {"name": "Hawaiian Pizza", "price": 22.0, "category": "Pizza"},
    {"name": "Veggie Attack", "price": 22.0, "category": "Pizza"},
    {"name": "Meatlovers Pizza", "price": 25.0, "category": "Pizza"},
    {"name": "Cranberry Chicken", "price": 25.0, "category": "Pizza"},
    {"name": "The BBQ Grazier", "price": 25.0, "category": "Pizza"},
    {"name": "Fries", "price": 12.0, "category": "Starters"},
    {"name": "Mini Garlic Loaf", "price": 14.0, "category": "Starters"},
    {"name": "Jalapeno Bites", "price": 15.0, "category": "Starters"},
    {"name": "Wedges", "price": 16.0, "category": "Starters"},
    {"name": "Crumbed Camembert", "price": 18.0, "category": "Starters"},
    {"name": "Prawn Twisters", "price": 18.0, "category": "Starters"},
    {"name": "Pork Belly Bites", "price": 20.0, "category": "Starters"},
    {"name": "Chicken Poppers", "price": 20.0, "category": "Starters"},
    {"name": "Chilli Garlic Butter Prawns", "price": 21.0, "category": "Starters"},
    {"name": "Coaster's Basket", "price": 22.0, "category": "Starters"},
    {"name": "Nachos", "price": 25.0, "category": "Starters"},
    {"name": "Bao Buns", "price": 20.0, "category": "Bao Buns"},
    {"name": "Fish Burger", "price": 25.0, "category": "Burgers"},
    {"name": "Chicken Burger", "price": 25.0, "category": "Burgers"},
    {"name": "The Coaster's Burger", "price": 26.0, "category": "Burgers"},
    {"name": "Pork Belly Burger", "price": 27.0, "category": "Burgers"},
    {"name": "Peri Peri Burger", "price": 27.0, "category": "Burgers"},
    {"name": "Roast Veggie Salad", "price": 22.0, "category": "Salads"},
    {"name": "Thai Salad", "price": 22.0, "category": "Salads"},
    {"name": "Pork Belly Salad", "price": 28.0, "category": "Salads"},
    {"name": "Rump", "price": 28.0, "category": "Steaks"},
    {"name": "Sirloin", "price": 32.0, "category": "Steaks"},
    {"name": "Surf 'n' Turf", "price": 40.0, "category": "Steaks"},
    {"name": "Roast Root Veggies", "price": 7.5, "category": "Sides"},
    {"name": "Mash", "price": 7.5, "category": "Sides"},
    {"name": "2 Eggs", "price": 7.5, "category": "Sides"},
    {"name": "Greens", "price": 8.5, "category": "Sides"},
    {"name": "Mushrooms", "price": 8.5, "category": "Sides"},
    {"name": "Salad", "price": 8.5, "category": "Sides"},
    {"name": "Slaw", "price": 5.0, "category": "Sides"},
    {"name": "Mushroom Sauce", "price": 5.0, "category": "Sides"},
    {"name": "Plum Sauce", "price": 2.0, "category": "Sides"},
    {"name": "Sweet Chilli Sauce", "price": 2.0, "category": "Sides"},
    {"name": "Peppercorn Sauce", "price": 6.0, "category": "Sides"},
    {"name": "Blue Cheese Sauce", "price": 6.0, "category": "Sides"},
    {"name": "Sour Cream", "price": 5.0, "category": "Sides"},
    {"name": "Gravy", "price": 5.0, "category": "Sides"},
    {"name": "Garlic Butter", "price": 5.0, "category": "Sides"},
    {"name": "Bangers & Mash", "price": 23.0, "category": "Mains"},
    {"name": "Cauli-Crunch", "price": 24.0, "category": "Mains"},
    {"name": "Seafood Chowder", "price": 25.0, "category": "Mains"},
    {"name": "Roast of the Day", "price": 28.0, "category": "Mains"},
    {"name": "Coasters Signature Pasta", "price": 29.0, "category": "Mains"},
    {"name": "Fish & Chips", "price": 30.0, "category": "Mains"},
    {"name": "Chicken Schnitzel", "price": 30.0, "category": "Mains"},
    {"name": "Chicken Toscana", "price": 34.0, "category": "Mains"},
    {"name": "Coaster's Ribs", "price": 30.0, "category": "Mains"},
    {"name": "Pork Belly", "price": 34.0, "category": "Mains"},
    {"name": "Fish of the Day", "price": 34.0, "category": "Mains"},
    {"name": "Chef's Beef Cheek", "price": 35.0, "category": "Mains"},
    {"name": "Kid's Platter", "price": 15.0, "category": "Kids"},
    {"name": "Kid's Pasta", "price": 15.0, "category": "Kids"},
    {"name": "Kid's Plate", "price": 15.0, "category": "Kids"},
    {"name": "Ice Cream Sundae", "price": 13.0, "category": "Desserts"},
    {"name": "Cheesecake", "price": 15.0, "category": "Desserts"},
    {"name": "Chocolate Brownie", "price": 16.0, "category": "Desserts"},
    {"name": "Pistachio Tiramisu", "price": 16.0, "category": "Desserts"}
]

beverages = []
try:
    with open('../_ctos-beta/new_menu.json', 'r') as f:
        beverages = json.load(f)
except Exception as e:
    print(f"Error reading new_menu.json: {e}")
    # Fallback mock data if json not found
    beverages = [
        {"id": "b1", "name": "Aperol", "price": 11, "category": "Aperitif"},
        {"id": "b2", "name": "Campari", "price": 11, "category": "Aperitif"},
        {"id": "b3", "name": "Heineken", "price": 9, "category": "Tap Beer"}
    ]

formatted_food = []
for item in food_menu:
    formatted_food.append({
        "id": f"food-{str(uuid.uuid4())[:8]}",
        "name": item["name"],
        "description": "Food - " + item["category"],
        "price": item["price"],
        "category": item["category"],
        "allergens": [],
        "isAvailable": True,
        "type": "Food"
    })

for b in beverages:
    b["type"] = "Beverage"

combined = beverages + formatted_food

ts_content = "export interface POSMenuItem {\n  id: string;\n  name: string;\n  description?: string;\n  price: number;\n  category: string;\n  allergens?: string[];\n  isAvailable: boolean;\n  stockItemId?: string;\n  deductionMl?: number;\n  type: 'Food' | 'Beverage';\n}\n\n"
ts_content += f"export const POS_MENU: POSMenuItem[] = {json.dumps(combined, indent=2)};\n"
with open('src/posData.ts', 'w') as f:
    f.write(ts_content)
EOF

python3 generate_pos_data.py

# Write App.tsx
cat << 'EOF' > src/App.tsx
import React, { useState, useMemo } from 'react';
import { POS_MENU, POSMenuItem } from './posData';
import { ShoppingCart, Plus, Minus, Trash2, Search, CreditCard, Tag, Ban, Send, Coffee, Utensils, Grid, LayoutDashboard, Settings, User } from 'lucide-react';

interface OrderLine {
  id: string;
  item: POSMenuItem;
  quantity: number;
}

const App: React.FC = () => {
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [activeTab, setActiveTab] = useState<'Food' | 'Beverage'>('Food');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    POS_MENU.filter(item => item.type === activeTab).forEach(item => cats.add(item.category));
    return Array.from(cats).sort();
  }, [activeTab]);

  const filteredItems = useMemo(() => {
    let items = POS_MENU.filter(item => item.type === activeTab);
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }
    return items;
  }, [activeTab, selectedCategory]);

  const addToOrder = (item: POSMenuItem) => {
    setOrderLines(prev => {
      const existing = prev.find(line => line.item.id === item.id);
      if (existing) {
        return prev.map(line =>
          line.item.id === item.id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...prev, { id: crypto.randomUUID(), item, quantity: 1 }];
    });
  };

  const updateQuantity = (lineId: string, delta: number) => {
    setOrderLines(prev => prev.map(line => {
      if (line.id === lineId) {
        const newQuantity = line.quantity + delta;
        return newQuantity > 0 ? { ...line, quantity: newQuantity } : line;
      }
      return line;
    }));
  };

  const removeLine = (lineId: string) => {
    setOrderLines(prev => prev.filter(line => line.id !== lineId));
  };

  const subtotal = orderLines.reduce((sum, line) => sum + (line.item.price * line.quantity), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans overflow-hidden">
      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-slate-950 p-4 border-b border-slate-800">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold tracking-wider text-emerald-500">TEVALIS<span className="text-white">POS</span></h1>
          <div className="flex bg-slate-800 rounded-lg p-1">
            <button 
              onClick={() => { setActiveTab('Food'); setSelectedCategory(null); }}
              className={`px-8 py-3 rounded-md font-bold transition-colors ${activeTab === 'Food' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Utensils className="inline w-5 h-5 mr-2"/> FOOD
            </button>
            <button 
              onClick={() => { setActiveTab('Beverage'); setSelectedCategory(null); }}
              className={`px-8 py-3 rounded-md font-bold transition-colors ${activeTab === 'Beverage' ? 'bg-cyan-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Coffee className="inline w-5 h-5 mr-2"/> BEVERAGES
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right mr-4">
            <p className="text-sm text-slate-400">Terminal 1</p>
            <p className="font-bold">Server: John D.</p>
          </div>
          <button className="bg-slate-800 p-3 rounded-full hover:bg-slate-700">
            <User className="w-6 h-6"/>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Menu Area */}
        <div className="flex-1 flex flex-col p-4 space-y-4">
          {/* Categories Grid */}
          <div className="grid grid-cols-5 gap-3">
             <button 
                onClick={() => setSelectedCategory(null)}
                className={`py-4 px-2 font-bold rounded-lg shadow-sm border-2 transition-all ${!selectedCategory ? 'bg-slate-700 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
              >
                ALL
              </button>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-4 px-2 font-bold rounded-lg shadow-sm border-2 truncate transition-all ${selectedCategory === cat ? 'bg-slate-700 border-emerald-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => addToOrder(item)}
                  className={`relative p-4 rounded-xl font-bold flex flex-col justify-between items-start text-left shadow-lg border border-slate-700 hover:brightness-110 active:scale-95 transition-all h-32 ${item.type === 'Food' ? 'bg-orange-950/40 hover:border-orange-500' : 'bg-cyan-950/40 hover:border-cyan-500'}`}
                >
                  <span className="text-[15px] leading-tight line-clamp-3">{item.name}</span>
                  <span className="mt-2 text-lg text-emerald-400">${item.price.toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Order Pane */}
        <div className="w-[450px] bg-slate-800 flex flex-col shadow-2xl border-l border-slate-700 z-10">
          <div className="p-4 bg-slate-900 flex justify-between items-center border-b border-slate-800">
             <div className="font-bold text-lg">Table 14</div>
             <div className="text-slate-400 text-sm">Covers: 2</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {orderLines.length === 0 ? (
              <div className="h-full flex flex-col justify-center items-center text-slate-600">
                <ShoppingCart className="w-16 h-16 mb-4 opacity-50"/>
                <p className="font-medium text-lg">No Items</p>
              </div>
            ) : (
              orderLines.map(line => (
                <div key={line.id} className="flex bg-slate-700/50 p-3 rounded-lg items-center border-l-4 border-emerald-500">
                   <div className="flex-1">
                     <div className="font-bold text-[15px]">{line.item.name}</div>
                     <div className="text-slate-400 text-sm">1 x ${line.item.price.toFixed(2)}</div>
                   </div>
                   <div className="flex items-center space-x-2">
                      <div className="font-mono font-bold text-lg w-16 text-right mr-4">${(line.item.price * line.quantity).toFixed(2)}</div>
                      <div className="flex bg-slate-900 rounded-lg">
                        <button onClick={() => updateQuantity(line.id, -1)} className="p-2 hover:bg-slate-700 rounded-l-lg text-slate-300"><Minus className="w-4 h-4"/></button>
                        <div className="px-3 py-2 font-bold bg-slate-800">{line.quantity}</div>
                        <button onClick={() => updateQuantity(line.id, 1)} className="p-2 hover:bg-slate-700 rounded-r-lg text-slate-300"><Plus className="w-4 h-4"/></button>
                      </div>
                      <button onClick={() => removeLine(line.id)} className="p-2 text-red-400 hover:bg-red-950/50 rounded-lg"><Trash2 className="w-5 h-5"/></button>
                   </div>
                </div>
              ))
            )}
          </div>

          <div className="bg-slate-900 p-4 border-t border-slate-800 space-y-2">
             <div className="flex justify-between text-slate-400 text-sm">
               <span>Subtotal</span>
               <span className="font-mono">${subtotal.toFixed(2)}</span>
             </div>
             <div className="flex justify-between text-slate-400 text-sm">
               <span>Tax (15%)</span>
               <span className="font-mono">${tax.toFixed(2)}</span>
             </div>
             <div className="flex justify-between font-bold text-2xl pt-2 border-t border-slate-800">
               <span>Total</span>
               <span className="font-mono text-emerald-400">${total.toFixed(2)}</span>
             </div>
          </div>

          <div className="p-2 bg-slate-800">
             <div className="grid grid-cols-4 gap-2 mb-2">
                <button className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center"><LayoutDashboard className="w-6 h-6 mb-2 text-slate-400"/>Table Plan</button>
                <button className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center"><Grid className="w-6 h-6 mb-2 text-slate-400"/>Tabs</button>
                <button className="bg-slate-700 hover:bg-slate-600 p-4 rounded-lg font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center"><Tag className="w-6 h-6 mb-2 text-yellow-400"/>Discount</button>
                <button onClick={() => setOrderLines([])} className="bg-slate-700 hover:bg-red-900 p-4 rounded-lg font-bold text-xs uppercase tracking-wider flex flex-col items-center justify-center"><Ban className="w-6 h-6 mb-2 text-red-400"/>Void All</button>
             </div>
             <div className="grid grid-cols-2 gap-2">
                <button className="bg-blue-600 hover:bg-blue-500 py-6 rounded-lg font-bold text-lg uppercase flex justify-center items-center shadow-lg"><Send className="w-6 h-6 mr-2"/> Send Order</button>
                <button className="bg-emerald-600 hover:bg-emerald-500 py-6 rounded-lg font-bold text-lg uppercase flex justify-center items-center shadow-lg"><CreditCard className="w-6 h-6 mr-2"/> Pay Total</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
EOF

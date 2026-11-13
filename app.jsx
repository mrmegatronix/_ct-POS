const { useState, useEffect, useMemo } = React;

// Helper to look up price from POS_MENU or fallback
const findMenuItem = (name, fallbackPrice = 12.0, category = 'General', type = 'Beverage') => {
  const menu = window.POS_MENU || [];
  const lower = name.toLowerCase();
  const match = menu.find(m => m.name.toLowerCase() === lower) ||
                menu.find(m => m.name.toLowerCase().includes(lower) || lower.includes(m.name.toLowerCase()));
  if (match) return { ...match };
  return { id: `custom-${lower.replace(/[^a-z0-9]/g, '-')}`, name, price: fallbackPrice, category, type };
};

// Persistent Top Quick-Access Beer / Tap / Bottle / QRT Grid (from Tevalis layout)
const TOP_BEER_ROW1 = [
  { name: 'Speights Mid Ale', price: 10.0, bg: 'bg-[#1e293b] text-white' },
  { name: 'Summit Ultra', price: 10.5, bg: 'bg-[#0ea5e9] text-slate-950' },
  { name: 'Steinlager Classic', price: 11.0, bg: 'bg-[#22c55e] text-slate-950' },
  { name: 'Guinness', price: 13.0, bg: 'bg-[#7f1d1d] text-white' },
  { name: 'Panhead Super. APA', price: 13.0, bg: 'bg-[#1e3a8a] text-white' },
  { name: 'Panhead Sandman', price: 13.0, bg: 'bg-[#1e3a8a] text-white' },
  { name: 'Panhead Pickup IPA', price: 13.0, bg: 'bg-[#1e3a8a] text-white' },
  { name: 'Pink Gin TAP', price: 12.5, bg: 'bg-[#e879f9] text-slate-950' },
];

const TOP_BEER_ROW2 = [
  { name: 'Speights Gold', price: 10.5, bg: 'bg-[#f97316] text-slate-950' },
  { name: "Mac's Gold", price: 11.0, bg: 'bg-[#eab308] text-slate-950' },
  { name: 'Steinlager Ultra', price: 11.0, bg: 'bg-[#4ade80] text-slate-950' },
  { name: 'Stella Artois', price: 12.0, bg: 'bg-[#0284c7] text-white' },
  { name: 'Ginger Giant', price: 12.0, bg: 'bg-[#ea580c] text-slate-950' },
  { name: "Emerson's Pilsner", price: 12.5, bg: 'bg-[#2563eb] text-white' },
  { name: "Mac's Cloudy Apple Cider", price: 11.5, bg: 'bg-[#cbd5e1] text-slate-950' },
  { name: 'Kirin Hyoketsu', price: 12.0, bg: 'bg-[#15803d] text-white' },
];

const TOP_BEER_ROW3_BTL = [
  { name: 'Corona', price: 11.0, bg: 'bg-[#facc15] text-slate-950' },
  { name: 'Steinlager Classic BTL', price: 10.5, bg: 'bg-[#16a34a] text-slate-950' },
  { name: 'Steinlager Pure BTL', price: 11.0, bg: 'bg-[#15803d] text-slate-950' },
  { name: 'Steinlager Manuka BTL', price: 11.5, bg: 'bg-[#fde047] text-slate-950' },
];

const TOP_BEER_ROW3_QRT = [
  { name: 'Speights QRT', price: 16.0, bg: 'bg-[#f97316] text-slate-950' },
  { name: 'DB Draught QRT', price: 16.0, bg: 'bg-[#9a3412] text-white' },
];

const TOP_BEER_ROW4_BTL = [
  { name: 'Corona 0%', price: 9.5, bg: 'bg-[#fde68a] text-slate-950' },
  { name: 'Summit 0%', price: 9.5, bg: 'bg-[#fef08a] text-slate-950' },
  { name: 'Steinlager 0%', price: 9.5, bg: 'bg-[#4d7c0f] text-white' },
  { name: 'Steinlager 2.5%', price: 10.0, bg: 'bg-[#4ade80] text-slate-950' },
  { name: 'Speights Old Dark', price: 10.5, bg: 'bg-[#a8a29e] text-slate-950' },
];

const TOP_BEER_ROW4_QRT = [
  { name: 'Summit Ultra QRT', price: 16.5, bg: 'bg-[#0284c7] text-white' },
  { name: 'Export Gold QRT', price: 16.0, bg: 'bg-[#d97706] text-slate-950' },
];

// Wine Columns (Sparkling & White Wine)
const WHITE_WINE_COLS = [
  {
    title: 'Sparkling',
    items: [
      { name: 'Lindauer Fraise', price: 12.0, bg: 'bg-[#f5d0fe] text-slate-900' },
      { name: 'Lindauer Sauv Blanc', price: 12.0, bg: 'bg-[#86efac] text-slate-900' },
      { name: 'Lindauer Brut Cuvee', price: 12.0, bg: 'bg-[#fed7aa] text-slate-900' },
      { name: 'Lindauer Prosecco', price: 12.5, bg: 'bg-[#e9d5ff] text-slate-900' },
      { name: 'Moet Chandon Imperial Brut NV', price: 145.0, bg: 'bg-[#67e8f9] text-slate-900' },
      { name: 'Daniel Le Brun', price: 16.0, bg: 'bg-[#fef08a] text-slate-900' },
    ],
  },
  {
    title: 'Sauvignon',
    items: [
      { name: 'House Sav Kopiko Bay', price: 11.0, bg: 'bg-[#a7f3d0] text-slate-900' },
      { name: 'Wither Hills Early Light Sav 9.5%', price: 12.5, bg: 'bg-[#86efac] text-slate-900' },
      { name: 'Wither Hills Sav', price: 13.0, bg: 'bg-[#bbf7d0] text-slate-900' },
      { name: 'The Ned Sav', price: 13.5, bg: 'bg-[#bae6fd] text-slate-900' },
      { name: 'Roaring Meg Sauv Blanc', price: 14.5, bg: 'bg-[#86efac] text-slate-900' },
    ],
  },
  {
    title: 'Pinot Gris',
    items: [
      { name: 'House Pinot Gris Kopiko Bay', price: 11.0, bg: 'bg-[#7dd3fc] text-slate-900' },
      { name: 'Wither Hills Early Light PG 9.5%', price: 12.5, bg: 'bg-[#93c5fd] text-slate-900' },
      { name: 'Wither Hills Pinot Gris', price: 13.0, bg: 'bg-[#bae6fd] text-slate-900' },
      { name: 'The Ned Pinot Gris', price: 13.5, bg: 'bg-[#cbd5e1] text-slate-900' },
      { name: 'Roaring Meg Pinot Gris', price: 14.5, bg: 'bg-[#a5f3fc] text-slate-900' },
    ],
  },
  {
    title: 'Chardonnay',
    items: [
      { name: 'House Chard Kopiko Bay', price: 11.0, bg: 'bg-[#fdba74] text-slate-900' },
      { name: 'The Ned Chard', price: 13.5, bg: 'bg-[#fed7aa] text-slate-900' },
      { name: 'Huntaway Reserve Chard', price: 14.5, bg: 'bg-[#e2e8f0] text-slate-900' },
    ],
  },
  {
    title: 'Rose / Riesl',
    items: [
      { name: 'Wither Hills Rose', price: 13.0, bg: 'bg-[#f0abfc] text-slate-900' },
      { name: 'The Ned Pinot Rose', price: 13.5, bg: 'bg-[#f5d0fe] text-slate-900' },
      { name: 'Wither Hills Riesling', price: 13.0, bg: 'bg-[#bfdbfe] text-slate-900' },
      { name: 'Roaring Meg Riesling', price: 14.5, bg: 'bg-[#93c5fd] text-slate-900' },
    ],
  },
];

// Initial Floorplan Tables (matching Coasters Tavern photos)
const INITIAL_TABLES = [
  { id: '5', label: '5', covers: 0, total: 188.20, x: 12, y: 2, w: 8, h: 11 },
  { id: '6', label: '6', covers: 0, total: 109.50, x: 20.5, y: 2, w: 8, h: 11 },
  { id: '7', label: '7', covers: 0, total: 51.80, x: 29, y: 2, w: 8, h: 11 },
  { id: '8', label: '8', covers: 0, total: 15.30, x: 37.5, y: 2, w: 8, h: 11 },
  { id: '31', label: '31', covers: 0, total: 0, x: 52, y: 4, w: 8, h: 9 },
  { id: '33', label: '33', covers: 0, total: 0, x: 82, y: 7, w: 5.5, h: 18 },
  { id: '4', label: '4', covers: 0, total: 0, x: 12, y: 17, w: 7, h: 11 },
  { id: '13', label: '13', covers: 0, total: 0, x: 21, y: 21, w: 6, h: 16 },
  { id: '14', label: '14', covers: 0, total: 0, x: 29, y: 18, w: 6, h: 16 },
  { id: '2', label: '2', covers: 0, total: 54.30, x: 40, y: 17, w: 5, h: 11 },
  { id: '30', label: '30', covers: 0, total: 0, x: 50, y: 12, w: 6, h: 17 },
  { id: '32', label: '32', covers: 0, total: 0, x: 58, y: 19, w: 6, h: 13 },
  { id: '3', label: '3', covers: 0, total: 0, x: 12, y: 29, w: 7, h: 11 },
  { id: '12', label: '12', covers: 0, total: 0, x: 21, y: 43, w: 7, h: 10, rotate: true },
  { id: '15', label: '15', covers: 0, total: 0, x: 30, y: 41, w: 7, h: 10, rotate: true },
  { id: '9', label: '9', covers: 0, total: 104.70, x: 40, y: 40, w: 7, h: 11 },
  { id: '10', label: '10', covers: 0, total: 40.00, x: 40, y: 52, w: 7, h: 11 },
  { id: '18', label: '18', covers: 0, total: 0, x: 49, y: 38, w: 6, h: 18 },
  { id: '19', label: '19', covers: 0, total: 0, x: 57, y: 39, w: 5, h: 14 },
  { id: '17', label: '17', covers: 0, total: 0, x: 49, y: 57, w: 6, h: 18 },
  { id: '20', label: '20', covers: 0, total: 0, x: 57, y: 63, w: 6, h: 7 },
  { id: '21', label: '21', covers: 0, total: 0, x: 63.5, y: 63, w: 6, h: 7 },
  { id: '22', label: '22', covers: 0, total: 0, x: 72, y: 50, w: 6, h: 17 },
  { id: '23', label: '23', covers: 0, total: 0, x: 78.5, y: 50, w: 6, h: 17 },
  { id: '25', label: '25', covers: 0, total: 0, x: 85, y: 39, w: 6, h: 19 },
  { id: '24', label: '24', covers: 0, total: 26.55, note: 'coles', x: 84.5, y: 59, w: 6, h: 18 },
  { id: '11', label: '11', covers: 0, total: 0, note: 'MEAT', active: true, x: 22, y: 60, w: 9, h: 8 },
  { id: '16', label: '16', covers: 0, total: 0, note: 'MEAT', active: true, x: 32, y: 60, w: 9, h: 8 },
  { id: '40', label: '40', covers: 0, total: 0, x: 12, y: 63, w: 8, h: 8 },
  { id: '1', label: '1', covers: 0, total: 0, x: 12, y: 72, w: 8, h: 8 },
  { id: '50', label: '50', covers: 0, total: 40.29, note: 'CARMAR', x: 12, y: 84, w: 7.5, h: 8 },
  { id: '51', label: '51', covers: 0, total: 34.00, x: 20, y: 84, w: 7.5, h: 8 },
  { id: '52', label: '52', covers: 0, total: 0, x: 28, y: 84, w: 7.5, h: 8 },
  { id: '53', label: '53', covers: 2, total: 40.50, x: 36, y: 84, w: 7.5, h: 8 },
  { id: '55', label: '55', covers: 0, total: 0, x: 44, y: 84, w: 7.5, h: 8 },
  { id: '56', label: '56', covers: 0, total: 50.00, note: 'JAMBA', x: 52, y: 84, w: 7.5, h: 8 },
  { id: '57', label: '57', covers: 0, total: 46.70, note: 'AL', x: 60, y: 84, w: 7.5, h: 8 },
  { id: '58', label: '58', covers: 0, total: 0, x: 68, y: 84, w: 7.5, h: 8 },
  { id: '26', label: '26', covers: 0, total: 15.30, x: 76, y: 84, w: 8, h: 8 },
];

const LAYOUT_OPTIONS = [
  { id: 'classic', label: '1: Classic Tevalis' },
  { id: 'left-receipt', label: '2: Left Receipt' },
  { id: 'split-speed', label: '3: Split Bar/Menu' },
];

const App = () => {
  const [time, setTime] = useState(new Date());
  const [layoutMode, setLayoutMode] = useState('classic'); // 'classic' | 'left-receipt' | 'split-speed'
  const [mainMode, setMainMode] = useState('Beverage'); // 'Lunch' | 'Dinner' | 'Beverage'
  const [subTab, setSubTab] = useState('Sparkling & White Wine');
  const [spiritCat, setSpiritCat] = useState('Gin');
  const [selectedTable, setSelectedTable] = useState('Standard');
  const [covers, setCovers] = useState(0);
  const [orderLines, setOrderLines] = useState([]);
  const [selectedLineId, setSelectedLineId] = useState(null);
  const [numpadVal, setNumpadVal] = useState('');
  const [enterQtyMode, setEnterQtyMode] = useState(false);
  const [showFloorplan, setShowFloorplan] = useState(false);
  const [floorplanFilter, setFloorplanFilter] = useState('Tables');
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [openItemName, setOpenItemName] = useState('');
  const [openItemPrice, setOpenItemPrice] = useState('');
  const [commentText, setCommentText] = useState('');
  const [memberName, setMemberName] = useState('');
  const [discountPct, setDiscountPct] = useState(0);

  const POS_MENU = window.POS_MENU || [];

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const cycleLayout = () => {
    const idx = LAYOUT_OPTIONS.findIndex(l => l.id === layoutMode);
    const next = LAYOUT_OPTIONS[(idx + 1) % LAYOUT_OPTIONS.length];
    setLayoutMode(next.id);
    showToast(`View: ${next.label}`);
  };

  const switchMainMode = (mode) => {
    setMainMode(mode);
    if (mode === 'Beverage') setSubTab('Sparkling & White Wine');
    else if (mode === 'Lunch') setSubTab('Lunch');
    else if (mode === 'Dinner') setSubTab('Starters');
  };

  const addItem = (name, fallbackPrice, category = 'General', type = 'Beverage') => {
    const item = findMenuItem(name, fallbackPrice, category, type);
    const qty = enterQtyMode && parseInt(numpadVal, 10) > 0 ? parseInt(numpadVal, 10) : 1;
    if (enterQtyMode) {
      setEnterQtyMode(false);
      setNumpadVal('');
    }
    setOrderLines(prev => {
      const existing = prev.find(l => l.name === item.name && !l.comment);
      if (existing) {
        const updated = prev.map(l => l.id === existing.id ? { ...l, qty: l.qty + qty } : l);
        setSelectedLineId(existing.id);
        return updated;
      }
      const newId = crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
      setSelectedLineId(newId);
      return [...prev, { id: newId, name: item.name, price: item.price, qty, course: 1, comment: '' }];
    });
  };

  const removeSelectedLine = () => {
    if (!selectedLineId && orderLines.length > 0) {
      const last = orderLines[orderLines.length - 1];
      setOrderLines(prev => prev.slice(0, -1));
      setSelectedLineId(orderLines.length > 1 ? orderLines[orderLines.length - 2].id : null);
      showToast(`Removed ${last.name}`);
      return;
    }
    if (selectedLineId) {
      setOrderLines(prev => prev.filter(l => l.id !== selectedLineId));
      setSelectedLineId(null);
    }
  };

  const handleNumpad = (key) => {
    if (key === 'C') {
      setNumpadVal('');
      setEnterQtyMode(false);
    } else {
      setNumpadVal(prev => (prev.length < 8 ? prev + key : prev));
    }
  };

  const subtotal = orderLines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const discountAmt = subtotal * (discountPct / 100);
  const total = Math.max(0, subtotal - discountAmt);

  const finaliseSale = (method, amountGiven = null) => {
    if (orderLines.length === 0) {
      showToast('No items in order');
      return;
    }
    const change = amountGiven !== null ? amountGiven - total : 0;
    if (amountGiven !== null && change < 0) {
      showToast(`Short by $${Math.abs(change).toFixed(2)}`);
      return;
    }
    const msg = amountGiven !== null
      ? `${method} $${amountGiven.toFixed(2)} | Change: $${change.toFixed(2)}`
      : `${method} Finalised: $${total.toFixed(2)}`;
    showToast(msg);
    setOrderLines([]);
    setSelectedLineId(null);
    setDiscountPct(0);
    setNumpadVal('');
  };

  const dayStr = time.toLocaleDateString('en-NZ', { weekday: 'short', day: 'numeric', month: 'short' });
  const hh = time.getHours().toString().padStart(2, '0');
  const mm = time.getMinutes().toString().padStart(2, '0');
  const blink = time.getSeconds() % 2 === 0;

  const spiritItems = useMemo(() => {
    const map = {
      'Rum / Aperitif / Brandy': ['Rum', 'Aperitif', 'Brandy/Cognac'],
      'Bourbon': ['Bourbon'],
      'Gin': ['Gin'],
      'Scotch / Whisky': ['Scotch', 'Whiskey'],
      'Tequila / Vodka': ['Tequila', 'Vodka'],
      'Liqueur / Other': ['Other Spirits / Liquers'],
      'FAST': ['Gin', 'Vodka', 'Rum', 'Bourbon', 'Scotch'],
    };
    const cats = map[spiritCat] || ['Gin'];
    return POS_MENU.filter(i => cats.includes(i.category)).slice(0, 24);
  }, [spiritCat, POS_MENU]);

  const nonAlcItems = useMemo(() => POS_MENU.filter(i => i.category === 'Non Alcoholic'), [POS_MENU]);
  const steakItems = useMemo(() => POS_MENU.filter(i => i.category === 'Steaks'), [POS_MENU]);
  const sideItems = useMemo(() => POS_MENU.filter(i => i.category === 'Sides'), [POS_MENU]);
  const dessertItems = useMemo(() => POS_MENU.filter(i => i.category === 'Desserts'), [POS_MENU]);

  const btnBase = 'rounded border border-slate-500/70 shadow-sm font-bold leading-tight flex items-center justify-center text-center px-1.5 py-1 active:scale-95 transition-transform select-none cursor-pointer overflow-hidden';

  // --- Shared Modular Sections ---
  const renderModeAndFunctions = () => (
    <div className="grid gap-1 h-11 shrink-0" style={{ gridTemplateColumns: 'repeat(13, minmax(0, 1fr))' }}>
      <button onClick={() => switchMainMode('Lunch')} className={`${btnBase} text-sm ${mainMode === 'Lunch' ? 'bg-[#1d4ed8] text-white ring-2 ring-sky-300' : 'bg-[#334155] text-slate-200 hover:bg-slate-600'}`}>Lunch</button>
      <button onClick={() => switchMainMode('Dinner')} className={`${btnBase} text-sm ${mainMode === 'Dinner' ? 'bg-[#1d4ed8] text-white ring-2 ring-sky-300' : 'bg-[#1e3a8a] text-white hover:bg-blue-800'}`}>Dinner</button>
      <button onClick={() => switchMainMode('Beverage')} className={`${btnBase} text-sm ${mainMode === 'Beverage' ? 'bg-[#1d4ed8] text-white ring-2 ring-sky-300' : 'bg-[#1e3a8a] text-white hover:bg-blue-800'}`}>Beverage</button>

      <button onClick={() => showToast('Chit #104 Assigned')} className={`${btnBase} bg-[#b91c1c] text-white text-[11px]`}>Chit Number</button>
      <button onClick={() => showToast('Transaction Add')} className={`${btnBase} bg-[#ea580c] text-white text-[11px]`}>Transaction Add</button>
      <button onClick={() => { setEnterQtyMode(!enterQtyMode); showToast(enterQtyMode ? 'Qty Mode Off' : 'Type Qty on Numpad then Tap Item'); }} className={`${btnBase} ${enterQtyMode ? 'bg-sky-400 text-slate-950 ring-2 ring-white' : 'bg-[#0284c7] text-white'} text-[11px]`}>Enter Quantity</button>
      <button onClick={() => setModal({ type: 'discount' })} className={`${btnBase} bg-[#d97706] text-white text-[11px]`}>Discount</button>
      <button onClick={() => setModal({ type: 'comment' })} className={`${btnBase} bg-[#dc2626] text-white text-[11px]`}>ADD Comment</button>
      <button onClick={() => { if (orderLines.length) { const last = orderLines[orderLines.length - 1]; addItem(last.name, last.price); } }} className={`${btnBase} bg-[#0d9488] text-white text-[11px]`}>Repeat Order</button>
      <button onClick={() => showToast(`Printing Bill ($${total.toFixed(2)})`)} className={`${btnBase} bg-[#3b82f6] text-slate-950 text-[11px]`}>Print Bill</button>
      <button onClick={() => showToast('Printing Last Receipt')} className={`${btnBase} bg-[#115e59] text-white text-[11px]`}>Print Receipt</button>
      <button onClick={() => showToast('Cash Drawer Opened')} className={`${btnBase} bg-[#c2410c] text-white text-[11px]`}>Open Drawer</button>
      <button onClick={() => setModal({ type: 'functions' })} className={`${btnBase} bg-[#b91c1c] text-white text-[11px]`}>Functions</button>
    </div>
  );

  const renderBeerGridHorizontal = () => (
    <div className="flex flex-col gap-1 shrink-0">
      <div className="grid grid-cols-8 gap-1 h-10">
        {TOP_BEER_ROW1.map(b => (
          <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} text-[11px]`}>{b.name}</button>
        ))}
      </div>
      <div className="grid grid-cols-8 gap-1 h-10">
        {TOP_BEER_ROW2.map(b => (
          <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} text-[11px]`}>{b.name}</button>
        ))}
      </div>
      <div className="flex gap-1 h-20">
        <div className="w-5 bg-slate-200 text-slate-900 font-black text-[10px] rounded flex flex-col items-center justify-center leading-none border border-slate-400 shrink-0">
          <span>B</span><span>T</span><span>L</span>
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <div className="grid grid-cols-4 gap-1 flex-1">
            {TOP_BEER_ROW3_BTL.map(b => (
              <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} text-[11px]`}>{b.name}</button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1 flex-1">
            {TOP_BEER_ROW4_BTL.map(b => (
              <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} text-[11px]`}>{b.name}</button>
            ))}
          </div>
        </div>
        <div className="w-5 bg-slate-200 text-slate-900 font-black text-[10px] rounded flex flex-col items-center justify-center leading-none border border-slate-400 shrink-0">
          <span>Q</span><span>R</span><span>T</span>
        </div>
        <div className="w-[36%] flex flex-col gap-1 shrink-0">
          <div className="grid grid-cols-2 gap-1 flex-1 pr-[34%]">
            {TOP_BEER_ROW3_QRT.map(b => (
              <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} text-[11px]`}>{b.name}</button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1 flex-1">
            {TOP_BEER_ROW4_QRT.map(b => (
              <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} text-[11px]`}>{b.name}</button>
            ))}
            <button onClick={() => showToast('Split Item Mode')} className={`${btnBase} bg-black text-white text-[11px]`}>Split Item</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBeerGridCompact = () => (
    <div className="flex flex-col gap-1.5 h-full overflow-y-auto custom-scrollbar pr-0.5">
      <div className="bg-slate-900 text-amber-400 font-bold text-center py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">Tap Beers & Cider</div>
      <div className="grid grid-cols-2 gap-1">
        {[...TOP_BEER_ROW1, ...TOP_BEER_ROW2].map(b => (
          <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} h-10 text-[11px]`}>{b.name}</button>
        ))}
      </div>
      <div className="bg-slate-200 text-slate-900 font-bold text-center py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">BTL & 0% / Low</div>
      <div className="grid grid-cols-3 gap-1">
        {[...TOP_BEER_ROW3_BTL, ...TOP_BEER_ROW4_BTL].map(b => (
          <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} h-10 text-[10px]`}>{b.name}</button>
        ))}
      </div>
      <div className="bg-slate-200 text-slate-900 font-bold text-center py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">QRT & Split</div>
      <div className="grid grid-cols-3 gap-1">
        {[...TOP_BEER_ROW3_QRT, ...TOP_BEER_ROW4_QRT].map(b => (
          <button key={b.name} onClick={() => addItem(b.name, b.price, 'Beer', 'Beverage')} className={`${btnBase} ${b.bg} h-10 text-[10px]`}>{b.name}</button>
        ))}
        <button onClick={() => showToast('Split Item Mode')} className={`${btnBase} bg-black text-white h-10 text-[11px]`}>Split Item</button>
      </div>
    </div>
  );

  const renderSubTabs = () => (
    <>
      {mainMode === 'Beverage' && (
        <div className="grid grid-cols-7 gap-1 h-10 shrink-0">
          {['Sparkling & White Wine', 'Red Wine', 'Spirits', "Cocktails & RTD's", 'Non Alcoholic', 'Coffee'].map(t => (
            <button key={t} onClick={() => setSubTab(t)} className={`${btnBase} text-[12px] ${subTab === t ? 'bg-[#2563eb] text-white ring-2 ring-sky-300' : 'bg-[#1e3a8a] text-white hover:bg-blue-800'}`}>{t}</button>
          ))}
          <button onClick={() => setModal({ type: 'openItem', itemType: 'Beverage' })} className={`${btnBase} bg-[#fb7185] text-slate-950 text-[12px]`}>Open Drink</button>
        </div>
      )}

      {mainMode === 'Lunch' && (
        <div className="flex gap-1 h-10 shrink-0 justify-between">
          <div className="flex gap-1 w-[45%]">
            {['Lunch', 'Kids'].map(t => (
              <button key={t} onClick={() => setSubTab(t)} className={`${btnBase} flex-1 text-sm ${subTab === t ? 'bg-[#2563eb] text-white ring-2 ring-sky-300' : 'bg-[#1e3a8a] text-white hover:bg-blue-800'}`}>{t}</button>
            ))}
          </div>
          <button onClick={() => setModal({ type: 'openItem', itemType: 'Food' })} className={`${btnBase} w-24 bg-[#fb7185] text-slate-950 text-[12px]`}>Open Food</button>
        </div>
      )}

      {mainMode === 'Dinner' && (
        <div className="grid grid-cols-11 gap-1 h-10 shrink-0">
          {['Starters', 'Salads', 'Pizza', 'Burgers', 'Mains', 'Steaks', 'Sides', 'Dessert', 'Kids', 'SET MENU'].map(t => (
            <button key={t} onClick={() => setSubTab(t)} className={`${btnBase} text-[11px] ${subTab === t ? 'bg-[#0284c7] text-white ring-2 ring-sky-300' : 'bg-[#1e3a8a] text-white hover:bg-blue-800'}`}>{t}</button>
          ))}
          <button onClick={() => setModal({ type: 'openItem', itemType: 'Food' })} className={`${btnBase} bg-[#fb7185] text-slate-950 text-[11px]`}>Open Food</button>
        </div>
      )}
    </>
  );

  const renderMenuContent = () => (
    <div className="flex-1 min-w-0 min-h-0 overflow-y-auto custom-scrollbar pr-0.5">
      {mainMode === 'Beverage' && subTab === 'Sparkling & White Wine' && (
        <div className="grid grid-cols-5 gap-1 h-full">
          {WHITE_WINE_COLS.map(col => (
            <div key={col.title} className="flex flex-col gap-1">
              <div className="bg-white text-slate-900 font-bold text-center py-1 rounded text-xs shrink-0">{col.title}</div>
              {col.items.map(w => (
                <button key={w.name} onClick={() => addItem(w.name, w.price, 'White Wine', 'Beverage')} className={`${btnBase} ${w.bg} h-14 text-[12px]`}>{w.name}</button>
              ))}
            </div>
          ))}
        </div>
      )}

      {mainMode === 'Beverage' && subTab === 'Red Wine' && (
        <div className="flex gap-2 h-full">
          <div className="w-[24%] flex flex-col gap-1.5">
            <div className="bg-white text-slate-900 font-bold text-center py-1 rounded text-xs">Pinot Noir</div>
            {[
              { name: 'Huntaway Reserve Pinot Noir', price: 15.0 },
              { name: 'Kopiko Bay Pinot Noir', price: 11.5 },
              { name: 'Roaring Meg Pinot Noir', price: 16.0 },
              { name: 'Mt Difficulty Estate Bannockburn', price: 18.0 },
            ].map(w => (
              <button key={w.name} onClick={() => addItem(w.name, w.price, 'Red Wine', 'Beverage')} className={`${btnBase} bg-[#93c5fd] text-slate-900 h-16 text-[12px]`}>{w.name}</button>
            ))}
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="bg-white text-slate-900 font-bold text-center py-1 rounded text-xs">Merlot / Cab.Sav / Shiraz / Port</div>
            <div className="grid grid-cols-4 gap-1.5">
              <button onClick={() => addItem('House Red Merlot Kopiko Bay', 11.0, 'Red Wine')} className={`${btnBase} bg-[#fb923c] text-slate-900 h-20 text-[12px]`}>House Red Merlot Kopiko Bay</button>
              <button onClick={() => addItem('Cabernet Sauvignon', 13.0, 'Red Wine')} className={`${btnBase} bg-[#d8b4fe] text-slate-900 h-20 text-[12px]`}>Cabernet Sauvignon</button>
              <button onClick={() => addItem('Church Road Syrah', 15.0, 'Red Wine')} className={`${btnBase} bg-[#fdba74] text-slate-900 h-20 text-[12px]`}>Church Road Syrah</button>
              <button onClick={() => addItem('Taylors 10 Year Tawny Port', 14.0, 'Red Wine')} className={`${btnBase} bg-[#fef08a] text-slate-900 h-20 text-[12px]`}>Taylors 10 Year Tawny Port</button>
            </div>
          </div>
        </div>
      )}

      {mainMode === 'Beverage' && subTab === 'Spirits' && (
        <div className="flex flex-col gap-2 h-full">
          <div className="grid grid-cols-7 gap-1 h-11 shrink-0">
            {['Rum / Aperitif / Brandy', 'Bourbon', 'Gin', 'Scotch / Whisky', 'Tequila / Vodka', 'Liqueur / Other', 'FAST'].map(sc => (
              <button key={sc} onClick={() => setSpiritCat(sc)} className={`${btnBase} text-[11px] ${spiritCat === sc ? 'bg-[#0284c7] text-white ring-2 ring-sky-300' : 'bg-[#1e3a8a] text-white'}`}>{sc}</button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {spiritItems.map(s => (
              <button key={s.id} onClick={() => addItem(s.name, s.price, s.category, 'Beverage')} className={`${btnBase} bg-[#bae6fd] text-slate-900 h-14 text-[12px]`}>{s.name}</button>
            ))}
          </div>
        </div>
      )}

      {mainMode === 'Beverage' && subTab === "Cocktails & RTD's" && (
        <div className="grid grid-cols-5 gap-1.5 h-full">
          <div className="col-span-2 flex flex-col gap-1">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Cocktails</div>
            <div className="grid grid-cols-2 gap-1">
              {[
                ['Aperol Spritz', 18, 'bg-[#fde68a]'], ['Frozen Strawberry Daiquiri', 19, 'bg-[#fde68a]'],
                ['Margarita', 19, 'bg-[#fde68a]'], ['Sex on the Beach', 18, 'bg-[#fde68a]'],
                ['Cosmopolitan', 18, 'bg-[#fde68a]'], ['Fizzy Lizzy', 18, 'bg-[#fde68a]'],
                ['Espresso Martini', 20, 'bg-[#fde68a]'], ['Firetini', 19, 'bg-[#fb923c]'],
                ['Mojito', 19, 'bg-[#fde68a]'], ['Fireball Cocktail $12', 12, 'bg-[#fdba74]'],
                ['Long Island Iced Tea', 22, 'bg-[#fde68a]'], ['Cloverless Sour (Non Alcoholic)', 12, 'bg-[#e2e8f0]'],
              ].map(([n, p, bg]) => (
                <button key={n} onClick={() => addItem(n, p, 'Cocktails')} className={`${btnBase} ${bg} text-slate-900 h-12 text-[11px]`}>{n}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Shots</div>
            {[['Jam Donut', 12], ['Quick F*ck', 12], ["Shankey's Whip", 12], ['Fireball Shot $10', 10]].map(([n, p]) => (
              <button key={n} onClick={() => addItem(n, p, 'Shots')} className={`${btnBase} bg-[#38bdf8] text-slate-950 h-12 text-[11px]`}>{n}</button>
            ))}
            <button onClick={() => showToast('Standard Pour: 30ml / Double: 60ml')} className={`${btnBase} bg-[#f0abfc] text-slate-950 h-12 text-[11px] mt-auto`}>Product Information</button>
          </div>
          <div className="col-span-2 flex flex-col gap-1">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">RTD's</div>
            <div className="grid grid-cols-2 gap-1">
              <button onClick={() => addItem('Smirnoff Red RTD', 12, 'RTD')} className={`${btnBase} bg-[#f97316] text-slate-950 h-12 text-[11px]`}>Smirnoff Red RTD</button>
              <button onClick={() => addItem('Jack Daniels & Coke RTD', 13, 'RTD')} className={`${btnBase} bg-[#1e293b] text-white h-12 text-[11px]`}>Jack Daniels & Coke RTD</button>
              <button onClick={() => addItem('Jim Beam & Coke RTD', 12, 'RTD')} className={`${btnBase} bg-[#93c5fd] text-slate-950 h-12 text-[11px]`}>Jim Beam & Coke RTD</button>
              <div></div>
              <button onClick={() => addItem('Redbull & Jager', 14, 'RTD')} className={`${btnBase} bg-[#60a5fa] text-slate-950 h-12 text-[11px]`}>Redbull & Jager</button>
              <div></div>
              <button onClick={() => addItem('Redbull & Tequila', 14, 'RTD')} className={`${btnBase} bg-[#60a5fa] text-slate-950 h-12 text-[11px]`}>Redbull & Tequila</button>
              <div></div>
              <button onClick={() => addItem('Redbull & Vodka', 14, 'RTD')} className={`${btnBase} bg-[#60a5fa] text-slate-950 h-12 text-[11px]`}>Redbull & Vodka</button>
              <div></div>
              <button onClick={() => addItem('Cointreau & Redbull', 15, 'RTD')} className={`${btnBase} bg-[#60a5fa] text-slate-950 h-12 text-[11px]`}>Cointreau & Redbull</button>
            </div>
          </div>
        </div>
      )}

      {mainMode === 'Beverage' && subTab === 'Non Alcoholic' && (
        <div className="grid grid-cols-4 gap-1.5">
          {nonAlcItems.map(i => (
            <button key={i.id} onClick={() => addItem(i.name, i.price, 'Non Alcoholic')} className={`${btnBase} bg-[#a7f3d0] text-slate-900 h-14 text-[12px]`}>{i.name}</button>
          ))}
        </div>
      )}

      {mainMode === 'Beverage' && subTab === 'Coffee' && (
        <div className="flex flex-col gap-2">
          <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Coffee</div>
          <div className="grid grid-cols-4 gap-1.5">
            {['Flat White', 'Latte', 'Cappuchino', 'Chai Latte', 'Long Black', 'Short Black', 'Mocha', 'Hot Chocolate'].map((c, idx) => (
              <button key={c} onClick={() => addItem(c, 5.5, 'Coffee')} className={`${btnBase} ${idx === 3 || idx === 7 ? 'bg-[#e2e8f0]' : 'bg-[#fca5a5]'} text-slate-900 h-16 text-base`}>{c}</button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-1.5 mt-1">
            <div className="col-span-3 flex flex-col gap-1">
              <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Tea</div>
              <div className="grid grid-cols-3 gap-1.5">
                {['Earl Grey', 'English Breakfast', 'Green Tea'].map(t => (
                  <button key={t} onClick={() => addItem(t, 5.0, 'Coffee')} className={`${btnBase} bg-[#67e8f9] text-slate-900 h-14 text-sm`}>{t}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1 justify-end">
              {['Caramel Shot', 'Hazelnut Shot', 'Vanilla Shot'].map(s => (
                <button key={s} onClick={() => addItem(s, 1.0, 'Coffee')} className={`${btnBase} bg-[#dbeafe] text-slate-900 h-6 text-[11px]`}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      )}

      {mainMode === 'Lunch' && subTab === 'Lunch' && (
        <div className="w-[70%] flex flex-col gap-1.5">
          <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Lunch</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              ['Toasted Sandwich w. Fries', 16.0], ['Grilled Chicken Wrap', 19.0],
              ['Hot Roast Bun w. Fries', 20.0], ['Eggs Bene', 22.0],
              ['Open Steak Sandwich w. Fries', 25.0], ['Guinness Hot Pie', 22.0],
              ['The Coasters Big Breakfast', 26.0],
            ].map(([n, p]) => (
              <button key={n} onClick={() => addItem(n, p, 'Lunch', 'Food')} className={`${btnBase} bg-[#fed7aa] text-slate-900 h-14 text-[13px]`}>{n}</button>
            ))}
          </div>
        </div>
      )}

      {subTab === 'Kids' && (
        <div className="flex gap-2">
          <div className="w-[34%] flex flex-col gap-1.5">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Kids Meals</div>
            {['Kids Plate', 'Kids Pasta', 'Kids Platter'].map((k, idx) => (
              <button key={k} onClick={() => addItem(k, 15.0, 'Kids', 'Food')} className={`${btnBase} ${idx === 0 ? 'bg-[#93c5fd]' : 'bg-[#f8fafc]'} text-slate-900 h-20 text-base`}>{k}</button>
            ))}
          </div>
          <div className="w-[34%] flex flex-col gap-1.5">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Kids Desserts</div>
            <button onClick={() => addItem('Kids Sundae', 8.0, 'Kids', 'Food')} className={`${btnBase} bg-[#86efac] text-slate-900 h-20 text-base`}>Kids Sundae</button>
            <button onClick={() => addItem('Kids Plate ADULTS $19', 19.0, 'Kids', 'Food')} className={`${btnBase} bg-[#dbeafe] text-slate-900 h-16 text-sm mt-8`}>Kids Plate ADULTS $19</button>
          </div>
        </div>
      )}

      {mainMode === 'Dinner' && subTab === 'Starters' && (
        <div className="flex gap-2">
          <div className="flex-1 flex flex-col gap-1">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Starters</div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                ['Fries', 12, 'bg-[#60a5fa]'], ['Wedges', 16, 'bg-[#60a5fa]'], ['Mini Garlic Loaf', 14, 'bg-[#fde68a]'],
                ['Jalepeno Bites', 15, 'bg-[#fde68a]'], ['Prawn Twisters', 18, 'bg-[#fde68a]'], ['Chicken Poppers', 20, 'bg-[#fde68a]'],
                ['Nachos', 25, 'bg-[#fde68a]'], ['Nachos Vegetarian', 23, 'bg-[#fde68a]'], ['Chilli Garlic Butter Prawns', 21, 'bg-[#fde68a]'],
                ['Pork Belly Bites', 20, 'bg-[#fde68a]'], ['Crumbed Camembert', 18, 'bg-[#fde68a]'], ['Coasters Basket', 22, 'bg-[#7dd3fc]'],
              ].map(([n, p, bg]) => (
                <button key={n} onClick={() => addItem(n, p, 'Starters', 'Food')} className={`${btnBase} ${bg} text-slate-900 h-14 text-[13px]`}>{n}</button>
              ))}
            </div>
          </div>
          <div className="w-28 flex flex-col gap-1">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">BAO BUNS</div>
            <button onClick={() => addItem('Bao Buns', 20, 'Bao Buns', 'Food')} className={`${btnBase} bg-[#fb923c] text-slate-900 h-20 text-base`}>Bao Buns</button>
          </div>
        </div>
      )}

      {mainMode === 'Dinner' && subTab === 'Salads' && (
        <div className="w-[32%] flex flex-col gap-1.5">
          <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Salads</div>
          {[['Thai Salad', 22], ['Roast Vege Salad', 22], ['Pork Belly Salad', 28]].map(([n, p]) => (
            <button key={n} onClick={() => addItem(n, p, 'Salads', 'Food')} className={`${btnBase} bg-[#86efac] text-slate-900 h-20 text-base`}>{n}</button>
          ))}
        </div>
      )}

      {mainMode === 'Dinner' && subTab === 'Pizza' && (
        <div className="flex flex-col gap-1.5">
          <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Pizza</div>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              ['Cheesy Garlic Flat Bread', 16, 'bg-[#fde047]'], ['Pesto Flat Bread', 16, 'bg-[#fde047]'],
              ['Veggie Attack', 22, 'bg-[#86efac]'], ['Pepperoni Pizza', 22, 'bg-[#fca5a5]'],
              ['Hawaiian', 22, 'bg-[#fdba74]'], ['The BBQ Grazier', 25, 'bg-[#fca5a5]'],
              ['Meatlovers Pizza', 25, 'bg-[#fdba74]'], ['Cranberry Chicken Pizza', 25, 'bg-[#fca5a5]'],
              ['DF / GF / NG Pizza Bases', 4, 'bg-[#fce7f3]'],
            ].map(([n, p, bg]) => (
              <button key={n} onClick={() => addItem(n, p, 'Pizza', 'Food')} className={`${btnBase} ${bg} text-slate-900 h-14 text-sm`}>{n}</button>
            ))}
          </div>
        </div>
      )}

      {mainMode === 'Dinner' && subTab === 'Burgers' && (
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Burgers</div>
            <div className="grid grid-cols-2 gap-1.5">
              {[['Fish Burger', 25], ['Coasters Burger', 26], ['Chicken Burger', 25], ['Pork Belly Burger', 27], ['Peri Peri Burger', 27]].map(([n, p]) => (
                <button key={n} onClick={() => addItem(n, p, 'Burgers', 'Food')} className={`${btnBase} bg-[#fed7aa] text-slate-900 h-20 text-base`}>{n}</button>
              ))}
            </div>
          </div>
          <div className="w-[30%] flex flex-col gap-1.5">
            <div className="bg-[#dc2626] text-white font-bold text-center py-0.5 rounded text-xs">Thursday Special</div>
            <button onClick={() => addItem('1 Burger for $22', 22, 'Burgers', 'Food')} className={`${btnBase} bg-[#f8fafc] text-slate-900 h-20 text-sm`}>1 Burger for $22</button>
            <button onClick={() => addItem('2 Burgers for $40', 40, 'Burgers', 'Food')} className={`${btnBase} bg-[#f8fafc] text-slate-900 h-20 text-sm`}>2 Burgers for $40</button>
          </div>
        </div>
      )}

      {mainMode === 'Dinner' && subTab === 'Mains' && (
        <div className="flex flex-col gap-1.5">
          <div className="bg-white text-slate-900 font-bold text-center py-0.5 rounded text-xs">Mains</div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              ['Bangers & Mash', 23, 'bg-[#f1f5f9]'], ['Fish & Chips', 30, 'bg-[#7dd3fc]'], ['Pork Belly', 34, 'bg-[#f1f5f9]'],
              ['Cauli Crunch', 24, 'bg-[#f1f5f9]'], ['Chicken Schnitzel', 30, 'bg-[#f1f5f9]'], ['Fish of the Day', 34, 'bg-[#7dd3fc]'],
              ['Seafood Chowder', 25, 'bg-[#7dd3fc]'], ['Chicken Toscana', 34, 'bg-[#f1f5f9]'], ['Beef Cheek', 35, 'bg-[#f97316]'],
              ['Roast of the Moment', 28, 'bg-[#f1f5f9]'], ['Coasters Ribs', 30, 'bg-[#f1f5f9]'], ['Pasta', 29, 'bg-[#f1f5f9]'],
              ['Nachos Main', 25, 'bg-[#f1f5f9]'], ['Nachos Vegetarian Main', 23, 'bg-[#f1f5f9]'],
            ].map(([n, p, bg]) => (
              <button key={n} onClick={() => addItem(n, p, 'Mains', 'Food')} className={`${btnBase} ${bg} text-slate-900 h-11 text-[13px]`}>{n}</button>
            ))}
          </div>
          <button onClick={() => setModal({ type: 'comment' })} className={`${btnBase} w-1/3 bg-[#fca5a5] text-slate-900 h-11 text-sm mt-2`}>CHANGES</button>
        </div>
      )}

      {mainMode === 'Dinner' && subTab === 'Steaks' && (
        <div className="grid grid-cols-3 gap-2">
          {steakItems.map(i => (
            <button key={i.id} onClick={() => addItem(i.name, i.price, 'Steaks', 'Food')} className={`${btnBase} bg-[#fca5a5] text-slate-900 h-16 text-base`}>{i.name}</button>
          ))}
        </div>
      )}
      {mainMode === 'Dinner' && subTab === 'Sides' && (
        <div className="grid grid-cols-4 gap-1.5">
          {sideItems.map(i => (
            <button key={i.id} onClick={() => addItem(i.name, i.price, 'Sides', 'Food')} className={`${btnBase} bg-[#fde68a] text-slate-900 h-14 text-[12px]`}>{i.name}</button>
          ))}
        </div>
      )}
      {mainMode === 'Dinner' && subTab === 'Dessert' && (
        <div className="grid grid-cols-4 gap-2">
          {dessertItems.map(i => (
            <button key={i.id} onClick={() => addItem(i.name, i.price, 'Desserts', 'Food')} className={`${btnBase} bg-[#f5d0fe] text-slate-900 h-16 text-sm`}>{i.name}</button>
          ))}
        </div>
      )}
      {mainMode === 'Dinner' && subTab === 'SET MENU' && (
        <div className="grid grid-cols-3 gap-2">
          {[['2 Course Set Menu', 49], ['3 Course Set Menu', 59], ['Group Banquet p/p', 65]].map(([n, p]) => (
            <button key={n} onClick={() => addItem(n, p, 'Set Menu', 'Food')} className={`${btnBase} bg-[#c4b5fd] text-slate-900 h-16 text-sm`}>{n}</button>
          ))}
        </div>
      )}
    </div>
  );

  const renderFinaliseCol = (horizontal = false) => (
    <div className={horizontal ? 'grid grid-cols-5 gap-1 h-11 shrink-0' : 'w-24 flex flex-col gap-1 justify-end shrink-0'}>
      <button onClick={() => finaliseSale('Cash', 50)} className={`${btnBase} bg-[#c7d2fe] text-slate-900 ${horizontal ? 'h-full text-[11px]' : 'h-11 text-[11px]'}`}>Finalise:{horizontal ? ' ' : <br />}50.00</button>
      <button onClick={() => finaliseSale('Cash', 20)} className={`${btnBase} bg-[#86efac] text-slate-900 ${horizontal ? 'h-full text-[11px]' : 'h-11 text-[11px]'}`}>Finalise:{horizontal ? ' ' : <br />}20.00</button>
      <button onClick={() => finaliseSale('Cash', 10)} className={`${btnBase} bg-[#38bdf8] text-slate-900 ${horizontal ? 'h-full text-[11px]' : 'h-11 text-[11px]'}`}>Finalise:{horizontal ? ' ' : <br />}10.00</button>
      <button onClick={() => finaliseSale('Cash', 5)} className={`${btnBase} bg-[#fed7aa] text-slate-900 ${horizontal ? 'h-full text-[11px]' : 'h-11 text-[11px]'}`}>Finalise:{horizontal ? ' ' : <br />}5.00</button>
      <button onClick={() => showToast(numpadVal ? `Calc: ${numpadVal}` : 'Calculator Ready')} className={`${btnBase} bg-[#1e293b] text-white ${horizontal ? 'h-full text-[11px]' : 'h-10 text-[11px]'}`}>Calculator</button>
    </div>
  );

  const renderBottomBar = () => (
    <div className="grid grid-cols-8 gap-1 h-12 shrink-0">
      <button onClick={() => setShowFloorplan(true)} className={`${btnBase} bg-[#f8fafc] text-slate-900 text-[11px]`}>TABLES /<br />TABS</button>
      <button onClick={() => showToast(`Saved ${selectedTable}`)} className={`${btnBase} bg-[#f9a8d4] text-slate-900 text-xs`}>SAVE</button>
      <button onClick={() => setShowFloorplan(true)} className={`${btnBase} bg-[#93c5fd] text-slate-900 text-[11px]`}>Table<br />Transfer</button>
      <button onClick={() => showToast('Split-Bill Mode')} className={`${btnBase} bg-[#e2e8f0] text-slate-900 text-[11px]`}>Split-Bill</button>
      <button onClick={() => finaliseSale('Partial Payment', parseFloat(numpadVal) || total / 2)} className={`${btnBase} bg-[#7dd3fc] text-slate-900 text-[11px]`}>Partial<br />Payment</button>
      <button onClick={() => showToast('Cash-Out Recorded')} className={`${btnBase} bg-[#3b82f6] text-slate-950 text-xs`}>Cash-Out</button>
      <button onClick={() => finaliseSale('CASH')} className={`${btnBase} bg-[#fdba74] text-slate-950 text-sm font-black`}>CASH</button>
      <button onClick={() => finaliseSale('EFTPOS')} className={`${btnBase} bg-[#fca5a5] text-slate-950 text-sm font-black`}>EFTPOS</button>
    </div>
  );

  const renderOrderAndNumpadPane = () => (
    <div className="w-[330px] flex flex-col gap-1 shrink-0 min-h-0">
      <button onClick={() => setModal({ type: 'member' })} className={`${btnBase} bg-[#eab308] text-slate-950 h-10 text-base font-extrabold shrink-0`}>
        {memberName ? `Member: ${memberName}` : 'Member'}
      </button>

      {/* White Receipt Box */}
      <div className="flex-1 bg-white text-slate-900 rounded border border-slate-400 flex flex-col min-h-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {orderLines.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-sm">Empty Order</div>
          ) : (
            orderLines.map(line => (
              <div
                key={line.id}
                onClick={() => setSelectedLineId(line.id)}
                className={`flex justify-between items-start px-1.5 py-1 rounded cursor-pointer text-xs ${selectedLineId === line.id ? 'bg-sky-200 font-bold' : 'hover:bg-slate-100'}`}
              >
                <div className="flex-1 pr-2">
                  <span className="font-bold mr-1">{line.qty}x</span>
                  <span>{line.name}</span>
                  {line.comment && <div className="text-[10px] text-rose-600 italic pl-4">* {line.comment}</div>}
                </div>
                <div className="font-mono font-bold">${(line.price * line.qty).toFixed(2)}</div>
              </div>
            ))
          )}
        </div>
        <div className="bg-slate-200 border-t border-slate-300 px-2 py-1 text-slate-900">
          <div className="flex justify-between font-bold text-sm">
            <span>{numpadVal ? `Entry: ${numpadVal}` : discountAmt > 0 ? `Disc: -$${discountAmt.toFixed(2)}` : '0.00'}</span>
            <span>Total ${total.toFixed(2)}</span>
          </div>
          <div className="text-center text-xs text-slate-600 font-semibold">Nikko Signed On</div>
        </div>
      </div>

      {/* Numpad + Line Actions */}
      <div className="grid grid-cols-4 gap-1 h-[200px] shrink-0">
        {['7', '8', '9'].map(k => (
          <button key={k} onClick={() => handleNumpad(k)} className={`${btnBase} bg-[#334155] text-white text-lg`}>{k}</button>
        ))}
        <button onClick={removeSelectedLine} className={`${btnBase} bg-[#fca5a5] text-slate-900 text-xs`}>Remove</button>

        {['4', '5', '6'].map(k => (
          <button key={k} onClick={() => handleNumpad(k)} className={`${btnBase} bg-[#334155] text-white text-lg`}>{k}</button>
        ))}
        <button onClick={() => showToast('Course Changed')} className={`${btnBase} bg-[#38bdf8] text-slate-950 text-[11px]`}>Change<br />Course</button>

        {['1', '2', '3'].map(k => (
          <button key={k} onClick={() => handleNumpad(k)} className={`${btnBase} bg-[#334155] text-white text-lg`}>{k}</button>
        ))}
        <button onClick={removeSelectedLine} className={`${btnBase} bg-[#fecaca] text-slate-900 text-xs`}>Void Item</button>

        {['0', '00', 'C'].map(k => (
          <button key={k} onClick={() => handleNumpad(k)} className={`${btnBase} bg-[#1e3a8a] text-white text-lg`}>{k}</button>
        ))}
        <button onClick={() => finaliseSale('Tender')} className={`${btnBase} bg-[#86efac] text-slate-950 text-sm font-black`}>Tender</button>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen bg-[#3b4754] text-slate-100 flex flex-col overflow-hidden select-none text-[12px]">
      {/* Top Status Bar with View Changer */}
      <div className="h-8 bg-[#1e242b] border-b border-slate-700 px-3 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
          </div>
          <span className="font-mono font-semibold text-slate-200 whitespace-nowrap">
            {dayStr} {hh}<span className={blink ? 'opacity-100' : 'opacity-0'}>:</span>{mm}
          </span>
          <span className="text-slate-300 font-semibold whitespace-nowrap">{selectedTable}</span>
        </div>

        {/* VIEW CHANGER UP TOP */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-600">
          <button onClick={cycleLayout} className="text-[11px] font-bold text-amber-400 hover:text-amber-300 pr-1 whitespace-nowrap cursor-pointer">
            VIEW CHANGER:
          </button>
          {LAYOUT_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => { setLayoutMode(opt.id); showToast(`View: ${opt.label}`); }}
              className={`px-2 py-0.5 rounded text-[11px] font-bold whitespace-nowrap cursor-pointer transition-colors ${layoutMode === opt.id ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 text-slate-300">
          <span className="font-bold text-slate-100">Nikko</span>
          <span className="whitespace-nowrap">{covers} Covers &nbsp; {orderLines.reduce((s, l) => s + l.qty, 0)}</span>
          <span className="text-slate-200 font-semibold">General</span>
          <span className="bg-slate-700 px-2 py-0.5 rounded text-[11px] border border-slate-600">System</span>
        </div>
      </div>

      {/* LAYOUT 1: CLASSIC TEVALIS */}
      {layoutMode === 'classic' && (
        <div className="flex-1 flex min-h-0 p-1 gap-1">
          <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-1">
            {renderModeAndFunctions()}
            {renderBeerGridHorizontal()}
            {renderSubTabs()}
            <div className="flex-1 flex min-h-0 gap-1">
              {renderMenuContent()}
              {renderFinaliseCol(false)}
            </div>
            {renderBottomBar()}
          </div>
          {renderOrderAndNumpadPane()}
        </div>
      )}

      {/* LAYOUT 2: LEFT-HAND RECEIPT + BOTTOM BEER BAR */}
      {layoutMode === 'left-receipt' && (
        <div className="flex-1 flex min-h-0 p-1 gap-1">
          {renderOrderAndNumpadPane()}
          <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-1">
            {renderModeAndFunctions()}
            {renderSubTabs()}
            <div className="flex-1 flex min-h-0 gap-1">
              {renderMenuContent()}
            </div>
            {renderFinaliseCol(true)}
            {renderBeerGridHorizontal()}
            {renderBottomBar()}
          </div>
        </div>
      )}

      {/* LAYOUT 3: SPLIT BAR / MENU SPEED */}
      {layoutMode === 'split-speed' && (
        <div className="flex-1 flex min-h-0 p-1 gap-1">
          <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-1">
            {renderModeAndFunctions()}
            <div className="flex-1 flex min-h-0 gap-1.5">
              {/* Left Split: Persistent Beer Grid + Quick Finalise */}
              <div className="w-[38%] flex flex-col min-h-0 gap-1 bg-slate-800/40 p-1 rounded border border-slate-600/60">
                <div className="flex-1 min-h-0">
                  {renderBeerGridCompact()}
                </div>
                {renderFinaliseCol(true)}
              </div>
              {/* Right Split: Sub-tabs + Food/Wine/Spirit Menu */}
              <div className="flex-1 flex flex-col min-w-0 min-h-0 gap-1">
                {renderSubTabs()}
                {renderMenuContent()}
              </div>
            </div>
            {renderBottomBar()}
          </div>
          {renderOrderAndNumpadPane()}
        </div>
      )}

      {/* FLOORPLAN OVERLAY */}
      {showFloorplan && (
        <div className="fixed inset-0 bg-[#1e293b] z-50 flex p-2 gap-2">
          <div className="w-44 bg-[#273549] rounded border border-slate-600 flex flex-col justify-between p-1.5 shrink-0">
            <div className="flex flex-col gap-1.5">
              <div className="text-center font-bold text-sm py-1 text-slate-200 border-b border-slate-600">Floorplan</div>
              <button onClick={() => setFloorplanFilter('Tables')} className={`${btnBase} h-12 ${floorplanFilter === 'Tables' ? 'bg-slate-600 text-white' : 'bg-slate-700/60 text-slate-300'}`}>Tables</button>
              <button onClick={() => setFloorplanFilter('Tabs')} className={`${btnBase} h-12 ${floorplanFilter === 'Tabs' ? 'bg-slate-600 text-white' : 'bg-slate-700/60 text-slate-300'}`}>Tabs</button>
            </div>
            <div className="flex flex-col gap-1.5">
              <button onClick={() => setShowFloorplan(false)} className={`${btnBase} bg-[#7f1d1d] text-white h-10 text-xs`}>Quick Menu</button>
              <button onClick={() => showToast('Minimum Spend Set')} className={`${btnBase} bg-[#334155] text-white h-10 text-xs`}>Minimum Spend</button>
              <button onClick={() => showToast('Maximum Spend Set')} className={`${btnBase} bg-[#334155] text-white h-10 text-xs`}>Maximum Spend</button>
              <button onClick={() => setShowFloorplan(false)} className={`${btnBase} bg-[#b91c1c] text-white h-11 text-sm`}>Exit</button>
            </div>
          </div>

          <div className="flex-1 relative bg-gradient-to-br from-[#476072] to-[#334155] rounded border border-slate-500 overflow-hidden">
            <div className="absolute left-[46.5%] top-[1%] w-2 h-[72%] bg-slate-300 rounded shadow"></div>
            <div className="absolute left-[47%] top-[33%] w-[45%] h-2 bg-slate-300 rounded shadow"></div>
            <div className="absolute left-[14%] top-[43%] bg-slate-200 text-slate-900 font-bold text-[10px] px-2 py-1 rounded">POS3</div>
            <div className="absolute left-[14%] top-[51%] bg-emerald-700 text-white font-bold text-[10px] px-2 py-1 rounded">DOOR</div>
            <div className="absolute left-[66%] top-[32%] bg-white text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded">DOOR</div>
            <div className="absolute left-[62%] top-[43%] bg-slate-200 text-slate-900 font-bold text-[10px] px-2 py-1 rounded">ATM</div>
            <div className="absolute left-[70%] top-[14%] w-[10%] h-[11%] bg-slate-800/70 border border-slate-300 rounded flex items-center justify-center font-bold text-xs text-white">POOL TABLE</div>
            <div className="absolute left-[23%] top-[77%] bg-slate-200 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded">POS2</div>
            <div className="absolute left-[38%] top-[77%] bg-slate-200 text-slate-900 font-bold text-[10px] px-2 py-0.5 rounded">POS1</div>

            {INITIAL_TABLES.map(t => {
              const hasBal = t.total > 0 || t.active;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTable(`Table ${t.label}`);
                    setCovers(t.covers || 2);
                    setShowFloorplan(false);
                    showToast(`Opened Table ${t.label}`);
                  }}
                  style={{
                    left: `${t.x}%`,
                    top: `${t.y}%`,
                    width: `${t.w}%`,
                    height: `${t.h}%`,
                    transform: t.rotate ? 'rotate(-35deg)' : undefined,
                  }}
                  className={`absolute rounded-lg border-2 flex flex-col items-center justify-center text-center p-0.5 shadow cursor-pointer hover:brightness-110 transition-all ${hasBal ? 'bg-[#facc15] border-yellow-200 text-slate-950' : 'bg-[#334155]/70 border-slate-300/70 text-white'}`}
                >
                  <span className="font-black text-xs leading-none">{t.label}</span>
                  {t.note && <span className="text-[9px] font-bold leading-tight truncate max-w-full">{t.note}</span>}
                  {t.total > 0 && <span className="text-[10px] font-black leading-none mt-0.5">${t.total.toFixed(2)}</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={() => setModal(null)}>
          <div className="bg-slate-800 border-2 border-slate-600 rounded-xl p-4 w-96 shadow-2xl space-y-3" onClick={e => e.stopPropagation()}>
            {modal.type === 'openItem' && (
              <>
                <h3 className="font-bold text-lg">Open {modal.itemType}</h3>
                <input value={openItemName} onChange={e => setOpenItemName(e.target.value)} placeholder="Item description" className="w-full p-2 rounded bg-slate-900 border border-slate-600 text-white" />
                <input value={openItemPrice} onChange={e => setOpenItemPrice(e.target.value)} type="number" placeholder="Price ($)" className="w-full p-2 rounded bg-slate-900 border border-slate-600 text-white" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="px-4 py-2 bg-slate-700 rounded font-bold">Cancel</button>
                  <button onClick={() => {
                    if (openItemName && openItemPrice) {
                      addItem(openItemName, parseFloat(openItemPrice) || 0, 'Open', modal.itemType);
                      setOpenItemName(''); setOpenItemPrice(''); setModal(null);
                    }
                  }} className="px-4 py-2 bg-emerald-600 rounded font-bold">Add</button>
                </div>
              </>
            )}
            {modal.type === 'comment' && (
              <>
                <h3 className="font-bold text-lg">Add Kitchen / Bar Comment</h3>
                <input value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="e.g. No onions, extra hot" className="w-full p-2 rounded bg-slate-900 border border-slate-600 text-white" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setModal(null)} className="px-4 py-2 bg-slate-700 rounded font-bold">Cancel</button>
                  <button onClick={() => {
                    if (selectedLineId && commentText) {
                      setOrderLines(prev => prev.map(l => l.id === selectedLineId ? { ...l, comment: commentText } : l));
                    }
                    setCommentText(''); setModal(null);
                  }} className="px-4 py-2 bg-emerald-600 rounded font-bold">Apply</button>
                </div>
              </>
            )}
            {modal.type === 'discount' && (
              <>
                <h3 className="font-bold text-lg">Apply Discount</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 10, 15, 20, 25, 50, 100].map(pct => (
                    <button key={pct} onClick={() => { setDiscountPct(pct); setModal(null); showToast(`Discount: ${pct}%`); }} className="p-3 bg-amber-600 rounded font-bold">{pct}%</button>
                  ))}
                </div>
              </>
            )}
            {modal.type === 'member' && (
              <>
                <h3 className="font-bold text-lg">Member Lookup</h3>
                <input value={memberName} onChange={e => setMemberName(e.target.value)} placeholder="Member name or #ID" className="w-full p-2 rounded bg-slate-900 border border-slate-600 text-white" />
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setMemberName(''); setModal(null); }} className="px-4 py-2 bg-slate-700 rounded font-bold">Clear</button>
                  <button onClick={() => setModal(null)} className="px-4 py-2 bg-amber-500 text-slate-950 rounded font-bold">Select</button>
                </div>
              </>
            )}
            {modal.type === 'functions' && (
              <>
                <h3 className="font-bold text-lg">System Functions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['No Sale', 'Wastage', 'X-Read Report', 'Reprint Last', 'Clear Order', 'Sign Off'].map(fn => (
                    <button key={fn} onClick={() => {
                      if (fn === 'Clear Order') setOrderLines([]);
                      showToast(fn);
                      setModal(null);
                    }} className="p-3 bg-slate-700 hover:bg-slate-600 rounded font-bold">{fn}</button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-2xl border border-emerald-400 z-50 text-sm">
          {toast}
        </div>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

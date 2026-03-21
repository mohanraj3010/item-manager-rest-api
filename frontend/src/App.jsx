import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://itemflix-api.onrender.com";
const CATEGORIES = ["General", "Electronics", "Clothing", "Food", "Books", "Other"];
const CATEGORY_COLORS = {
  General:     { bg: "bg-gray-700",   text: "text-gray-200" },
  Electronics: { bg: "bg-blue-900",   text: "text-blue-300" },
  Clothing:    { bg: "bg-purple-900", text: "text-purple-300" },
  Food:        { bg: "bg-green-900",  text: "text-green-300" },
  Books:       { bg: "bg-yellow-900", text: "text-yellow-300" },
  Other:       { bg: "bg-orange-900", text: "text-orange-300" },
};
const HERO_GRADIENTS = [
  "from-red-900 via-red-800",
  "from-blue-900 via-blue-800",
  "from-purple-900 via-purple-800",
  "from-green-900 via-green-800",
  "from-orange-900 via-orange-800",
];

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ toasts, removeToast }) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id}
          className={`flex items-center gap-3 px-5 py-3 rounded-lg text-white text-sm font-medium shadow-2xl border border-white/10
            ${t.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          <span>{t.type === "success" ? "✓" : "✕"}</span>
          <span>{t.message}</span>
          <button onClick={() => removeToast(t.id)} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
        </div>
      ))}
    </div>
  );
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
function DetailModal({ item, index, onClose, onEdit, onDelete }) {
  const gradient = HERO_GRADIENTS[index % HERO_GRADIENTS.length];
  const cat = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.General;
  const initials = item.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85"
      onClick={onClose}>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Banner */}
        <div className={`relative h-48 bg-gradient-to-br ${gradient} to-zinc-900 flex items-center justify-center`}>
          <span className="text-8xl font-black text-white/20 select-none">{initials}</span>
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
          {/* Close Button */}
          <button onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition text-lg leading-none border border-white/20">
            ×
          </button>
          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${cat.bg} ${cat.text}`}>
              {item.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title + Price */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-2xl font-black text-white leading-tight">{item.name}</h2>
            <span className="text-3xl font-black text-red-400 whitespace-nowrap">₹{Number(item.price).toFixed(2)}</span>
          </div>

          {/* Description */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1.5">Description</p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              {item.description || "No description provided."}
            </p>
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-zinc-800/50 rounded-xl border border-white/5">
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Category</p>
              <p className="text-white text-sm font-semibold">{item.category}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Price</p>
              <p className="text-red-400 text-sm font-bold">₹{Number(item.price).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Added On</p>
              <p className="text-white text-sm">{item.created_at?.split(" ")[0] || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Item ID</p>
              <p className="text-zinc-400 text-sm font-mono">#{item.id}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button onClick={() => { onEdit(item); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-zinc-900 font-bold rounded-xl hover:bg-zinc-200 transition text-sm">
              ✏️ Edit Item
            </button>
            <button onClick={() => { onDelete(item); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition text-sm">
              🗑️ Delete Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Confirm Modal ───────────────────────────────────────────────────────────
function ConfirmModal({ item, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-8 w-full max-w-sm mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
          <span className="text-red-400 text-2xl">🗑</span>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Remove Title?</h3>
        <p className="text-zinc-400 text-sm mb-6">
          "<span className="text-white">{item.name}</span>" will be permanently deleted.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 transition text-sm">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition text-sm">Delete</button>
        </div>
      </div>
    </div>
  );
}

// ─── Item Form ───────────────────────────────────────────────────────────────
function ItemForm({ editItem, onClose, onSave }) {
  const [form, setForm] = useState({
    name: editItem?.name || "",
    description: editItem?.description || "",
    category: editItem?.category || "General",
    price: editItem?.price || "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Title is required";
    if (form.price !== "" && isNaN(form.price)) e.price = "Must be a number";
    if (form.price !== "" && Number(form.price) < 0) e.price = "Must be >= 0";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    try {
      const payload = { ...form, price: form.price === "" ? 0 : Number(form.price) };
      if (editItem) {
        await axios.put(`${API}/items/${editItem.id}`, payload);
        onSave("Updated successfully!", "success");
      } else {
        await axios.post(`${API}/items`, payload);
        onSave("Added to your list!", "success");
      }
      onClose();
    } catch {
      onSave("Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md mx-4">
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{editItem ? "✏️ Edit Title" : "➕ Add New Title"}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-2xl leading-none transition">×</button>
        </div>
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Title *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Enter title..."
              className={`w-full px-4 py-3 rounded-lg bg-zinc-800 border ${errors.name ? "border-red-500" : "border-white/10"} text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition text-sm`} />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Enter description..." rows={3}
              className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition text-sm resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-white/10 text-white focus:outline-none focus:border-red-500 transition text-sm">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Price (₹)</label>
              <input value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="0.00" type="number" min="0" step="0.01"
                className={`w-full px-4 py-3 rounded-lg bg-zinc-800 border ${errors.price ? "border-red-500" : "border-white/10"} text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition text-sm`} />
              {errors.price && <p className="text-red-400 text-xs mt-1">{errors.price}</p>}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-white/10 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-white/10 text-zinc-300 hover:bg-white/5 transition text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={loading}
            className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold transition text-sm flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? "Saving..." : editItem ? "Update" : "Add Title"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Item Card ───────────────────────────────────────────────────────────────
function ItemCard({ item, index, onEdit, onDelete, onView }) {
  const gradient = HERO_GRADIENTS[index % HERO_GRADIENTS.length];
  const cat = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.General;
  const initials = item.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div onClick={() => onView(item)}
      className="group relative bg-zinc-900 rounded-lg overflow-hidden border border-white/5 hover:border-red-500/50 transition-all duration-300 hover:scale-105 hover:z-10 cursor-pointer">
      <div className={`relative h-36 bg-gradient-to-br ${gradient} to-zinc-900 flex items-center justify-center`}>
        <span className="text-5xl font-black text-white/20 select-none">{initials}</span>
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1">
          <span className="text-white text-xs font-bold tracking-wider uppercase">Click to View</span>
          <div className="flex gap-2 mt-2">
            <button onClick={e => { e.stopPropagation(); onEdit(item); }}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 border border-white/30 text-white flex items-center justify-center transition text-xs">✏</button>
            <button onClick={e => { e.stopPropagation(); onDelete(item); }}
              className="w-8 h-8 rounded-full bg-red-500/80 hover:bg-red-500 border border-red-400/30 text-white flex items-center justify-center transition text-xs">🗑</button>
          </div>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-white text-sm truncate mb-1">{item.name}</h3>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded font-medium ${cat.bg} ${cat.text}`}>{item.category}</span>
          <span className="text-red-400 font-bold text-sm">₹{Number(item.price).toFixed(2)}</span>
        </div>
        {item.description && <p className="text-zinc-500 text-xs mt-1.5 truncate">{item.description}</p>}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [viewIndex, setViewIndex] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activePage, setActivePage] = useState("home");

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };
  const removeToast = (id) => setToasts(t => t.filter(x => x.id !== id));

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/items`);
      setItems(res.data.data || []);
    } catch {
      addToast("Failed to connect to server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const handleSave = (message, type) => { addToast(message, type); fetchItems(); };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`${API}/items/${deleteItem.id}`);
      addToast("Title removed!", "success");
      setDeleteItem(null);
      fetchItems();
    } catch { addToast("Failed to delete", "error"); }
  };

  const handleView = (item, index) => {
    setViewItem(item);
    setViewIndex(index);
  };

  const myList = items.filter(i => Number(i.price) > 0);
  const byCategory = CATEGORIES.reduce((acc, cat) => {
    const catItems = items.filter(i => i.category === cat);
    if (catItems.length > 0) acc[cat] = catItems;
    return acc;
  }, {});

  const filtered = items.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || i.category === activeCategory;
    return matchSearch && matchCat;
  });

  const renderGrid = (list) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {list.map((item, index) => (
        <ItemCard key={item.id} item={item} index={index}
          onView={(i) => handleView(i, index)}
          onEdit={i => { setEditItem(i); setShowForm(true); }}
          onDelete={setDeleteItem} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-30 px-8 py-4 flex items-center justify-between bg-zinc-950/95 border-b border-white/5">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-black text-red-600 tracking-tight cursor-pointer" onClick={() => setActivePage("home")}>ITEMFLIX</h1>
          <div className="hidden md:flex items-center gap-1 text-sm">
            <button onClick={() => setActivePage("home")}
              className={`px-4 py-2 rounded-lg font-medium transition ${activePage === "home" ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
              🏠 Home
            </button>
            <button onClick={() => setActivePage("mylist")}
              className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-1.5 ${activePage === "mylist" ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
              ❤️ My List
              {myList.length > 0 && (
                <span className="bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{myList.length}</span>
              )}
            </button>
            <button onClick={() => setActivePage("browse")}
              className={`px-4 py-2 rounded-lg font-medium transition ${activePage === "browse" ? "text-white bg-white/10" : "text-zinc-400 hover:text-white hover:bg-white/5"}`}>
              🎬 Browse
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-lg px-3 py-2">
            <span className="text-zinc-400 text-xs">🔍</span>
            <input value={search} onChange={e => { setSearch(e.target.value); setActivePage("home"); }}
              placeholder="Search titles..."
              className="bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none w-36" />
          </div>
          <button onClick={() => { setEditItem(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm">
            + Add
          </button>
        </div>
      </nav>

      {/* Stats Bar */}
      <div className="pt-20 px-8 pb-4 flex items-center gap-6 border-b border-white/5">
        <div className="text-center">
          <p className="text-2xl font-black text-white">{items.length}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Titles</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <p className="text-2xl font-black text-red-400">₹{items.reduce((s, i) => s + Number(i.price), 0).toFixed(0)}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Total Value</p>
        </div>
        <div className="w-px h-10 bg-white/10" />
        <div className="text-center">
          <p className="text-2xl font-black text-white">{[...new Set(items.map(i => i.category))].length}</p>
          <p className="text-xs text-zinc-500 uppercase tracking-wider">Categories</p>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* HOME */}
        {activePage === "home" && (
          <>
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
              {["All", ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition border
                    ${activeCategory === cat ? "bg-red-600 text-white border-red-600" : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white hover:border-white/30"}`}>
                  {cat}
                </button>
              ))}
              <span className="ml-auto text-zinc-500 text-xs whitespace-nowrap">{filtered.length} titles</span>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-10 h-10 border-4 border-zinc-700 border-t-red-600 rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <span className="text-6xl opacity-20">📭</span>
                <p className="text-zinc-500 text-lg">No titles found</p>
                <button onClick={() => { setEditItem(null); setShowForm(true); }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm">
                  + Add First Title
                </button>
              </div>
            ) : renderGrid(filtered)}
          </>
        )}

        {/* MY LIST */}
        {activePage === "mylist" && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">❤️ My List</h2>
            {myList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <span className="text-6xl opacity-20">❤️</span>
                <p className="text-zinc-500 text-lg">Your list is empty</p>
                <button onClick={() => { setEditItem(null); setShowForm(true); }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm mt-2">
                  + Add Item
                </button>
              </div>
            ) : renderGrid(myList)}
          </div>
        )}

        {/* BROWSE */}
        {activePage === "browse" && (
          <div>
            <h2 className="text-2xl font-black text-white mb-6">🎬 Browse by Category</h2>
            {Object.keys(byCategory).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <span className="text-6xl opacity-20">🎬</span>
                <p className="text-zinc-500 text-lg">No items to browse yet</p>
                <button onClick={() => { setEditItem(null); setShowForm(true); }}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition text-sm">
                  + Add Item
                </button>
              </div>
            ) : Object.entries(byCategory).map(([cat, catItems]) => (
              <div key={cat} className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-lg font-bold text-white">{cat}</h3>
                  <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-0.5 rounded-full">{catItems.length}</span>
                </div>
                {renderGrid(catItems)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {viewItem && (
        <DetailModal
          item={viewItem}
          index={viewIndex}
          onClose={() => setViewItem(null)}
          onEdit={i => { setEditItem(i); setShowForm(true); }}
          onDelete={setDeleteItem}
        />
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <ItemForm editItem={editItem}
          onClose={() => { setShowForm(false); setEditItem(null); }}
          onSave={handleSave} />
      )}

      {/* Delete Confirm */}
      {deleteItem && (
        <ConfirmModal item={deleteItem}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteItem(null)} />
      )}
    </div>
  );
}
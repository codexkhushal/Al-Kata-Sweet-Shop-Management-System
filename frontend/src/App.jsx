import { useState, useEffect } from 'react';
import './App.css';

const DEFAULT_IMG = "https://images.unsplash.com/photo-1559553156-2e97137af16f?w=600&fit=crop";

function App() {
  const [view, setView] = useState('home');
  const [sweets, setSweets] = useState([]);
  const [filteredSweets, setFilteredSweets] = useState([]);
  
  // 🔍 Search & Filter
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  // 🛒 Cart Logic
  const [cartItems, setCartItems] = useState([]); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 🔐 Auth Logic
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('role')); 
  const [username, setUsername] = useState(localStorage.getItem('username'));
  
  // Login UI State
  const [selectedRole, setSelectedRole] = useState(null); // 'USER' or 'ADMIN'
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // 📝 Admin Form
  const [formData, setFormData] = useState({ id: null, name: '', category: '', price: '', quantity: '', imageUrl: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { fetchSweets(); }, []);

  const fetchSweets = () => {
    fetch('http://localhost:8080/api/sweets')
      .then(res => res.json())
      .then(data => { 
        setSweets(data); 
        applyFilters(data, activeCategory, searchTerm); 
      })
      .catch(err => console.error(err));
  };

  const applyFilters = (data, category, search) => {
    let result = data;
    if (category !== 'All') result = result.filter(s => s.category === category);
    if (search) result = result.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
    setFilteredSweets(result);
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    applyFilters(sweets, activeCategory, term);
  };

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    applyFilters(sweets, cat, searchTerm);
  };

  // --- 🛒 CART FUNCTIONS ---
  const handleAddToCart = (sweet) => {
    const existingItem = cartItems.find(item => item.id === sweet.id);
    const currentQtyInCart = existingItem ? existingItem.cartQty : 0;
    if (currentQtyInCart >= sweet.quantity) { alert("Sorry! No more stock available."); return; }

    if (existingItem) {
      setCartItems(cartItems.map(item => item.id === sweet.id ? { ...item, cartQty: item.cartQty + 1 } : item));
    } else {
      setCartItems([...cartItems, { ...sweet, cartQty: 1 }]);
    }
    setIsCartOpen(true);
  };

  const updateQty = (id, change) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQty = item.cartQty + change;
        if (newQty < 1) return item; 
        if (newQty > item.quantity) { alert(`Limit reached!`); return item; }
        return { ...item, cartQty: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => setCartItems(cartItems.filter(item => item.id !== id));
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.cartQty), 0);

  // --- 🔐 AUTH & ADMIN ---
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/register' : '/login';
    
    try {
      const response = await fetch(`http://localhost:8080/auth${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameInput, password: passwordInput })
      });
      
      if (response.ok) {
        if (isRegistering) { 
           alert("Registration Success! Please Login."); 
           setIsRegistering(false); 
        } else { 
           // Login Success
           const data = await response.json(); 
           
           // Optional: Check if the role matches the button they clicked
           if(selectedRole === 'ADMIN' && data.role !== 'ROLE_ADMIN') {
              alert("Access Denied: You are not an Admin!");
              return;
           }

           setToken(data.token);
           setUserRole(data.role);
           setUsername(data.username);

           localStorage.setItem('token', data.token);
           localStorage.setItem('role', data.role);
           localStorage.setItem('username', data.username);

           if (data.role === 'ROLE_ADMIN') {
               setView('admin');
           } else {
               setView('home'); 
           }
        }
      } else { alert("Authentication Failed! Check credentials."); }
    } catch (error) { console.error(error); }
  };

  const handleLogout = () => { 
      setToken(null); 
      setUserRole(null); 
      setUsername(null);
      localStorage.clear(); 
      setView('home'); 
      setSelectedRole(null); // Reset selection
  };

  const handleSaveSweet = (e) => {
    e.preventDefault();
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing 
        ? `http://localhost:8080/api/sweets/${formData.id}` 
        : 'http://localhost:8080/api/sweets';

    fetch(url, {
        method: method, 
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
    }).then(res => { 
      if(res.ok) { 
        fetchSweets(); 
        setFormData({ id: null, name: '', category: '', price: '', quantity: '', imageUrl: '' });
        setIsEditing(false);
        alert(isEditing ? 'Item Updated!' : 'Item Added!'); 
      }
    });
  };

  const startEdit = (sweet) => { setFormData(sweet); setIsEditing(true); window.scrollTo(0,0); };
  const handleDelete = (id) => {
    if(!window.confirm("Delete this item?")) return;
    fetch(`http://localhost:8080/api/sweets/${id}`, {
      method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => { if(res.ok) fetchSweets(); });
  };
  
  const categories = ['All', ...new Set(sweets.map(s => s.category))];

  return (
    <>
      <nav className="navbar">
        <div className="logo">Al-Kata Sweets</div>
        <div className="nav-links">
          <button onClick={() => setView('home')}>Shop</button>
          
          {!token ? (
             <button onClick={() => { setView('login'); setSelectedRole(null); }}>Login</button>
          ) : (
             <>
               {userRole === 'ROLE_ADMIN' && <button onClick={() => setView('admin')}>Admin Dashboard</button>}
               <span style={{fontSize:'0.9rem', margin:'0 10px', color:'#555'}}>Hi, {username}</span>
               <button onClick={handleLogout}>Logout</button>
             </>
          )}

          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            Bag ({cartItems.reduce((acc, item) => acc + item.cartQty, 0)})
          </button>
        </div>
      </nav>

      {/* 🛒 SIDEBAR */}
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`cart-sidebar ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header"><h3>Shopping Bag</h3><button onClick={() => setIsCartOpen(false)} style={{background:'none', border:'none', fontSize:'1.5rem', cursor:'pointer'}}>×</button></div>
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.imageUrl || DEFAULT_IMG} className="cart-item-img" alt="" />
              <div className="cart-info" style={{flex:1}}>
                <h4>{item.name}</h4>
                <div style={{fontSize:'0.9rem', color:'#666'}}>₹{item.price}</div>
                <div className="qty-controls">
                   <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                   <span className="qty-val">{item.cartQty}</span>
                   <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)} style={{background:'none', border:'none', color:'#999', cursor:'pointer'}}>Remove</button>
            </div>
          ))}
        </div>
        <div className="cart-footer">
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px', fontWeight:'600'}}><span>Subtotal</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <button className="checkout-btn">Checkout</button>
        </div>
      </div>

      {/* 🏠 HOME VIEW */}
      {view === 'home' && (
        <>
          <div className="hero"><h1>PREMIUM INDIAN SWEETS</h1><p>Handmade with Love | 100% Authentic</p></div>
          <div className="product-section">
            <div style={{textAlign:'center'}}>
               <input type="text" placeholder="Search for sweets..." value={searchTerm} onChange={handleSearch} className="search-input" />
               <div className="filter-container">
                 {categories.map(cat => (
                   <button key={cat} onClick={() => handleCategoryClick(cat)} className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}>{cat}</button>
                 ))}
               </div>
            </div>
            <div className="product-grid">
              {filteredSweets.map(sweet => {
                const itemInCart = cartItems.find(i => i.id === sweet.id);
                const isOutOfStock = (itemInCart?.cartQty || 0) >= sweet.quantity;
                return (
                  <div key={sweet.id} className="product-card">
                    <div className="img-container">
                      <img src={sweet.imageUrl || DEFAULT_IMG} alt={sweet.name} className="card-img" />
                      {isOutOfStock && <div className="sold-out-badge">Sold Out</div>}
                      <button className="add-btn" onClick={() => handleAddToCart(sweet)} disabled={isOutOfStock} style={{ background: isOutOfStock ? '#eee' : 'white', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}>{isOutOfStock ? 'No Stock' : 'Add to Cart'}</button>
                    </div>
                    <div className="product-info"><span className="category-tag">{sweet.category}</span><h3>{sweet.name}</h3><div className="price-row"><span className="price">₹{sweet.price}</span></div></div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* 🔐 LOGIN VIEW (NEW: SELECTION MODE) */}
      {view === 'login' && (
        <div className="admin-container">
            {!selectedRole ? (
                // STEP 1: SELECT ROLE
                <div style={{textAlign:'center', padding:'50px 20px'}}>
                    <h2>Select Login Type</h2>
                    <div className="role-selection-container">
                        <div className="role-card" onClick={() => setSelectedRole('USER')}>
                            <span>👤</span>
                            <h3>Customer</h3>
                        </div>
                        <div className="role-card" onClick={() => setSelectedRole('ADMIN')}>
                            <span>🔐</span>
                            <h3>Admin</h3>
                        </div>
                    </div>
                </div>
            ) : (
                // STEP 2: LOGIN FORM
                <div className="admin-form" style={{maxWidth:'400px', margin:'50px auto', textAlign:'center'}}>
                    <h2 style={{marginTop:0}}>
                        {isRegistering ? "Create Account" : `${selectedRole === 'ADMIN' ? 'Admin' : 'Customer'} Login`}
                    </h2>
                    
                    <form onSubmit={handleAuth}>
                        <input className="admin-input" placeholder="Username" value={usernameInput} onChange={e => setUsernameInput(e.target.value)} required/>
                        <input className="admin-input" type="password" placeholder="Password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} required/>
                        <button type="submit" className="admin-btn">{isRegistering ? "Sign Up" : "Login"}</button>
                    </form>
                    
                    {/* Only Show Register Toggle for CUSTOMERS */}
                    {selectedRole === 'USER' && (
                        <p style={{marginTop:'15px', cursor:'pointer', color:'#666', fontSize:'0.9rem'}} onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering ? "Already have an account? Login" : "New here? Create Account"}
                        </p>
                    )}

                    <span className="back-link" onClick={() => { setSelectedRole(null); setIsRegistering(false); }}>
                        ← Back to Selection
                    </span>
                </div>
            )}
        </div>
      )}

      {/* 🔐 ADMIN DASHBOARD */}
      {view === 'admin' && userRole === 'ROLE_ADMIN' && (
        <div className="admin-container">
             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'30px'}}>
               <h2>Admin Dashboard</h2>
               <button onClick={() => setView('home')} style={{padding:'10px 20px', background:'#eee', border:'none', cursor:'pointer'}}>Back to Shop</button>
             </div>
             
             <div className="admin-form" style={{border: isEditing ? '2px solid var(--accent)' : '1px solid #eee'}}>
                <h3 style={{marginTop:0}}>{isEditing ? "Edit Product" : "Add New Product"}</h3>
                <form onSubmit={handleSaveSweet} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px'}}>
                    <input className="admin-input" placeholder="Name" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required/>
                    <input className="admin-input" placeholder="Category" value={formData.category} onChange={e=>setFormData({...formData, category:e.target.value})} required/>
                    <input className="admin-input" placeholder="Price" type="number" value={formData.price} onChange={e=>setFormData({...formData, price:e.target.value})} required/>
                    <input className="admin-input" placeholder="Qty" type="number" value={formData.quantity} onChange={e=>setFormData({...formData, quantity:e.target.value})} required/>
                    <input className="admin-input" placeholder="Image URL" value={formData.imageUrl} onChange={e=>setFormData({...formData, imageUrl:e.target.value})} style={{gridColumn:'span 2'}} />
                    <button className="admin-btn" style={{gridColumn:'span 2', background: isEditing ? 'var(--accent)' : 'var(--primary)'}}>
                      {isEditing ? "Update Item" : "Add to Inventory"}
                    </button>
                    {isEditing && <button type="button" onClick={() => {setIsEditing(false); setFormData({id:null, name:'', category:'', price:'', quantity:'', imageUrl:''})}} style={{gridColumn:'span 2', padding:'10px', background:'none', border:'none', cursor:'pointer', textDecoration:'underline'}}>Cancel</button>}
                </form>
             </div>

             <table className="admin-table">
                <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
                <tbody>{sweets.map(s => (
                  <tr key={s.id}>
                    <td><img src={s.imageUrl || DEFAULT_IMG} style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'4px'}} alt=""/></td>
                    <td>{s.name}</td><td>₹{s.price}</td><td>{s.quantity}</td>
                    <td>
                      <button onClick={() => startEdit(s)} style={{marginRight:'10px', cursor:'pointer', border:'none', background:'none'}}>Edit</button>
                      <button onClick={() => handleDelete(s.id)} style={{color:'red', cursor:'pointer', border:'none', background:'none'}}>Delete</button>
                    </td>
                  </tr>
                ))}</tbody>
             </table>
        </div>
      )}
    </>
  );
}

export default App;
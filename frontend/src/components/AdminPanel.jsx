import React, { useState, useEffect } from 'react';
import logoImg from '../assets/logo_final_white.png';
import { API_URL } from '../config.js';


const ADMIN_CREDENTIALS = { email: 'nuvera@gmail.com', password: '123456' };

const STATUS_COLORS = {
  Ordered: { bg: '#eff6ff', text: '#2563eb', dot: '#3b82f6' },
  Packed: { bg: '#fef9c3', text: '#a16207', dot: '#eab308' },
  Shipped: { bg: '#fff7ed', text: '#c2410c', dot: '#f97316' },
  'Out for Delivery': { bg: '#f0fdf4', text: '#16a34a', dot: '#22c55e' },
  Delivered: { bg: '#f0fdf4', text: '#166534', dot: '#16a34a' },
};

const BLANK_PRODUCT = {
  id: '', name: '', tag: '', type: 'creamy', tagline: '', description: '',
  rating: 4.5, reviewsCount: 0, baseWeight: '250g',
  prices: { '250g': 0, '500g': 0, '1kg': 0 },
  nutrition: { servingSize: '2 tbsp (32g)', calories: '', protein: '', totalFat: '', saturatedFat: '', carbs: '', dietaryFiber: '', sugars: '', sodium: '' },
  ingredients: [],
  reviews: [],
  image: '', color: '#E29543',
  bgGradient: 'linear-gradient(135deg, #F8E2C4 0%, #D4A36A 100%)'
};

const STATUS_STEPS_MAP = {
  'Ordered': 0,
  'Packed': 1,
  'Shipped': 2,
  'Out for Delivery': 3,
  'Delivered': 4
};

const STEPS_STATUS_MAP = {
  0: 'Ordered',
  1: 'Packed',
  2: 'Shipped',
  3: 'Out for Delivery',
  4: 'Delivered'
};

export default function AdminPanel({ products, deletedProducts = [], onAddProduct, onUpdateProduct, onDeleteProduct, onRestoreProduct, onPermanentlyDeleteProduct, onDeleteSessionOrder, onClose, sessionOrders, onLogout }) {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [orders, setOrders] = useState([]);
  // Track status overrides for session (checkout-flow) orders separately
  const [sessionOrderStatuses, setSessionOrderStatuses] = useState(() => {
    const stored = localStorage.getItem('nuvera_session_order_statuses');
    return stored ? JSON.parse(stored) : {};
  });
  const [productModal, setProductModal] = useState(null); // null | { mode:'add'|'edit', product }
  const [productForm, setProductForm] = useState(BLANK_PRODUCT);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [notification, setNotification] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch orders on load
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${API_URL}/api/orders`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const mappedOrders = data.map(o => ({
              id: o.id,
              date: o.created_at ? o.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              customer: o.name,
              email: o.email,
              total: parseFloat(o.total),
              status: STEPS_STATUS_MAP[o.statusStep] || 'Ordered',
              items: Array.isArray(o.cart) ? o.cart.map(item => ({
                name: item.name + (item.selectedWeight ? ` (${item.selectedWeight})` : ''),
                qty: item.quantity || 1,
                price: item.prices ? (item.prices[item.selectedWeight] || Object.values(item.prices)[0]) : item.price || 0
              })) : []
            }));
            setOrders(mappedOrders);
          }
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Merge session orders into admin orders list, applying any admin-set status overrides
  const allOrders = [...orders];
  Object.values(sessionOrders || {}).forEach(so => {
    if (!allOrders.find(o => o.id === so.orderId)) {
      const overrideStatus = sessionOrderStatuses[so.orderId] || 'Ordered';
      allOrders.unshift({
        id: so.orderId,
        date: so.date,
        customer: so.customer || 'Online Customer',
        email: so.email || 'customer@nuvera.com',
        total: so.total,
        status: overrideStatus,
        items: so.items?.map(i => {
          const suffix = i.selectedWeight ? ` (${i.selectedWeight})` : '';
          const name = i.name.includes('(') ? i.name : `${i.name}${suffix}`;
          return {
            name: name,
            qty: i.quantity || i.qty || 1,
            price: i.price || 0
          };
        }) || []
      });
    }
  });

  useEffect(() => {
    localStorage.setItem('nuvera_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('nuvera_session_order_statuses', JSON.stringify(sessionOrderStatuses));
  }, [sessionOrderStatuses]);

  const showNotif = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    const step = STATUS_STEPS_MAP[newStatus] ?? 0;
    const isPersistedOrder = orders.find(o => o.id === orderId);
    if (isPersistedOrder) {
      // Update in the main persisted orders list
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      try {
        await fetch(`${API_URL}/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ statusStep: step })
        });
      } catch (err) {
        console.error("Failed to update order status on backend:", err);
      }
    } else {
      // Session/checkout order — store status override separately
      setSessionOrderStatuses(prev => ({ ...prev, [orderId]: newStatus }));
    }
    showNotif(`Order ${orderId} status updated to ${newStatus}`);
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Are you sure you want to permanently delete order "${orderId}"?`)) {
      setOrders(prev => prev.filter(o => o.id !== orderId));
      onDeleteSessionOrder?.(orderId);
      showNotif(`Order "${orderId}" deleted successfully.`, 'error');
    }
  };

  const openAddProduct = () => {
    // Deep clone to prevent shared nested references (prices, nutrition) across products
    setProductForm({ ...JSON.parse(JSON.stringify(BLANK_PRODUCT)), id: 'pb-' + Date.now() });
    setIngredientsInput('');
    setProductModal({ mode: 'add' });
  };

  const openEditProduct = (prod) => {
    // Deep clone to prevent mutations to nested prices/nutrition from leaking into the source product
    setProductForm(JSON.parse(JSON.stringify(prod)));
    setIngredientsInput((prod.ingredients || []).join(', '));
    setProductModal({ mode: 'edit' });
  };

  const handleFormChange = (field, value) => {
    setProductForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePriceChange = (weight, val) => {
    setProductForm(prev => ({ ...prev, prices: { ...prev.prices, [weight]: Number(val) } }));
  };

  const handleNutritionChange = (field, val) => {
    setProductForm(prev => ({ ...prev, nutrition: { ...prev.nutrition, [field]: val } }));
  };

  // Convert uploaded file to base64 and store it in productForm.image
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showNotif('Please select a valid image file.', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showNotif('Image must be under 2 MB.', 'error');
      return;
    }
    setImageLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProductForm(prev => ({ ...prev, image: ev.target.result }));
      setImageLoading(false);
    };
    reader.onerror = () => {
      showNotif('Failed to read image file.', 'error');
      setImageLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduct = () => {
    const finalProduct = {
      ...productForm,
      ingredients: ingredientsInput.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (!finalProduct.name.trim()) { showNotif('Product name is required!', 'error'); return; }
    if (productModal.mode === 'add') {
      onAddProduct(finalProduct);
      showNotif('Product launched successfully! 🚀');
    } else {
      onUpdateProduct(finalProduct);
      showNotif('Product updated successfully! ✅');
    }
    setProductModal(null);
  };

  const handleDeleteProduct = (prod) => setDeleteConfirm(prod);

  const confirmDelete = () => {
    onDeleteProduct(deleteConfirm.id);
    showNotif(`"${deleteConfirm.name}" moved to Recycle Bin. 🗑️`, 'error');
    setDeleteConfirm(null);
  };

  // ---- Stats ----
  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = allOrders.length;
  const totalProducts = products.length;
  const pendingOrders = allOrders.filter(o => o.status === 'Ordered' || o.status === 'Packed').length;

  // ---- Admin Layout ----
  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'orders', icon: '📦', label: 'Orders', badge: pendingOrders > 0 ? pendingOrders : null },
    { id: 'products', icon: '🏪', label: 'Products' },
    { id: 'recyclebin', icon: '🗑️', label: 'Recycle Bin', badge: deletedProducts.length > 0 ? deletedProducts.length : null },
    { id: 'analytics', icon: '📈', label: 'Analytics' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#0f172a' }}>
      {/* Notification Toast */}
      {notification && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 10000, padding: '14px 20px', borderRadius: '12px', background: notification.type === 'error' ? '#7f1d1d' : '#14532d', border: `1px solid ${notification.type === 'error' ? '#ef4444' : '#22c55e'}`, color: '#f8fafc', fontSize: '14px', fontWeight: '600', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideInRight 0.3s ease' }}>
          {notification.type === 'error' ? '❌' : '✅'} {notification.msg}
        </div>
      )}

      {/* Sidebar */}
      <div style={{ width: '240px', flexShrink: 0, background: '#1e293b', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '0' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logoImg} alt="Nuvera Logo" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
            <div>
              <div style={{ color: '#f8fafc', fontWeight: '800', fontSize: '15px' }}>Nuvera Admin</div>
              <div style={{ color: '#64748b', fontSize: '11px' }}>Command Center</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveSection(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: activeSection === item.id ? 'linear-gradient(135deg, rgba(226,149,67,0.2), rgba(201,124,43,0.1))' : 'transparent', color: activeSection === item.id ? '#e29543' : '#94a3b8', fontWeight: activeSection === item.id ? '700' : '600', fontSize: '14px', textAlign: 'left', width: '100%', transition: 'all 0.2s', position: 'relative', borderLeft: activeSection === item.id ? '3px solid #e29543' : '3px solid transparent' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
              {item.badge && <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '20px' }}>{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'transparent', color: '#64748b', fontSize: '13px', fontWeight: '600', width: '100%', marginBottom: '8px' }}>
            🏪 View Store
          </button>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#f87171', fontSize: '13px', fontWeight: '600', width: '100%' }}>
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Bar */}
        <div style={{ padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#1e293b', flexShrink: 0 }}>
          <div>
            <h1 style={{ color: '#f8fafc', fontSize: '22px', fontWeight: '800', margin: 0 }}>
              {navItems.find(n => n.id === activeSection)?.icon} {navItems.find(n => n.id === activeSection)?.label}
            </h1>
            <p style={{ color: '#64748b', fontSize: '13px', margin: '2px 0 0' }}>nuvera natural Admin — {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={logoImg} alt="Nuvera Logo" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', background: '#0f172a' }}>

          {/* ====== DASHBOARD ====== */}
          {activeSection === 'dashboard' && (
            <div>
              {/* KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {[
                  { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: '💰', color: '#22c55e', bgGrad: 'rgba(34,197,94,0.1)' },
                  { label: 'Total Orders', value: totalOrders, icon: '📦', color: '#3b82f6', bgGrad: 'rgba(59,130,246,0.1)' },
                  { label: 'Products Live', value: totalProducts, icon: '🏪', color: '#e29543', bgGrad: 'rgba(226,149,67,0.1)' },
                  { label: 'Pending Orders', value: pendingOrders, icon: '⏳', color: '#f59e0b', bgGrad: 'rgba(245,158,11,0.1)' },
                ].map((card, i) => (
                  <div key={i} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '80px', height: '80px', borderRadius: '50%', background: card.bgGrad, pointerEvents: 'none' }} />
                    <div style={{ fontSize: '28px', marginBottom: '12px' }}>{card.icon}</div>
                    <div style={{ color: card.color, fontSize: '28px', fontWeight: '800', lineHeight: 1 }}>{card.value}</div>
                    <div style={{ color: '#64748b', fontSize: '13px', fontWeight: '600', marginTop: '6px' }}>{card.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: '#f8fafc', margin: '0 0 20px', fontSize: '16px', fontWeight: '700' }}>📋 Recent Orders</h3>
                  {allOrders.slice(0, 5).map(order => (
                    <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div>
                        <div style={{ color: '#f8fafc', fontWeight: '700', fontSize: '13px' }}>{order.id}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>{order.customer}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#e29543', fontWeight: '700', fontSize: '13px' }}>₹{order.total.toLocaleString('en-IN')}</div>
                        <span style={{ background: STATUS_COLORS[order.status]?.bg || '#1e293b', color: STATUS_COLORS[order.status]?.text || '#94a3b8', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px' }}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Product Summary */}
                <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: '#f8fafc', margin: '0 0 20px', fontSize: '16px', fontWeight: '700' }}>🥜 Product Catalog</h3>
                  {products.map((prod, i) => (
                    <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: prod.bgGradient || '#334155', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                        {prod.image ? (
                          <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        ) : (
                          <span style={{ fontSize: '14px' }}>🥜</span>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#f8fafc', fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</div>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>From ₹{prod.prices['250g'] !== undefined ? prod.prices['250g'] : Object.values(prod.prices)[0]}</div>
                      </div>
                      <span style={{ background: 'rgba(226,149,67,0.15)', color: '#e29543', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap' }}>{prod.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====== ORDERS ====== */}
          {activeSection === 'orders' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '18px', fontWeight: '700' }}>All Orders ({allOrders.length})</h2>
              </div>
              <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      {['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status', 'Action'].map(h => (
                        <th key={h} style={{ padding: '14px 16px', color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allOrders.map((order, i) => {
                      const sc = STATUS_COLORS[order.status] || {};
                      return (
                        <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '14px 16px', color: '#e29543', fontWeight: '700', fontSize: '13px' }}>{order.id}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ color: '#f8fafc', fontSize: '13px', fontWeight: '600' }}>{order.customer}</div>
                            <div style={{ color: '#64748b', fontSize: '11px' }}>{order.email}</div>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px' }}>{order.date}</td>
                          <td style={{ padding: '14px 16px', color: '#94a3b8', fontSize: '12px' }}>{order.items?.length || 1} item{(order.items?.length || 1) > 1 ? 's' : ''}</td>
                          <td style={{ padding: '14px 16px', color: '#22c55e', fontWeight: '700', fontSize: '13px' }}>₹{order.total.toLocaleString('en-IN')}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ background: sc.bg || '#1e293b', color: sc.text || '#94a3b8', fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: sc.dot || '#64748b', display: 'inline-block' }} />
                              {order.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <select value={order.status} onChange={e => handleOrderStatusChange(order.id, e.target.value)}
                                style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#f8fafc', borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer', outline: 'none' }}>
                                {['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                              <button onClick={() => handleDeleteOrder(order.id)}
                                style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '8px', padding: '6px 8px', color: '#f87171', cursor: 'pointer', fontSize: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', outline: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.22)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                                title="Delete Order">
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== PRODUCTS ====== */}
          {activeSection === 'products' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '18px', fontWeight: '700' }}>Product Catalog ({products.length})</h2>
                <button onClick={openAddProduct} style={{ background: 'linear-gradient(135deg, #e29543, #c97c2b)', border: 'none', borderRadius: '10px', color: '#fff', padding: '10px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(226,149,67,0.3)' }}>
                  🚀 Launch New Product
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {products.map(prod => (
                  <div key={prod.id} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', transition: 'transform 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ height: '100px', background: prod.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      {prod.image ? (
                        <img
                          src={prod.image}
                          alt={prod.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                      ) : (
                        <div style={{ width: '60px', height: '80px', background: '#fff', border: `3px solid ${prod.color}`, borderRadius: '10px 10px 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '20px' }}>🥜</span>
                        </div>
                      )}
                      <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px' }}>{prod.tag}</span>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <h3 style={{ color: '#f8fafc', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }}>{prod.name}</h3>
                      <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 12px', lineHeight: '1.4' }}>{prod.tagline}</p>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                        {Object.entries(prod.prices || {}).map(([w, p]) => (
                          <span key={w} style={{ background: 'rgba(226,149,67,0.12)', color: '#e29543', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>{w}: ₹{p}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openEditProduct(prod)} style={{ flex: 1, padding: '8px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '8px', color: '#60a5fa', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>✏️ Edit</button>
                        <button onClick={() => handleDeleteProduct(prod)} style={{ flex: 1, padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== RECYCLE BIN ====== */}
          {activeSection === 'recyclebin' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '18px', fontWeight: '700' }}>Recycle Bin ({deletedProducts.length})</h2>
                {deletedProducts.length > 0 && (
                  <button onClick={() => {
                    if (window.confirm("Are you sure you want to empty the Recycle Bin permanently?")) {
                      deletedProducts.forEach(prod => onPermanentlyDeleteProduct(prod.id));
                      showNotif("Recycle Bin emptied successfully.", "error");
                    }
                  }} style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171', padding: '10px 20px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🗑️ Empty Recycle Bin
                  </button>
                )}
              </div>

              {deletedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 24px', background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
                  <h3 style={{ color: '#f8fafc', margin: '0 0 8px', fontSize: '18px', fontWeight: '700' }}>Recycle Bin is Empty</h3>
                  <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Deleted products will appear here. You can restore or permanently delete them.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {deletedProducts.map(prod => (
                    <div key={prod.id} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden', opacity: 0.85 }}
                      onMouseEnter={e => e.currentTarget.style.opacity = 1}
                      onMouseLeave={e => e.currentTarget.style.opacity = 0.85}>
                      <div style={{ height: '100px', background: prod.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
                          <div style={{ width: '60px', height: '80px', background: '#fff', border: `3px solid ${prod.color}`, borderRadius: '10px 10px 14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '20px' }}>🥜</span>
                          </div>
                        )}
                        <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.4)', color: '#fff', fontSize: '10px', fontWeight: '700', padding: '3px 8px', borderRadius: '20px' }}>{prod.tag}</span>
                      </div>
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ color: '#f8fafc', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }}>{prod.name}</h3>
                        <p style={{ color: '#64748b', fontSize: '12px', margin: '0 0 12px', lineHeight: '1.4' }}>{prod.tagline}</p>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                          {Object.entries(prod.prices || {}).map(([w, p]) => (
                            <span key={w} style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '6px' }}>{w}: ₹{p}</span>
                          ))}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => {
                            onRestoreProduct(prod.id);
                            showNotif(`"${prod.name}" restored successfully! 🔄`);
                          }} style={{ flex: 1, padding: '8px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#4ade80', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>🔄 Restore</button>
                          <button onClick={() => {
                            if (window.confirm(`Are you sure you want to permanently delete "${prod.name}"? This cannot be undone.`)) {
                              onPermanentlyDeleteProduct(prod.id);
                              showNotif(`"${prod.name}" permanently deleted.`, 'error');
                            }
                          }} style={{ flex: 1, padding: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', color: '#f87171', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>🗑️ Permanent</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====== ANALYTICS ====== */}
          {activeSection === 'analytics' && (
            <div>
              <h2 style={{ color: '#f8fafc', margin: '0 0 24px', fontSize: '18px', fontWeight: '700' }}>Revenue & Performance Analytics</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
                <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: '#f8fafc', margin: '0 0 20px', fontSize: '15px', fontWeight: '700' }}>📊 Order Status Distribution</h3>
                  {['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].map(status => {
                    const count = allOrders.filter(o => o.status === status).length;
                    const pct = allOrders.length > 0 ? (count / allOrders.length) * 100 : 0;
                    const sc = STATUS_COLORS[status] || {};
                    return (
                      <div key={status} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600' }}>{status}</span>
                          <span style={{ color: '#f8fafc', fontSize: '12px', fontWeight: '700' }}>{count} orders</span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: sc.dot || '#64748b', borderRadius: '3px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ color: '#f8fafc', margin: '0 0 20px', fontSize: '15px', fontWeight: '700' }}>🏆 Top Products by Revenue</h3>
                  {products.slice(0, 5).map((prod, i) => {
                    const revenue = allOrders.reduce((sum, o) => {
                      const match = o.items?.find(item => item.name?.includes(prod.name.split(' ')[0]));
                      return sum + (match ? match.price * match.qty : 0);
                    }, 0);
                    return (
                      <div key={prod.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <span style={{ color: '#e29543', fontWeight: '800', fontSize: '14px', width: '20px' }}>#{i + 1}</span>
                        <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: prod.bgGradient || '#334155', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {prod.image ? (
                            <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                          ) : (
                            <span style={{ fontSize: '12px' }}>🥜</span>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ color: '#f8fafc', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prod.name}</div>
                        </div>
                        <span style={{ color: '#22c55e', fontWeight: '700', fontSize: '12px' }}>₹{prod.prices['250g'] !== undefined ? prod.prices['250g'] : Object.values(prod.prices)[0]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {[
                  { label: 'Avg Order Value', value: `₹${Math.round(totalRevenue / Math.max(totalOrders, 1)).toLocaleString('en-IN')}`, icon: '📐' },
                  { label: 'Delivered Orders', value: allOrders.filter(o => o.status === 'Delivered').length, icon: '✅' },
                  { label: 'Active Products', value: products.length, icon: '🛍️' },
                ].map((stat, i) => (
                  <div key={i} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ color: '#e29543', fontSize: '28px', fontWeight: '800' }}>{stat.value}</div>
                    <div style={{ color: '#64748b', fontSize: '13px', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== Product Modal (Add/Edit) ===== */}
      {productModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h2 style={{ color: '#f8fafc', margin: 0, fontSize: '18px', fontWeight: '800' }}>
                {productModal.mode === 'add' ? '🚀 Launch New Product' : '✏️ Edit Product'}
              </h2>
              <button onClick={() => setProductModal(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#94a3b8', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', padding: '28px', flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* ===== IMAGE UPLOAD SECTION ===== */}
                <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '20px' }}>
                  <label style={{ ...labelStyle, marginBottom: '14px', fontSize: '12px' }}>🖼️ Product Image</label>

                  <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                    {/* Preview */}
                    <div style={{
                      width: '120px', height: '120px', flexShrink: 0,
                      borderRadius: '12px',
                      background: productForm.image ? 'transparent' : 'rgba(255,255,255,0.06)',
                      border: '2px dashed rgba(226,149,67,0.4)',
                      overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      position: 'relative'
                    }}>
                      {imageLoading ? (
                        <span style={{ fontSize: '24px', animation: 'spin 1s linear infinite' }}>⏳</span>
                      ) : productForm.image ? (
                        <img
                          src={productForm.image}
                          alt="Product preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          onError={() => handleFormChange('image', '')}
                        />
                      ) : (
                        <div style={{ textAlign: 'center', color: '#475569' }}>
                          <div style={{ fontSize: '32px', marginBottom: '4px' }}>🖼️</div>
                          <div style={{ fontSize: '10px', fontWeight: '600' }}>No image</div>
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {/* File Upload Button */}
                      <div>
                        <label
                          htmlFor="product-image-upload"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '9px 18px',
                            background: 'linear-gradient(135deg, #e29543, #c97c2b)',
                            border: 'none', borderRadius: '8px',
                            color: '#fff', fontSize: '13px', fontWeight: '700',
                            cursor: 'pointer', userSelect: 'none',
                            boxShadow: '0 4px 12px rgba(226,149,67,0.3)'
                          }}
                        >
                          📁 Upload Image
                        </label>
                        <input
                          id="product-image-upload"
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handleImageUpload}
                        />
                        <span style={{ color: '#475569', fontSize: '11px', marginLeft: '10px' }}>Max 2 MB · JPG, PNG, WEBP</span>
                      </div>

                      {/* Clear image */}
                      {productForm.image && (
                        <button
                          type="button"
                          onClick={() => handleFormChange('image', '')}
                          style={{
                            alignSelf: 'flex-start',
                            padding: '6px 14px',
                            background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.25)',
                            borderRadius: '7px',
                            color: '#f87171', fontSize: '12px', fontWeight: '700', cursor: 'pointer'
                          }}
                        >
                          🗑️ Remove Image
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Name */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Product Name *</label>
                  <input value={productForm.name} onChange={e => handleFormChange('name', e.target.value)} style={inputStyle} placeholder="e.g. Classic Creamy Peanut Butter" />
                </div>
                {/* Tag */}
                <div>
                  <label style={labelStyle}>Badge / Tag</label>
                  <input value={productForm.tag} onChange={e => handleFormChange('tag', e.target.value)} style={inputStyle} placeholder="e.g. Best Seller" />
                </div>
                {/* Type */}
                <div>
                  <label style={labelStyle}>Product Type</label>
                  <select value={productForm.type} onChange={e => handleFormChange('type', e.target.value)} style={{ ...inputStyle, colorScheme: 'dark', backgroundColor: '#1e293b' }}>
                    {['creamy', 'crunchy', 'chocolate', 'smoothy', 'high-protein', 'sugar-free'].map(t => <option key={t} value={t} style={{ background: '#1e293b', color: '#f8fafc' }}>{t}</option>)}
                  </select>
                </div>
                {/* Tagline */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Short Tagline</label>
                  <input value={productForm.tagline} onChange={e => handleFormChange('tagline', e.target.value)} style={inputStyle} placeholder="Catchy one-liner for the product card" />
                </div>
                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Full Description</label>
                  <textarea value={productForm.description} onChange={e => handleFormChange('description', e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Detailed product description..." />
                </div>
                {/* Prices */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Prices (₹)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {['250g', '500g', '1kg'].map(w => (
                      <div key={w}>
                        <label style={{ ...labelStyle, fontSize: '10px', marginBottom: '4px' }}>{w}</label>
                        {/* Use !== undefined check so a price of 0 shows as "0" not empty string */}
                        <input type="number" value={productForm.prices[w] !== undefined ? productForm.prices[w] : ''} onChange={e => handlePriceChange(w, e.target.value)} style={inputStyle} placeholder="0" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <label style={labelStyle}>Rating (0-5)</label>
                  <input type="number" min="0" max="5" step="0.1" value={productForm.rating} onChange={e => handleFormChange('rating', parseFloat(e.target.value))} style={inputStyle} />
                </div>
                {/* Ingredients */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={labelStyle}>Ingredients (comma-separated)</label>
                  <textarea value={ingredientsInput} onChange={e => setIngredientsInput(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="100% Organic Peanuts, Pink Himalayan Salt, ..." />
                </div>

                {/* Nutrition */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ ...labelStyle, fontSize: '13px', marginBottom: '12px' }}>🧬 Nutrition Facts (per serving)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {[['calories', 'Calories'], ['protein', 'Protein'], ['totalFat', 'Total Fat'], ['carbs', 'Carbs'], ['dietaryFiber', 'Fiber'], ['sugars', 'Sugars'], ['saturatedFat', 'Sat. Fat'], ['sodium', 'Sodium']].map(([field, lbl]) => (
                      <div key={field}>
                        <label style={{ ...labelStyle, fontSize: '10px', marginBottom: '4px' }}>{lbl}</label>
                        <input value={productForm.nutrition?.[field] || ''} onChange={e => handleNutritionChange(field, e.target.value)} style={inputStyle} placeholder={lbl} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: '12px', justifyContent: 'flex-end', flexShrink: 0 }}>
              <button onClick={() => setProductModal(null)} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSaveProduct} style={{ padding: '10px 28px', background: 'linear-gradient(135deg, #e29543, #c97c2b)', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 14px rgba(226,149,67,0.3)' }}>
                {productModal.mode === 'add' ? '🚀 Launch Product' : '✅ Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirm Modal ===== */}
      {deleteConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 10001, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1e293b', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '32px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 32px 80px rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
            <h3 style={{ color: '#f8fafc', fontWeight: '800', fontSize: '20px', margin: '0 0 8px' }}>Delete Product?</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px', lineHeight: '1.5' }}>
              Are you sure you want to remove <strong style={{ color: '#f8fafc' }}>"{deleteConfirm.name}"</strong> from the catalog? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94a3b8', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              <button onClick={confirmDelete} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #dc2626, #b91c1c)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '800', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 14px rgba(220,38,38,0.3)' }}>🗑️ Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '10px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px', color: '#f8fafc', fontSize: '13px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
};
const labelStyle = {
  display: 'block', color: '#64748b', fontSize: '11px', fontWeight: '700',
  textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px'
};

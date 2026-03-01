import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config';
import { formatLKR } from '../config/currency';

// ─── helpers ────────────────────────────────────────────
const fmt = (d) =>
  d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

const fmtFull = (d) =>
  d ? new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

const statusClass = (s) => {
  const m = { pending:'status-pending', confirmed:'status-confirmed', preparing:'status-preparing',
    ready:'status-ready', delivered:'status-delivered', completed:'status-completed',
    cancelled:'status-cancelled', rejected:'status-rejected' };
  return m[s] || 'bg-secondary';
};

// ─── Sub-components ─────────────────────────────────────

const StatCard = ({ label, value, icon, iconCls, sub }) => (
  <div className="stat-card">
    <div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value" style={typeof value === 'string' && value.length > 8 ? {fontSize:'1.3rem'} : {}}>{value}</div>
      {sub && <div style={{fontSize:'0.75rem',color:'var(--text-soft)',marginTop:'0.2rem'}}>{sub}</div>}
    </div>
    <div className={`stat-card-icon ${iconCls}`}><i className={`bi ${icon}`}></i></div>
  </div>
);

// ─── TABS ────────────────────────────────────────────────

const OverviewTab = ({ token }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_CONFIG.ADMIN.STATS, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="loading-screen" style={{height:'300px'}}><div className="spinner-gradient"></div></div>;
  if (!stats) return <p className="text-muted">Could not load stats.</p>;

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const maxRev = Math.max(...(stats.monthly || []).map(m => m.revenue), 1);

  return (
    <div>
      {/* Top stats */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3"><StatCard label="Total Orders" value={stats.orders.total} icon="bi-bag" iconCls="stat-icon-rose" /></div>
        <div className="col-6 col-md-3"><StatCard label="Total Revenue" value={formatLKR(stats.revenue.total)} icon="bi-currency-rupee" iconCls="stat-icon-green" /></div>
        <div className="col-6 col-md-3"><StatCard label="Total Users" value={stats.users.total} icon="bi-people" iconCls="stat-icon-blue" sub={`${stats.users.customers} customers · ${stats.users.shopOwners} owners`} /></div>
        <div className="col-6 col-md-3"><StatCard label="Shops" value={stats.shops.total} icon="bi-shop" iconCls="stat-icon-gold" sub={`${stats.shops.verified} verified · ${stats.shops.pending} pending`} /></div>
      </div>

      <div className="row g-4 mb-4">
        {/* Order breakdown */}
        <div className="col-md-4">
          <div className="content-card h-100">
            <div className="content-card-header"><h6 className="content-card-title">Orders by Status</h6></div>
            <div className="content-card-body">
              {Object.entries(stats.orders.byStatus || {}).map(([status, count]) => (
                <div key={status} className="d-flex justify-content-between align-items-center mb-3">
                  <span className={`badge ${statusClass(status)}`} style={{fontSize:'0.8rem',padding:'0.4em 0.8em'}}>{status}</span>
                  <div className="d-flex align-items-center gap-2" style={{flex:1, marginLeft:'0.75rem'}}>
                    <div style={{flex:1,height:'6px',background:'var(--linen)',borderRadius:'3px',overflow:'hidden'}}>
                      <div style={{width:`${(count/stats.orders.total)*100}%`,height:'100%',background:'var(--grad-rose)',borderRadius:'3px'}}></div>
                    </div>
                    <strong style={{minWidth:'28px',textAlign:'right',fontSize:'0.88rem'}}>{count}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue chart */}
        <div className="col-md-8">
          <div className="content-card h-100">
            <div className="content-card-header"><h6 className="content-card-title">Revenue — Last 6 Months</h6></div>
            <div className="content-card-body">
              {stats.monthly && stats.monthly.length > 0 ? (
                <div style={{display:'flex',alignItems:'flex-end',gap:'8px',height:'160px',paddingBottom:'24px',position:'relative'}}>
                  {stats.monthly.map((m, i) => (
                    <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:'4px',height:'100%',justifyContent:'flex-end'}}>
                      <span style={{fontSize:'0.68rem',color:'var(--text-soft)'}}>{formatLKR(m.revenue).replace('LKR ','')}</span>
                      <div style={{width:'100%',background:'var(--grad-rose)',borderRadius:'6px 6px 0 0',height:`${(m.revenue/maxRev)*120}px`,minHeight:'4px',transition:'height 0.5s ease'}} title={`${m.orders} orders`}></div>
                      <span style={{fontSize:'0.7rem',color:'var(--text-soft)',position:'absolute',bottom:0}}>{monthNames[(m._id.month-1)]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted text-center py-4">No revenue data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="content-card">
        <div className="content-card-header"><h6 className="content-card-title">Recent Orders (Platform-wide)</h6></div>
        <div style={{overflowX:'auto'}}>
          <table className="table mb-0">
            <thead><tr><th>Order ID</th><th>Customer</th><th>Shop</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {(stats.recentOrders || []).map(o => (
                <tr key={o._id}>
                  <td><strong>#{o.orderId?.slice(-6)}</strong></td>
                  <td>{o.user?.name || o.customerName}</td>
                  <td><span className="shop-badge">{o.shop?.shopName || '—'}</span></td>
                  <td><strong style={{color:'var(--rg-primary)'}}>{formatLKR(o.totalPrice)}</strong></td>
                  <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                  <td><small style={{color:'var(--text-soft)'}}>{fmt(o.createdAt)}</small></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const ShopsTab = ({ token }) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [actionMsg, setActionMsg] = useState('');

  const fetchShops = useCallback(() => {
    setLoading(true);
    const url = filter === 'pending' ? `${API_CONFIG.ADMIN.SHOPS}?verified=false`
              : filter === 'verified' ? `${API_CONFIG.ADMIN.SHOPS}?verified=true`
              : API_CONFIG.ADMIN.SHOPS;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setShops(d.shops); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, filter]);

  useEffect(() => { fetchShops(); }, [fetchShops]);

  const showMsg = (msg) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000); };

  const verifyShop = async (shopId) => {
    const r = await fetch(API_CONFIG.ADMIN.SHOP_VERIFY(shopId), { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (d.success) { showMsg('✅ Shop verified and activated!'); fetchShops(); }
  };

  const toggleShop = async (shopId, isActive) => {
    const r = await fetch(API_CONFIG.ADMIN.SHOP_TOGGLE(shopId), { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (d.success) { showMsg(isActive ? '⛔ Shop suspended' : '✅ Shop reactivated'); fetchShops(); }
  };

  return (
    <div>
      {actionMsg && (
        <div className="alert alert-info mb-3" style={{animation:'fadeUp 0.3s ease'}}>{actionMsg}</div>
      )}
      <div className="content-card mb-3">
        <div className="content-card-body" style={{padding:'0.75rem 1.25rem'}}>
          <div className="filter-tabs">
            {['all','verified','pending'].map(f => (
              <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)} Shops
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{height:'200px'}}><div className="spinner-gradient"></div></div> : (
        <div className="content-card">
          <div style={{overflowX:'auto'}}>
            <table className="table mb-0">
              <thead><tr><th>Shop</th><th>Owner</th><th>Location</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {shops.length > 0 ? shops.map(shop => (
                  <tr key={shop._id}>
                    <td>
                      <div style={{fontWeight:700,color:'var(--text-dark)'}}>{shop.shopName}</div>
                      <small style={{color:'var(--text-soft)'}}>/{shop.shopSlug}</small>
                    </td>
                    <td>
                      <div style={{fontSize:'0.88rem'}}>{shop.owner?.name || '—'}</div>
                      <small style={{color:'var(--text-soft)'}}>{shop.owner?.email}</small>
                    </td>
                    <td><small>{shop.address?.city || '—'}</small></td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        <span className="badge" style={{background: shop.isVerified ? '#D4EDDA' : '#FFF3CD', color: shop.isVerified ? '#155724' : '#856404', width:'fit-content'}}>
                          {shop.isVerified ? '✓ Verified' : '⏳ Pending'}
                        </span>
                        <span className="badge" style={{background: shop.isActive ? '#D4EDDA' : '#F8D7DA', color: shop.isActive ? '#155724' : '#721C24', width:'fit-content'}}>
                          {shop.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </div>
                    </td>
                    <td><small style={{color:'var(--text-soft)'}}>{fmt(shop.createdAt)}</small></td>
                    <td>
                      <div className="d-flex gap-1">
                        {!shop.isVerified && (
                          <button className="btn btn-sm" style={{background:'#D4EDDA',color:'#155724',border:'none',borderRadius:'var(--radius-sm)',padding:'4px 10px',fontSize:'0.78rem',fontWeight:600,cursor:'pointer'}}
                            onClick={() => verifyShop(shop._id)}>
                            <i className="bi bi-patch-check me-1"></i>Verify
                          </button>
                        )}
                        <button className="btn btn-sm" style={{background: shop.isActive ? '#FFF3CD' : '#D4EDDA', color: shop.isActive ? '#856404' : '#155724', border:'none', borderRadius:'var(--radius-sm)', padding:'4px 10px', fontSize:'0.78rem', fontWeight:600, cursor:'pointer'}}
                          onClick={() => toggleShop(shop._id, shop.isActive)}>
                          <i className={`bi ${shop.isActive ? 'bi-pause-circle' : 'bi-play-circle'} me-1`}></i>
                          {shop.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center py-4" style={{color:'var(--text-soft)'}}>No shops found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const UsersTab = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const url = filter === 'all' ? API_CONFIG.ADMIN.USERS : `${API_CONFIG.ADMIN.USERS}?role=${filter}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setUsers(d.users); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, filter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const showMsg = (msg) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000); };

  const toggleUser = async (userId, isActive) => {
    const r = await fetch(API_CONFIG.ADMIN.USER_TOGGLE(userId), { method: 'PATCH', headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (d.success) { showMsg(isActive ? '⛔ User deactivated' : '✅ User activated'); fetchUsers(); }
    else showMsg(`❌ ${d.message}`);
  };

  const roleLabel = (role) => {
    const map = { customer: { label:'Customer', bg:'#E3F2FD', color:'#1565C0' }, shop_owner: { label:'Shop Owner', bg:'var(--gold-pale)', color:'var(--gold-rich)' }, super_admin: { label:'Super Admin', bg:'var(--rg-blush)', color:'var(--rg-deep)' } };
    return map[role] || { label: role, bg: '#eee', color: '#333' };
  };

  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {actionMsg && <div className="alert alert-info mb-3" style={{animation:'fadeUp 0.3s ease'}}>{actionMsg}</div>}
      <div className="content-card mb-3">
        <div className="content-card-body" style={{padding:'0.75rem 1.25rem',display:'flex',gap:'1rem',flexWrap:'wrap',alignItems:'center'}}>
          <div className="filter-tabs" style={{flex:1}}>
            {['all','customer','shop_owner','super_admin'].map(f => (
              <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'shop_owner' ? 'Shop Owners' : f === 'super_admin' ? 'Admins' : 'Customers'}
              </button>
            ))}
          </div>
          <div style={{position:'relative',minWidth:'220px'}}>
            <i className="bi bi-search" style={{position:'absolute',left:'0.7rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-soft)',fontSize:'0.85rem'}}></i>
            <input className="form-control" style={{paddingLeft:'2rem',fontSize:'0.87rem'}} placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{height:'200px'}}><div className="spinner-gradient"></div></div> : (
        <div className="content-card">
          <div style={{overflowX:'auto'}}>
            <table className="table mb-0">
              <thead><tr><th>User</th><th>Phone</th><th>Role</th><th>Status</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(u => {
                  const rl = roleLabel(u.role);
                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{display:'flex',alignItems:'center',gap:'0.6rem'}}>
                          <div style={{width:32,height:32,background:'var(--grad-rose)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontWeight:700,fontSize:'0.85rem',flexShrink:0}}>
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div>
                            <div style={{fontWeight:600,color:'var(--text-dark)',fontSize:'0.9rem'}}>{u.name}</div>
                            <small style={{color:'var(--text-soft)'}}>{u.email}</small>
                          </div>
                        </div>
                      </td>
                      <td><small>{u.phone || '—'}</small></td>
                      <td><span className="badge" style={{background:rl.bg,color:rl.color,fontWeight:600}}>{rl.label}</span></td>
                      <td>
                        <span className="badge" style={{background: u.isActive ? '#D4EDDA' : '#F8D7DA', color: u.isActive ? '#155724' : '#721C24'}}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td><small style={{color:'var(--text-soft)'}}>{fmt(u.createdAt)}</small></td>
                      <td>
                        {u.role !== 'super_admin' && (
                          <button className="btn btn-sm"
                            style={{background: u.isActive ? '#FFF3CD' : '#D4EDDA', color: u.isActive ? '#856404' : '#155724', border:'none', borderRadius:'var(--radius-sm)', padding:'4px 10px', fontSize:'0.78rem', fontWeight:600, cursor:'pointer'}}
                            onClick={() => toggleUser(u._id, u.isActive)}>
                            <i className={`bi ${u.isActive ? 'bi-person-x' : 'bi-person-check'} me-1`}></i>
                            {u.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr><td colSpan="6" className="text-center py-4" style={{color:'var(--text-soft)'}}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersTab = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchOrders = useCallback(() => {
    setLoading(true);
    const url = filter === 'all' ? API_CONFIG.ADMIN.ORDERS : `${API_CONFIG.ADMIN.ORDERS}?status=${filter}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setOrders(d.orders); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token, filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateStatus = async (orderId, status) => {
    const r = await fetch(API_CONFIG.ADMIN.ORDER_STATUS(orderId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    const d = await r.json();
    if (d.success) fetchOrders();
  };

  const exportCSV = () => {
    const rows = [['Order ID','Customer','Shop','Total','Status','Date'],
      ...filtered.map(o => [o.orderId, o.user?.name || o.customerName, o.shop?.shopName || '', o.totalPrice, o.status, fmtFull(o.createdAt)])];
    const csv = rows.map(r => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'}));
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const filtered = orders.filter(o =>
    !search ||
    o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
    (o.user?.name || o.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
    o.shop?.shopName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="content-card mb-3">
        <div className="content-card-body" style={{padding:'0.75rem 1.25rem',display:'flex',gap:'1rem',flexWrap:'wrap',alignItems:'center'}}>
          <div className="filter-tabs" style={{flex:1}}>
            {['all','pending','confirmed','preparing','ready','completed','cancelled'].map(f => (
              <button key={f} className={`filter-tab ${filter===f?'active':''}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <div style={{position:'relative'}}>
              <i className="bi bi-search" style={{position:'absolute',left:'0.7rem',top:'50%',transform:'translateY(-50%)',color:'var(--text-soft)',fontSize:'0.85rem'}}></i>
              <input className="form-control" style={{paddingLeft:'2rem',fontSize:'0.87rem',width:'200px'}} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn-outline-rose" style={{padding:'0.4rem 0.9rem',fontSize:'0.82rem',whiteSpace:'nowrap'}} onClick={exportCSV} disabled={filtered.length===0}>
              <i className="bi bi-download me-1"></i>Export CSV
            </button>
          </div>
        </div>
      </div>

      {loading ? <div className="loading-screen" style={{height:'200px'}}><div className="spinner-gradient"></div></div> : (
        <div className="content-card">
          <div style={{overflowX:'auto'}}>
            <table className="table mb-0">
              <thead><tr><th>Order ID</th><th>Customer</th><th>Shop</th><th>Total</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {filtered.length > 0 ? filtered.map(o => (
                  <tr key={o._id}>
                    <td><strong>#{o.orderId?.slice(-6) || o.orderId}</strong></td>
                    <td>
                      <div style={{fontWeight:600,color:'var(--text-dark)',fontSize:'0.88rem'}}>{o.user?.name || o.customerName}</div>
                      <small style={{color:'var(--text-soft)'}}>{o.user?.email || o.customerEmail}</small>
                    </td>
                    <td><span className="shop-badge">{o.shop?.shopName || '—'}</span></td>
                    <td><strong style={{color:'var(--rg-primary)'}}>{formatLKR(o.totalPrice)}</strong></td>
                    <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
                    <td><small style={{color:'var(--text-soft)'}}>{fmtFull(o.createdAt)}</small></td>
                    <td>
                      <select className="status-select form-select form-select-sm" value={o.status}
                        onChange={e => updateStatus(o.orderId, e.target.value)}>
                        {['pending','confirmed','preparing','ready','out_for_delivery','delivered','completed','cancelled'].map(s =>
                          <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-4" style={{color:'var(--text-soft)'}}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const CakesTab = ({ token }) => {
  const [cakes, setCakes] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCake, setEditingCake] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '', description: '', priceLKR: '', category: 'Birthday',
    image: '', isAvailable: true, isPopular: false, shopId: ''
  });

  const categories = ['Birthday', 'Wedding', 'Anniversary', 'Special', 'Custom', 'Kids'];

  const fetchCakes = useCallback(() => {
    setLoading(true);
    fetch(API_CONFIG.PUBLIC.CAKES + '?limit=100')
      .then(r => r.json())
      .then(d => { if (d.success) setCakes(d.cakes); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchCakes();
    // Fetch shops for dropdown
    fetch(API_CONFIG.ADMIN.SHOPS, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { if (d.success) setShops(d.shops.filter(s => s.isVerified)); })
      .catch(console.error);
  }, [fetchCakes, token]);

  const showMsg = (msg) => { setActionMsg(msg); setTimeout(() => setActionMsg(''), 3000); };

  const resetForm = () => {
    setEditingCake(null);
    setFormData({ name:'', description:'', priceLKR:'', category:'Birthday', image:'', isAvailable:true, isPopular:false, shopId:'' });
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopId) { showMsg('❌ Please select a shop'); return; }
    setSaving(true);
    const url = editingCake
      ? API_CONFIG.ADMIN.CAKE(editingCake._id)
      : API_CONFIG.ADMIN.CAKES;
    const method = editingCake ? 'PUT' : 'POST';
    try {
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, priceLKR: parseFloat(formData.priceLKR) })
      });
      const d = await r.json();
      if (d.success) {
        setShowModal(false);
        resetForm();
        fetchCakes();
        showMsg(editingCake ? '✅ Cake updated!' : '✅ Cake added successfully!');
      } else {
        showMsg(`❌ ${d.message}`);
      }
    } catch (err) { showMsg('❌ Error saving cake'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (cakeId) => {
    if (!window.confirm('Delete this cake?')) return;
    const r = await fetch(API_CONFIG.ADMIN.CAKE(cakeId), {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
    });
    const d = await r.json();
    if (d.success) { fetchCakes(); showMsg('✅ Cake deleted'); }
    else showMsg(`❌ ${d.message}`);
  };

  const handleEdit = (cake) => {
    setEditingCake(cake);
    setFormData({
      name: cake.name, description: cake.description, priceLKR: cake.priceLKR,
      category: cake.category, image: cake.image || '',
      isAvailable: cake.isAvailable, isPopular: cake.isPopular || false,
      shopId: cake.shop?._id || cake.shop || ''
    });
    setImagePreview(cake.image || '');
    setShowModal(true);
  };

  return (
    <div>
      {actionMsg && <div className="alert alert-info mb-3">{actionMsg}</div>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <strong style={{color:'var(--text-dark)'}}>All Shop Cakes</strong>
          <small style={{color:'var(--text-soft)',marginLeft:'0.5rem'}}>({cakes.length} total)</small>
        </div>
        <button className="btn-rose" onClick={() => { resetForm(); setShowModal(true); }}>
          <i className="bi bi-plus-circle me-1"></i> Add Cake
        </button>
      </div>

      {loading ? <div className="loading-screen" style={{height:'200px'}}><div className="spinner-gradient"></div></div> : (
        <div className="row g-3">
          {cakes.length > 0 ? cakes.map(cake => (
            <div className="col-md-6 col-lg-4" key={cake._id}>
              <div className="content-card h-100" style={{padding:0,overflow:'hidden'}}>
                <div style={{height:'160px',overflow:'hidden',position:'relative'}}>
                  <img src={cake.image || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop'}
                    alt={cake.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
                  <div style={{position:'absolute',top:'8px',right:'8px',display:'flex',gap:'4px'}}>
                    {cake.isPopular && <span className="badge" style={{background:'var(--gold-mid)',color:'var(--text-dark)',fontSize:'0.7rem'}}>⭐ Popular</span>}
                    <span className="badge" style={{background: cake.isAvailable ? '#D4EDDA' : '#F8D7DA', color: cake.isAvailable ? '#155724' : '#721C24', fontSize:'0.7rem'}}>
                      {cake.isAvailable ? 'Live' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <div style={{padding:'1rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'0.25rem'}}>
                    <strong style={{color:'var(--text-dark)',fontSize:'0.95rem'}}>{cake.name}</strong>
                    <strong style={{color:'var(--rg-primary)',fontSize:'0.9rem',whiteSpace:'nowrap',marginLeft:'8px'}}>{formatLKR(cake.priceLKR)}</strong>
                  </div>
                  <small style={{color:'var(--text-soft)'}}><i className="bi bi-shop me-1"></i>{cake.shopName}</small>
                  <p style={{fontSize:'0.8rem',color:'var(--text-soft)',margin:'0.5rem 0',lineHeight:1.4}}>
                    {cake.description?.length > 70 ? cake.description.substring(0,70)+'…' : cake.description}
                  </p>
                  <div style={{display:'flex',gap:'6px',marginTop:'0.75rem'}}>
                    <button className="btn btn-sm" style={{background:'var(--rg-blush)',color:'var(--rg-primary)',border:'none',borderRadius:'var(--radius-sm)',padding:'4px 10px',fontSize:'0.78rem'}} onClick={() => handleEdit(cake)}>
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button className="btn btn-sm" style={{background:'#fde8e8',color:'#c0392b',border:'none',borderRadius:'var(--radius-sm)',padding:'4px 10px',fontSize:'0.78rem'}} onClick={() => handleDelete(cake._id)}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-12 text-center py-5">
              <div style={{fontSize:'3rem',opacity:0.2}}>🎂</div>
              <p className="text-muted mt-2">No cakes added yet. Click "Add Cake" to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Cake Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(61,38,38,0.4)', backdropFilter:'blur(4px)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className={`bi ${editingCake ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`} style={{color:'var(--rg-primary)'}}></i>
                  {editingCake ? 'Edit Cake' : 'Add New Cake (Admin)'}
                </h5>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{padding:'1.5rem'}}>
                  <div className="row g-3">
                    <div className="col-md-5">
                      <div style={{background:'var(--rg-pale)',borderRadius:'var(--radius-md)',overflow:'hidden',marginBottom:'0.75rem',height:'160px',display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" style={{width:'100%',height:'100%',objectFit:'cover'}} onError={() => setImagePreview('')} />
                        ) : (
                          <div style={{textAlign:'center',color:'var(--text-soft)'}}>
                            <i className="bi bi-image" style={{fontSize:'2rem',opacity:0.3}}></i>
                            <p style={{fontSize:'0.75rem',marginTop:'0.4rem'}}>Image preview</p>
                          </div>
                        )}
                      </div>
                      <div className="mb-2">
                        <label className="form-label" style={{fontSize:'0.83rem'}}>Image URL</label>
                        <input type="text" className="form-control" value={formData.image}
                          onChange={e => { setFormData({...formData, image: e.target.value}); setImagePreview(e.target.value); }}
                          placeholder="https://example.com/cake.jpg" />
                      </div>
                      <div className="mb-2">
                        <label className="form-label" style={{fontSize:'0.83rem'}}>Category</label>
                        <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="form-label" style={{fontSize:'0.83rem'}}>Assign to Shop *</label>
                        <select className="form-select" value={formData.shopId} onChange={e => setFormData({...formData, shopId: e.target.value})} required>
                          <option value="">— Select a verified shop —</option>
                          {shops.map(s => <option key={s._id} value={s._id}>{s.shopName}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-7">
                      <div className="mb-3">
                        <label className="form-label">Cake Name *</label>
                        <input type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Royal Chocolate Cake" required />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Price (LKR) *</label>
                        <input type="number" className="form-control" value={formData.priceLKR} onChange={e => setFormData({...formData, priceLKR: e.target.value})} placeholder="3500" required min="0" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description *</label>
                        <textarea className="form-control" rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the cake..." required />
                      </div>
                      <div className="d-flex gap-3">
                        <div style={{background:'var(--cream-warm)',borderRadius:'var(--radius-sm)',padding:'0.6rem 1rem',flex:1,border:'1.5px solid var(--cream-deep)'}}>
                          <div className="form-check mb-0">
                            <input type="checkbox" className="form-check-input" id="adminIsAvailable" checked={formData.isAvailable} onChange={e => setFormData({...formData, isAvailable: e.target.checked})} />
                            <label className="form-check-label" htmlFor="adminIsAvailable" style={{fontWeight:600,fontSize:'0.83rem'}}>
                              <i className="bi bi-eye me-1" style={{color:'var(--rg-primary)'}}></i>Available
                            </label>
                          </div>
                        </div>
                        <div style={{background:'var(--cream-warm)',borderRadius:'var(--radius-sm)',padding:'0.6rem 1rem',flex:1,border:'1.5px solid var(--cream-deep)'}}>
                          <div className="form-check mb-0">
                            <input type="checkbox" className="form-check-input" id="adminIsPopular" checked={formData.isPopular} onChange={e => setFormData({...formData, isPopular: e.target.checked})} />
                            <label className="form-check-label" htmlFor="adminIsPopular" style={{fontWeight:600,fontSize:'0.83rem'}}>
                              <i className="bi bi-star me-1" style={{color:'var(--gold-rich)'}}></i>Popular
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn-outline-rose" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                  <button type="submit" className="btn-rose" disabled={saving}>
                    {saving ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving…</> : <><i className={`bi ${editingCake ? 'bi-check-circle' : 'bi-plus-circle'} me-1`}></i>{editingCake ? 'Update' : 'Add Cake'}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


// ─── MAIN ADMIN PAGE ────────────────────────────────────
const AdminPage = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user || user.role !== 'super_admin') {
    return (
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--cream-warm)'}}>
        <div className="content-card p-5 text-center" style={{maxWidth:'420px'}}>
          <div style={{fontSize:'3.5rem',opacity:0.25,marginBottom:'1rem'}}>🔒</div>
          <h3 style={{fontFamily:'var(--font-display)',color:'var(--text-dark)'}}>Access Denied</h3>
          <p style={{color:'var(--text-soft)'}}>You do not have administrator privileges.</p>
          <button className="btn-rose" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'bi-speedometer2' },
    { key: 'shops',    label: 'Shops',    icon: 'bi-shop' },
    { key: 'users',    label: 'Users',    icon: 'bi-people' },
    { key: 'orders',   label: 'Orders',   icon: 'bi-bag-check' },
    { key: 'cakes',    label: 'Cakes',    icon: 'bi-cake2' },
  ];

  return (
    <div style={{minHeight:'100vh',background:'var(--cream-warm)'}}>
      {/* Admin navbar */}
      <nav style={{background:'linear-gradient(135deg, #1a0f0c 0%, #3D2626 100%)',padding:'0.7rem 1.5rem',display:'flex',alignItems:'center',justifyContent:'space-between',boxShadow:'0 2px 20px rgba(0,0,0,0.35)',position:'sticky',top:0,zIndex:1000,borderBottom:'1px solid rgba(212,175,55,0.15)'}}>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <div style={{width:36,height:36,background:'var(--grad-gold)',borderRadius:'var(--radius-sm)',display:'flex',alignItems:'center',justifyContent:'center',boxShadow:'var(--shadow-gold)'}}>
            <i className="bi bi-shield-lock" style={{color:'var(--text-dark)'}}></i>
          </div>
          <span style={{fontFamily:'var(--font-display)',color:'var(--gold-light)',fontWeight:700,fontSize:'1.1rem'}}>Super Admin</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
          <Link to="/" style={{color:'rgba(255,255,255,0.5)',fontSize:'0.82rem',display:'flex',alignItems:'center',gap:'0.3rem',textDecoration:'none'}}>
            <i className="bi bi-globe2"></i> View Store
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',padding:'0.35rem 0.75rem',background:'rgba(255,255,255,0.06)',borderRadius:'var(--radius-sm)',border:'1px solid rgba(212,175,55,0.15)'}}>
            <div style={{width:26,height:26,background:'var(--grad-gold)',borderRadius:'6px',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.78rem',color:'var(--text-dark)'}}>
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span style={{color:'white',fontSize:'0.8rem',fontWeight:600}}>{user?.name?.split(' ')[0]}</span>
            <span style={{color:'var(--gold-light)',fontSize:'0.68rem',opacity:0.8}}>Super Admin</span>
          </div>
          <button onClick={() => { logout(); navigate('/'); }}
            style={{background:'rgba(220,100,100,0.12)',border:'1px solid rgba(220,100,100,0.25)',color:'#E88888',borderRadius:'var(--radius-sm)',padding:'0.35rem 0.85rem',cursor:'pointer',fontSize:'0.82rem',display:'flex',alignItems:'center',gap:'0.35rem',fontFamily:'var(--font-body)'}}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </nav>

      {/* Page header */}
      <div style={{background:'linear-gradient(135deg, #3D2626 0%, #6B4F50 100%)',padding:'2rem 1.75rem 1.5rem',borderBottom:'1px solid rgba(212,175,55,0.1)'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <h1 style={{fontFamily:'var(--font-display)',color:'var(--gold-light)',fontSize:'2rem',fontWeight:700,margin:0}}>Admin Dashboard</h1>
          <p style={{color:'rgba(255,255,255,0.5)',fontSize:'0.88rem',margin:'0.25rem 0 1.5rem'}}>Platform-wide management & oversight</p>
          {/* Tab nav */}
          <div style={{display:'flex',gap:'0.25rem'}}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                style={{padding:'0.5rem 1.1rem',borderRadius:'var(--radius-sm) var(--radius-sm) 0 0',border:'none',cursor:'pointer',fontSize:'0.86rem',fontWeight:600,fontFamily:'var(--font-body)',display:'flex',alignItems:'center',gap:'0.4rem',transition:'all 0.2s',
                  background: activeTab === t.key ? 'var(--cream-warm)' : 'rgba(255,255,255,0.08)',
                  color: activeTab === t.key ? 'var(--text-dark)' : 'rgba(255,255,255,0.7)'}}>
                <i className={`bi ${t.icon}`}></i>{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'1.75rem'}}>
        {activeTab === 'overview' && <OverviewTab token={token} />}
        {activeTab === 'shops'    && <ShopsTab token={token} />}
        {activeTab === 'users'    && <UsersTab token={token} />}
        {activeTab === 'orders'   && <OrdersTab token={token} />}
        {activeTab === 'cakes'    && <CakesTab token={token} />}
      </div>
    </div>
  );
};

export default AdminPage;

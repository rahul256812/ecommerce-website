import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ vendors: 0, buyers: 0, rfqs: 0, orders: 0, products: 0, revenue: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentRfqs, setRecentRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const [v, b, r, o] = await Promise.all([
                    api.get('/admin/vendors'), api.get('/admin/buyers'),
                    api.get('/rfq/all'), api.get('/orders/all'),
                ]);
                const revenue = o.data.reduce((s, ord) => s + (ord.total_amount || 0), 0);
                setStats({
                    vendors: v.data.length, buyers: b.data.length,
                    rfqs: r.data.length, orders: o.data.length,
                    products: 0, revenue,
                });
                setRecentOrders(o.data.slice(-5).reverse());
                setRecentRfqs(r.data.slice(-5).reverse());
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        load();
    }, []);

    const statCards = [
        { label: 'Total Vendors', value: stats.vendors, icon: 'fa-store', color: '#3b82f6', bg: '#eff6ff', sub: 'Active accounts' },
        { label: 'Total Buyers', value: stats.buyers, icon: 'fa-users', color: '#10b981', bg: '#ecfdf5', sub: 'Registered accounts' },
        { label: 'Total RFQs', value: stats.rfqs, icon: 'fa-clipboard-list', color: '#8b5cf6', bg: '#f5f3ff', sub: 'All time' },
        { label: 'Total Orders', value: stats.orders, icon: 'fa-receipt', color: '#f59e0b', bg: '#fffbeb', sub: 'Platform-wide' },
        { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: 'fa-chart-line', color: '#ef4444', bg: '#fef2f2', sub: 'Total GMV' },
    ];

    const quickActions = [
        { label: 'Manage Users', icon: 'fa-users-gear', color: '#3b82f6', bg: '#eff6ff', path: '/admin/users' },
        { label: 'RFQ Monitoring', icon: 'fa-clipboard-check', color: '#8b5cf6', bg: '#f5f3ff', path: '/admin/rfqs' },
        { label: 'All Orders', icon: 'fa-boxes-stacked', color: '#f59e0b', bg: '#fffbeb', path: '/admin/orders' },
    ];

    const statusConfig = {
        pending: { color: '#f59e0b', bg: '#fffbeb', icon: 'fa-clock' },
        confirmed: { color: '#3b82f6', bg: '#eff6ff', icon: 'fa-circle-check' },
        shipped: { color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-truck' },
        delivered: { color: '#10b981', bg: '#ecfdf5', icon: 'fa-box-open' },
        cancelled: { color: '#ef4444', bg: '#fef2f2', icon: 'fa-ban' },
        responded: { color: '#3b82f6', bg: '#eff6ff', icon: 'fa-reply' },
    };
    const getStatus = (s) => statusConfig[s] || { color: '#6b7280', bg: '#f9fafb', icon: 'fa-circle' };

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <Sidebar>
            <div style={{ maxWidth: 1040, margin: '0 auto' }}>

                {/* Header with greeting */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-shield-halved" style={{ fontSize: 11, marginRight: 6 }} />
                        Admin Dashboard
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>{greeting}, {user?.name}</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Platform overview and management tools.</p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 36, height: 36, border: '3px solid #e5e7eb',
                            borderTop: '3px solid #6366f1', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 24 }}>
                            {statCards.map((card, i) => (
                                <div key={i}
                                    onMouseEnter={() => setHoveredCard(i)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        background: '#fff', borderRadius: 14, border: `1px solid ${hoveredCard === i ? '#e0e7ff' : '#f3f4f6'}`,
                                        padding: '18px 16px', boxShadow: hoveredCard === i ? '0 4px 16px rgba(99,102,241,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
                                        transition: 'all 0.2s', cursor: 'default',
                                    }}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10, background: card.bg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                                    }}>
                                        <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: 14 }} />
                                    </div>
                                    <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{card.value}</p>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 2px 0' }}>{card.label}</p>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{card.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div style={{ marginBottom: 24 }}>
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <i className="fa-solid fa-bolt" style={{ fontSize: 12, color: '#f59e0b' }} />
                                Quick Actions
                            </h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                                {quickActions.map((action, i) => (
                                    <button key={i} onClick={() => navigate(action.path)}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(99,102,241,0.08)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: 12,
                                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                                            padding: '16px 18px', cursor: 'pointer', textAlign: 'left',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.2s',
                                        }}
                                    >
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 11, background: action.bg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <i className={`fa-solid ${action.icon}`} style={{ color: action.color, fontSize: 15 }} />
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{action.label}</p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>View & manage</p>
                                        </div>
                                        <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', fontSize: 10, color: '#d1d5db' }} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Two-column: Recent Orders + Recent RFQs */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                            {/* Recent Orders */}
                            <div style={{
                                background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 7, background: '#fffbeb',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <i className="fa-solid fa-receipt" style={{ color: '#f59e0b', fontSize: 11 }} />
                                        </div>
                                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Recent Orders</h3>
                                    </div>
                                    <button onClick={() => navigate('/admin/orders')} style={{
                                        background: 'none', border: 'none', color: '#6366f1', fontSize: 12,
                                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                                    }}>
                                        View All <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
                                    </button>
                                </div>
                                {recentOrders.length === 0 ? (
                                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                        <i className="fa-solid fa-inbox" style={{ fontSize: 20, color: '#d1d5db', marginBottom: 8 }} />
                                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No orders yet</p>
                                    </div>
                                ) : (
                                    <div>
                                        {recentOrders.map((order, i) => {
                                            const st = getStatus(order.status);
                                            return (
                                                <div key={order.id} style={{
                                                    padding: '12px 20px', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'space-between', gap: 10,
                                                    borderBottom: i < recentOrders.length - 1 ? '1px solid #f9fafb' : 'none',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: 8, background: '#eef2ff',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                        }}>
                                                            <i className="fa-solid fa-box" style={{ fontSize: 11, color: '#6366f1' }} />
                                                        </div>
                                                        <div style={{ minWidth: 0 }}>
                                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>Order #{order.id}</p>
                                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                                                                {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                                {' · '}${order.total_amount?.toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                                        padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                                        fontWeight: 700, color: st.color, background: st.bg,
                                                        textTransform: 'uppercase', letterSpacing: 0.3, whiteSpace: 'nowrap',
                                                    }}>
                                                        <i className={`fa-solid ${st.icon}`} style={{ fontSize: 8 }} />
                                                        {order.status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Recent RFQs */}
                            <div style={{
                                background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '16px 20px', borderBottom: '1px solid #f3f4f6',
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 7, background: '#f5f3ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <i className="fa-solid fa-clipboard-list" style={{ color: '#8b5cf6', fontSize: 11 }} />
                                        </div>
                                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Recent RFQs</h3>
                                    </div>
                                    <button onClick={() => navigate('/admin/rfqs')} style={{
                                        background: 'none', border: 'none', color: '#6366f1', fontSize: 12,
                                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                                    }}>
                                        View All <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
                                    </button>
                                </div>
                                {recentRfqs.length === 0 ? (
                                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                                        <i className="fa-solid fa-inbox" style={{ fontSize: 20, color: '#d1d5db', marginBottom: 8 }} />
                                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No RFQs yet</p>
                                    </div>
                                ) : (
                                    <div>
                                        {recentRfqs.map((rfq, i) => {
                                            const st = getStatus(rfq.status);
                                            return (
                                                <div key={rfq.id} style={{
                                                    padding: '12px 20px', display: 'flex', alignItems: 'center',
                                                    justifyContent: 'space-between', gap: 10,
                                                    borderBottom: i < recentRfqs.length - 1 ? '1px solid #f9fafb' : 'none',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            width: 32, height: 32, borderRadius: 8, background: '#f5f3ff',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                        }}>
                                                            <i className="fa-solid fa-file-lines" style={{ fontSize: 11, color: '#8b5cf6' }} />
                                                        </div>
                                                        <div style={{ minWidth: 0 }}>
                                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {rfq.product_name || `RFQ #${rfq.id}`}
                                                            </p>
                                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                                                                Qty: {rfq.quantity}
                                                                {rfq.created_at && ` · ${new Date(rfq.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span style={{
                                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                                        padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                                        fontWeight: 700, color: st.color, background: st.bg,
                                                        textTransform: 'uppercase', letterSpacing: 0.3, whiteSpace: 'nowrap',
                                                    }}>
                                                        <i className={`fa-solid ${st.icon}`} style={{ fontSize: 8 }} />
                                                        {rfq.status}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Platform Info Footer */}
                        <div style={{
                            marginTop: 24, padding: '16px 20px', borderRadius: 14,
                            background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                            border: '1px solid #e0e7ff',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 34, height: 34, borderRadius: 9,
                                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-cubes" style={{ color: '#fff', fontSize: 13 }} />
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>TradeHub Platform</p>
                                    <p style={{ fontSize: 11, color: '#6b7280', margin: 0 }}>B2B Commerce · Admin Panel</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{
                                    width: 7, height: 7, borderRadius: '50%', background: '#10b981',
                                    display: 'inline-block',
                                }} />
                                <span style={{ fontSize: 12, fontWeight: 600, color: '#10b981' }}>All systems operational</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Sidebar>
    );
}

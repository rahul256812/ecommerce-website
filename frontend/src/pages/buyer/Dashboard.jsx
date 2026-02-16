import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function BuyerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ rfqs: 0, pendingRfqs: 0, cartItems: 0, orders: 0 });
    const [hoveredAction, setHoveredAction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [rfqs, cart, orders] = await Promise.all([
                    api.get('/rfq/buyer'),
                    api.get('/cart/'),
                    api.get('/orders/').catch(() => ({ data: [] })),
                ]);
                setStats({
                    rfqs: rfqs.data.length,
                    pendingRfqs: rfqs.data.filter(r => r.status === 'pending').length,
                    cartItems: cart.data.length,
                    orders: orders.data.length,
                });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const statCards = [
        { label: 'Cart Items', value: stats.cartItems, icon: 'fa-cart-shopping', color: '#3b82f6', bg: '#eff6ff', sub: 'Items in cart' },
        { label: 'Pending RFQs', value: stats.pendingRfqs, icon: 'fa-clock', color: '#f59e0b', bg: '#fffbeb', sub: 'Awaiting response' },
        { label: 'Total RFQs', value: stats.rfqs, icon: 'fa-clipboard-list', color: '#10b981', bg: '#ecfdf5', sub: 'All time' },
        { label: 'Orders', value: stats.orders, icon: 'fa-box', color: '#8b5cf6', bg: '#f5f3ff', sub: 'Placed orders' },
    ];

    const quickActions = [
        { to: '/buyer/products', label: 'Browse Products', desc: 'Find products from verified vendors', icon: 'fa-bag-shopping', color: '#6366f1', bg: '#eef2ff' },
        { to: '/buyer/cart', label: 'View Cart', desc: 'Review items and checkout', icon: 'fa-cart-shopping', color: '#10b981', bg: '#ecfdf5' },
        { to: '/buyer/rfqs', label: 'My RFQs', desc: 'Track your quotation requests', icon: 'fa-file-invoice', color: '#f59e0b', bg: '#fffbeb' },
        { to: '/buyer/orders', label: 'Order History', desc: 'View past orders and status', icon: 'fa-box', color: '#8b5cf6', bg: '#f5f3ff' },
    ];

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <Sidebar>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>

                {/* Welcome Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)',
                    borderRadius: 18, padding: '32px 34px', marginBottom: 28,
                    position: 'relative', overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.2)',
                }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 6px 0', fontWeight: 500 }}>
                            <i className="fa-solid fa-sun" style={{ marginRight: 6, fontSize: 11 }} />
                            {getGreeting()}
                        </p>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 6px 0', letterSpacing: -0.5 }}>
                            Welcome back, {user?.name}
                        </h1>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                            Your procurement overview at a glance.
                        </p>
                    </div>
                </div>

                {/* Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                    {statCards.map((card, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14,
                            border: '1px solid #f3f4f6', padding: '20px 20px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                        >
                            <div style={{
                                width: 38, height: 38, borderRadius: 10,
                                background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 14,
                            }}>
                                <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: 14 }} />
                            </div>
                            <div style={{ fontSize: 26, fontWeight: 700, color: '#111827', lineHeight: 1 }}>
                                {loading ? '—' : card.value}
                            </div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginTop: 4 }}>{card.label}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{card.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #f3f4f6', padding: '24px 26px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    marginBottom: 28,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className="fa-solid fa-bolt" style={{ color: '#6366f1', fontSize: 12 }} />
                        </div>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Quick Actions</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {quickActions.map((a, i) => (
                            <Link key={i} to={a.to} style={{ textDecoration: 'none' }}
                                onMouseEnter={() => setHoveredAction(i)}
                                onMouseLeave={() => setHoveredAction(null)}
                            >
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '14px 16px', borderRadius: 12,
                                    border: `1px solid ${hoveredAction === i ? '#e0e7ff' : '#f3f4f6'}`,
                                    background: hoveredAction === i ? '#fafbff' : '#fff',
                                    transition: 'all 0.15s', cursor: 'pointer',
                                }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 11,
                                        background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <i className={`fa-solid ${a.icon}`} style={{ color: a.color, fontSize: 15 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{a.label}</p>
                                        <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0 0' }}>{a.desc}</p>
                                    </div>
                                    <i className="fa-solid fa-chevron-right" style={{
                                        fontSize: 10,
                                        color: hoveredAction === i ? a.color : '#d1d5db',
                                        transition: 'color 0.15s',
                                    }} />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Getting Started Tips */}
                <div style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #f3f4f6', padding: '24px 26px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <div style={{
                            width: 30, height: 30, borderRadius: 8,
                            background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className="fa-solid fa-lightbulb" style={{ color: '#10b981', fontSize: 12 }} />
                        </div>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>How It Works</h2>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                        {[
                            { step: '1', title: 'Browse & Select', desc: 'Explore products from verified vendors and add items to your cart.', icon: 'fa-magnifying-glass', color: '#6366f1', bg: '#eef2ff' },
                            { step: '2', title: 'Request Quotes', desc: 'Send RFQs for bulk pricing or custom orders from vendors.', icon: 'fa-paper-plane', color: '#f59e0b', bg: '#fffbeb' },
                            { step: '3', title: 'Place Orders', desc: 'Checkout securely and track your orders in real-time.', icon: 'fa-truck', color: '#10b981', bg: '#ecfdf5' },
                        ].map((s, i) => (
                            <div key={i} style={{
                                padding: '20px 18px', borderRadius: 12,
                                border: '1px solid #f3f4f6',
                                background: '#fafafa',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 14px',
                                }}>
                                    <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 16 }} />
                                </div>
                                <div style={{
                                    display: 'inline-block', padding: '2px 8px', borderRadius: 8,
                                    background: '#e5e7eb', fontSize: 10, fontWeight: 700,
                                    color: '#6b7280', marginBottom: 8,
                                }}>
                                    STEP {s.step}
                                </div>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: '0 0 6px 0' }}>{s.title}</h3>
                                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

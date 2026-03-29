import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { convertAndFormatINR, formatINR, convertToINR } from '../../utils/currency';

const statusConfig = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: 'fa-clock' },
    confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#eff6ff', icon: 'fa-circle-check' },
    shipped: { label: 'Shipped', color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-truck' },
    delivered: { label: 'Delivered', color: '#10b981', bg: '#ecfdf5', icon: 'fa-box-open' },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', icon: 'fa-ban' },
};
const getStatus = (s) => statusConfig[s] || { label: s, color: '#6b7280', bg: '#f9fafb', icon: 'fa-circle-question' };

const productIcons = ['fa-microchip', 'fa-chair', 'fa-industry', 'fa-cubes', 'fa-box-open'];
const productColors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#3b82f6'];

export default function BuyerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredOrder, setHoveredOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/orders/my').then(r => setOrders(r.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const totalSpent = orders.reduce((s, o) => s + (o.total_amount || 0), 0);
    const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    const stats = [
        { label: 'Total Orders', value: orders.length, icon: 'fa-receipt', color: '#6366f1', bg: '#eef2ff' },
        { label: 'In Progress', value: pendingCount, icon: 'fa-spinner', color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Delivered', value: deliveredCount, icon: 'fa-circle-check', color: '#10b981', bg: '#ecfdf5' },
        { label: 'Total Spent', value: convertAndFormatINR(totalSpent), icon: 'fa-wallet', color: '#8b5cf6', bg: '#f5f3ff' },
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-receipt" style={{ fontSize: 11, marginRight: 6 }} />
                        Orders
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>My Orders</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Track and manage your purchase history.</p>
                </div>

                {/* Summary Stats */}
                {!loading && orders.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                        {stats.map((s, i) => (
                            <div key={i} style={{
                                background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                                padding: '16px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 34, height: 34, borderRadius: 9, background: s.bg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 13 }} />
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.3, margin: 0 }}>{s.label}</p>
                                        <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>{s.value}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

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

                    /* Empty State */
                ) : orders.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '72px 20px',
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#eef2ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <i className="fa-solid fa-receipt" style={{ fontSize: 22, color: '#6366f1' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No orders yet</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 18px 0' }}>Your purchase history will appear here once you place an order.</p>
                        <button onClick={() => navigate('/buyer/products')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '10px 22px', borderRadius: 10, border: 'none',
                            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>
                            Browse Products <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
                        </button>
                    </div>

                    /* Orders List */
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {orders.map((o, i) => {
                            const st = getStatus(o.status);
                            const isHovered = hoveredOrder === i;
                            return (
                                <div key={o.id}
                                    onMouseEnter={() => setHoveredOrder(i)}
                                    onMouseLeave={() => setHoveredOrder(null)}
                                    style={{
                                        background: '#fff', borderRadius: 16, overflow: 'hidden',
                                        border: `1px solid ${isHovered ? '#e0e7ff' : '#f3f4f6'}`,
                                        boxShadow: isHovered ? '0 4px 16px rgba(99,102,241,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {/* Order Header */}
                                    <div style={{
                                        padding: '16px 20px', display: 'flex', alignItems: 'center',
                                        justifyContent: 'space-between', borderBottom: '1px solid #f3f4f6',
                                        background: '#fafbfc',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10, background: '#eef2ff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <i className="fa-solid fa-box" style={{ fontSize: 14, color: '#6366f1' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>
                                                    Order #{o.id}
                                                </p>
                                                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                                    <i className="fa-regular fa-calendar" style={{ marginRight: 4, fontSize: 10 }} />
                                                    {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    {' · '}
                                                    {new Date(o.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Status Badge */}
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            padding: '5px 12px', borderRadius: 20, fontSize: 11,
                                            fontWeight: 700, color: st.color, background: st.bg,
                                            textTransform: 'uppercase', letterSpacing: 0.3,
                                        }}>
                                            <i className={`fa-solid ${st.icon}`} style={{ fontSize: 10 }} />
                                            {st.label}
                                        </span>
                                    </div>

                                    {/* Order Items */}
                                    <div style={{ padding: '12px 20px' }}>
                                        {o.items.map((item, j) => (
                                            <div key={j} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                padding: '10px 0',
                                                borderBottom: j < o.items.length - 1 ? '1px solid #f9fafb' : 'none',
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{
                                                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                                                        background: `${productColors[j % productColors.length]}11`,
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <i className={`fa-solid ${productIcons[j % productIcons.length]}`}
                                                            style={{ color: productColors[j % productColors.length], fontSize: 14 }} />
                                                    </div>
                                                    <div>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{item.product_name}</p>
                                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                                            Qty: {item.quantity} × {convertAndFormatINR(item.price)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                                                    {convertAndFormatINR(item.price * item.quantity)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div style={{
                                        padding: '14px 20px', borderTop: '1px solid #f3f4f6',
                                        background: '#fafbfc',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <span style={{ fontSize: 12, color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <i className="fa-solid fa-location-dot" style={{ fontSize: 10, color: '#c7d2fe' }} />
                                            {o.shipping_address || 'No address provided'}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                            <span style={{ fontSize: 12, color: '#9ca3af', fontWeight: 500 }}>Total:</span>
                                            <span style={{ fontSize: 18, fontWeight: 700, color: '#111827' }}>
                                                {convertAndFormatINR(o.total_amount)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

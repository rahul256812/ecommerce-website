import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { convertAndFormatINR } from '../../utils/currency';

export default function SAOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [hoveredCard, setHoveredCard] = useState(null);

    useEffect(() => {
        api.get('/orders/all').then(res => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    const total = orders.reduce((s, o) => s + o.total_amount, 0);
    const commission = orders.reduce((s, o) => s + o.commission_amount, 0);

    const statusConfig = {
        pending: { color: '#f59e0b', bg: '#fffbeb', icon: 'fa-clock', label: 'Pending' },
        processing: { color: '#3b82f6', bg: '#eff6ff', icon: 'fa-spinner', label: 'Processing' },
        shipped: { color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-truck', label: 'Shipped' },
        delivered: { color: '#10b981', bg: '#ecfdf5', icon: 'fa-circle-check', label: 'Delivered' },
        cancelled: { color: '#ef4444', bg: '#fef2f2', icon: 'fa-circle-xmark', label: 'Cancelled' },
    };
    const getStatus = (s) => statusConfig[s] || { color: '#6b7280', bg: '#f9fafb', icon: 'fa-circle', label: s };

    const filterTabs = [
        { key: 'all', label: 'All', icon: 'fa-layer-group', color: '#6366f1' },
        { key: 'pending', label: 'Pending', icon: 'fa-clock', color: '#f59e0b' },
        { key: 'processing', label: 'Processing', icon: 'fa-spinner', color: '#3b82f6' },
        { key: 'shipped', label: 'Shipped', icon: 'fa-truck', color: '#8b5cf6' },
        { key: 'delivered', label: 'Delivered', icon: 'fa-circle-check', color: '#10b981' },
    ];

    const productColors = [
        ['#6366f1', '#eef2ff'], ['#3b82f6', '#eff6ff'], ['#10b981', '#ecfdf5'],
        ['#f59e0b', '#fffbeb'], ['#ef4444', '#fef2f2'], ['#8b5cf6', '#f5f3ff'],
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1040, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-receipt" style={{ fontSize: 11, marginRight: 6 }} />
                        Order Management
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>All Orders</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Full platform order visibility and management.</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Total Orders', value: orders.length, icon: 'fa-receipt', color: '#6366f1', bg: '#eef2ff', sub: 'All time' },
                        { label: 'Revenue', value: convertAndFormatINR(total), icon: 'fa-indian-rupee-sign', color: '#10b981', bg: '#ecfdf5', sub: 'Gross revenue' },
                        { label: 'Commission', value: convertAndFormatINR(commission), icon: 'fa-hand-holding-dollar', color: '#8b5cf6', bg: '#f5f3ff', sub: 'Platform earnings' },
                        { label: 'Avg. Order', value: orders.length > 0 ? convertAndFormatINR(total / orders.length) : '₹0.00', icon: 'fa-chart-line', color: '#f59e0b', bg: '#fffbeb', sub: 'Per order' },
                    ].map((card, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
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

                {/* Filter Tabs */}
                <div style={{
                    display: 'inline-flex', gap: 4, padding: 4, background: '#f3f4f6',
                    borderRadius: 12, marginBottom: 20,
                }}>
                    {filterTabs.map(t => {
                        const count = t.key === 'all' ? orders.length : orders.filter(o => o.status === t.key).length;
                        return (
                            <button key={t.key} onClick={() => setFilter(t.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '9px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                                    background: filter === t.key ? '#fff' : 'transparent',
                                    color: filter === t.key ? '#111827' : '#9ca3af',
                                    boxShadow: filter === t.key ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                                }}
                            >
                                <i className={`fa-solid ${t.icon}`} style={{ fontSize: 10, color: filter === t.key ? t.color : '#d1d5db' }} />
                                {t.label}
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                                    background: filter === t.key ? '#eef2ff' : '#e5e7eb',
                                    color: filter === t.key ? '#6366f1' : '#9ca3af',
                                }}>{count}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 36, height: 36, border: '3px solid #e5e7eb',
                            borderTop: '3px solid #6366f1', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                        }}>
                            <i className="fa-solid fa-receipt" style={{ fontSize: 22, color: '#d1d5db' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>No orders yet</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Orders will appear here once buyers start purchasing.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {filtered.map((o) => {
                            const st = getStatus(o.status);
                            const isHovered = hoveredCard === o.id;
                            return (
                                <div key={o.id}
                                    onMouseEnter={() => setHoveredCard(o.id)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                                        boxShadow: isHovered ? '0 4px 16px rgba(0,0,0,0.07)' : '0 1px 3px rgba(0,0,0,0.04)',
                                        overflow: 'hidden', transition: 'box-shadow 0.2s, transform 0.2s',
                                        transform: isHovered ? 'translateY(-1px)' : 'none',
                                    }}
                                >
                                    {/* Order Header */}
                                    <div style={{
                                        padding: '16px 20px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10, background: '#eef2ff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <i className="fa-solid fa-receipt" style={{ fontSize: 13, color: '#6366f1' }} />
                                            </div>
                                            <div>
                                                <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>
                                                    Order #{o.id}
                                                </p>
                                                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                                    <i className="fa-solid fa-user" style={{ fontSize: 9, marginRight: 4 }} />
                                                    {o.buyer_name} · {new Date(o.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '4px 10px', borderRadius: 20, fontSize: 10,
                                                fontWeight: 700, color: st.color, background: st.bg,
                                                textTransform: 'uppercase', letterSpacing: 0.3,
                                            }}>
                                                <i className={`fa-solid ${st.icon}`} style={{ fontSize: 8 }} />
                                                {st.label}
                                            </span>
                                            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>
                                                {convertAndFormatINR(o.total_amount)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Items */}
                                    <div style={{ padding: '10px 20px' }}>
                                        {o.items.map((item, j) => {
                                            const [iconColor, iconBg] = productColors[j % productColors.length];
                                            return (
                                                <div key={j} style={{
                                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                    padding: '10px 0',
                                                    borderBottom: j < o.items.length - 1 ? '1px solid #f9fafb' : 'none',
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                        <div style={{
                                                            width: 30, height: 30, borderRadius: 8, background: iconBg,
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        }}>
                                                            <i className="fa-solid fa-cube" style={{ fontSize: 10, color: iconColor }} />
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{item.product_name}</p>
                                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                                                                {convertAndFormatINR(item.price)} × {item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', margin: 0 }}>
                                                        {convertAndFormatINR(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Footer */}
                                    <div style={{
                                        padding: '12px 20px', background: '#fafbfc', borderTop: '1px solid #f3f4f6',
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                fontSize: 11, color: '#8b5cf6', fontWeight: 600,
                                            }}>
                                                <i className="fa-solid fa-hand-holding-dollar" style={{ fontSize: 9 }} />
                                                Commission: {convertAndFormatINR(o.commission_amount)}
                                            </span>
                                            <span style={{ width: 1, height: 12, background: '#e5e7eb' }} />
                                            <span style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                fontSize: 11, color: '#6b7280',
                                            }}>
                                                <i className="fa-solid fa-credit-card" style={{ fontSize: 9 }} />
                                                {o.payment_method}
                                            </span>
                                        </div>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 4,
                                            fontSize: 11, color: '#9ca3af',
                                        }}>
                                            <i className="fa-solid fa-location-dot" style={{ fontSize: 9 }} />
                                            {o.shipping_address}{o.shipping_city ? `, ${o.shipping_city}` : ''}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* List Footer */}
                        <div style={{
                            padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                Showing {filtered.length} of {orders.length} orders
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Live data</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

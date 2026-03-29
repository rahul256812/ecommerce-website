import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { convertAndFormatINR } from '../../utils/currency';

export default function SARFQView() {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => {
        api.get('/rfq/all').then(res => setRfqs(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? rfqs : rfqs.filter(r => r.status === filter);
    const totalValue = rfqs.reduce((s, r) => s + (r.expected_price || 0) * (r.quantity || 0), 0);

    const statusConfig = {
        pending: { color: '#f59e0b', bg: '#fffbeb', icon: 'fa-clock', label: 'PENDING' },
        accepted: { color: '#10b981', bg: '#ecfdf5', icon: 'fa-circle-check', label: 'ACCEPTED' },
        rejected: { color: '#ef4444', bg: '#fef2f2', icon: 'fa-circle-xmark', label: 'REJECTED' },
        revised: { color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-pen', label: 'REVISED' },
    };
    const getStatus = (s) => statusConfig[s] || { color: '#6b7280', bg: '#f9fafb', icon: 'fa-circle', label: s?.toUpperCase() };

    const filterTabs = [
        { key: 'all', label: 'All', icon: 'fa-layer-group', color: '#6366f1' },
        { key: 'pending', label: 'Pending', icon: 'fa-clock', color: '#f59e0b' },
        { key: 'accepted', label: 'Accepted', icon: 'fa-circle-check', color: '#10b981' },
        { key: 'rejected', label: 'Rejected', icon: 'fa-circle-xmark', color: '#ef4444' },
        { key: 'revised', label: 'Revised', icon: 'fa-pen', color: '#8b5cf6' },
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-clipboard-list" style={{ fontSize: 11, marginRight: 6 }} />
                        RFQ Overview
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>All RFQs</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Complete visibility into all quotation requests across the platform.</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Total RFQs', value: rfqs.length, icon: 'fa-clipboard-list', color: '#6366f1', bg: '#eef2ff', sub: 'All time' },
                        { label: 'Pending', value: rfqs.filter(r => r.status === 'pending').length, icon: 'fa-clock', color: '#f59e0b', bg: '#fffbeb', sub: 'Awaiting response' },
                        { label: 'Accepted', value: rfqs.filter(r => r.status === 'accepted').length, icon: 'fa-circle-check', color: '#10b981', bg: '#ecfdf5', sub: 'Completed' },
                        { label: 'Total Value', value: convertAndFormatINR(totalValue), icon: 'fa-indian-rupee-sign', color: '#ef4444', bg: '#fef2f2', sub: 'Expected value' },
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
                        const count = t.key === 'all' ? rfqs.length : rfqs.filter(r => r.status === t.key).length;
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
                            <i className="fa-solid fa-clipboard-list" style={{ fontSize: 22, color: '#d1d5db' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>No RFQs found</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No quotation requests match the current filter.</p>
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr 0.8fr 0.8fr 0.6fr 0.7fr',
                            padding: '14px 20px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                        }}>
                            {['PRODUCT', 'BUYER', 'VENDOR', 'QTY', 'EXPECTED', 'VENDOR PRICE', 'DATE', 'STATUS'].map(h => (
                                <span key={h} style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5 }}>{h}</span>
                            ))}
                        </div>

                        {/* Table Rows */}
                        {filtered.map((r, i) => {
                            const st = getStatus(r.status);
                            const priceMatch = r.vendor_price > 0 && r.expected_price > 0;
                            const priceAbove = priceMatch && r.vendor_price > r.expected_price;
                            return (
                                <div key={r.id}
                                    onMouseEnter={() => setHoveredRow(r.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 0.5fr 0.8fr 0.8fr 0.6fr 0.7fr',
                                        padding: '14px 20px', alignItems: 'center',
                                        borderBottom: i < filtered.length - 1 ? '1px solid #f9fafb' : 'none',
                                        background: hoveredRow === r.id ? '#f9fafb' : '#fff',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* Product */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{
                                            width: 28, height: 28, borderRadius: 7,
                                            background: '#eef2ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <i className="fa-solid fa-cube" style={{ fontSize: 10, color: '#6366f1' }} />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.product_name}</span>
                                    </div>

                                    {/* Buyer */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 6, fontSize: 9, fontWeight: 700,
                                            background: '#dbeafe', color: '#3b82f6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {r.buyer_name?.charAt(0) || 'B'}
                                        </div>
                                        <span style={{ fontSize: 12, color: '#374151' }}>{r.buyer_name}</span>
                                    </div>

                                    {/* Vendor */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 6, fontSize: 9, fontWeight: 700,
                                            background: '#d1fae5', color: '#10b981',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {r.vendor_name?.charAt(0) || 'V'}
                                        </div>
                                        <span style={{ fontSize: 12, color: '#374151' }}>{r.vendor_name}</span>
                                    </div>

                                    {/* Qty */}
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.quantity}</span>

                                    {/* Expected Price */}
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                                        {convertAndFormatINR(r.expected_price)}
                                    </span>

                                    {/* Vendor Price */}
                                    <span style={{ fontSize: 13, fontWeight: 600, color: priceAbove ? '#ef4444' : '#10b981' }}>
                                        {r.vendor_price > 0 ? (
                                            <>
                                                {convertAndFormatINR(r.vendor_price)}
                                                <span style={{ fontSize: 10, marginLeft: 3 }}>
                                                    {priceAbove ? '↑' : '↓'}
                                                </span>
                                            </>
                                        ) : '—'}
                                    </span>

                                    {/* Date */}
                                    <span style={{ fontSize: 11, color: '#9ca3af' }}>
                                        {r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                                    </span>

                                    {/* Status */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content',
                                        padding: '3px 9px', borderRadius: 20, fontSize: 9,
                                        fontWeight: 700, color: st.color, background: st.bg,
                                        textTransform: 'uppercase', letterSpacing: 0.3,
                                    }}>
                                        <i className={`fa-solid ${st.icon}`} style={{ fontSize: 7 }} />
                                        {st.label}
                                    </span>
                                </div>
                            );
                        })}

                        {/* Table Footer */}
                        <div style={{
                            padding: '12px 20px', background: '#fafbfc', borderTop: '1px solid #f3f4f6',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                Showing {filtered.length} of {rfqs.length} RFQs
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

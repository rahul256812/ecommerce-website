import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

const statusMeta = {
    pending: { label: 'Pending', color: '#f59e0b', bg: '#fffbeb', icon: 'fa-clock' },
    revised: { label: 'Revised', color: '#6366f1', bg: '#eef2ff', icon: 'fa-pen' },
    accepted: { label: 'Accepted', color: '#10b981', bg: '#ecfdf5', icon: 'fa-check' },
    rejected: { label: 'Rejected', color: '#ef4444', bg: '#fef2f2', icon: 'fa-xmark' },
    completed: { label: 'Completed', color: '#10b981', bg: '#ecfdf5', icon: 'fa-circle-check' },
};

export default function BuyerRFQ() {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hoveredCard, setHoveredCard] = useState(null);
    const navigate = useNavigate();

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/rfq/buyer'); setRfqs(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async (rfqId, action) => {
        try {
            await api.put(`/rfq/${rfqId}/buyer-action?action=${action}`);
            if (action === 'accept') navigate(`/buyer/checkout?rfq_id=${rfqId}`);
            else load();
        } catch (err) { console.error(err); }
    };

    const sm = (s) => statusMeta[s] || statusMeta.pending;
    const pending = rfqs.filter(r => r.status === 'pending').length;
    const responded = rfqs.filter(r => ['revised', 'accepted'].includes(r.status)).length;

    const statCards = [
        { label: 'Total RFQs', value: rfqs.length, icon: 'fa-clipboard-list', color: '#6366f1', bg: '#eef2ff' },
        { label: 'Pending', value: pending, icon: 'fa-clock', color: '#f59e0b', bg: '#fffbeb' },
        { label: 'Responded', value: responded, icon: 'fa-reply', color: '#10b981', bg: '#ecfdf5' },
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-clipboard-list" style={{ fontSize: 11, marginRight: 6 }} />
                        Quotations
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>My RFQs</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Track your quotation requests and vendor responses.</p>
                </div>

                {/* Stat Cards */}
                {!loading && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 28 }}>
                        {statCards.map((c, i) => (
                            <div key={i} style={{
                                background: '#fff', borderRadius: 14,
                                border: '1px solid #f3f4f6', padding: '18px 20px',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 12,
                                }}>
                                    <i className={`fa-solid ${c.icon}`} style={{ color: c.color, fontSize: 14 }} />
                                </div>
                                <div style={{ fontSize: 24, fontWeight: 700, color: '#111827', lineHeight: 1 }}>{c.value}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', marginTop: 3 }}>{c.label}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* RFQ List */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 36, height: 36, border: '3px solid #e5e7eb',
                            borderTop: '3px solid #6366f1', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : rfqs.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '72px 20px',
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#eef2ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <i className="fa-solid fa-clipboard-list" style={{ fontSize: 22, color: '#6366f1' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No RFQs submitted yet</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 18px 0' }}>Browse products and request quotes from vendors.</p>
                        <a href="/buyer/products" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '10px 22px', borderRadius: 10, textDecoration: 'none',
                            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                            color: '#fff', fontSize: 13, fontWeight: 600,
                        }}>
                            Browse Products <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
                        </a>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {rfqs.map((r, i) => {
                            const s = sm(r.status);
                            const isHovered = hoveredCard === i;
                            const hasActions = (r.status === 'revised' || r.status === 'accepted') && r.status !== 'rejected';
                            return (
                                <div key={r.id}
                                    onMouseEnter={() => setHoveredCard(i)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        background: '#fff', borderRadius: 16, overflow: 'hidden',
                                        border: `1px solid ${isHovered ? '#e0e7ff' : '#f3f4f6'}`,
                                        boxShadow: isHovered ? '0 4px 16px rgba(99,102,241,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {/* Card Header */}
                                    <div style={{
                                        padding: '18px 22px', display: 'flex',
                                        alignItems: 'center', justifyContent: 'space-between',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                            <div style={{
                                                width: 42, height: 42, borderRadius: 11,
                                                background: '#f3f4f6', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <i className="fa-solid fa-box" style={{ color: '#6b7280', fontSize: 16 }} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{r.product_name}</h3>
                                                <p style={{ fontSize: 12, color: '#9ca3af', margin: '3px 0 0 0' }}>
                                                    <i className="fa-solid fa-store" style={{ fontSize: 9, marginRight: 4 }} />
                                                    {r.vendor_name}
                                                    <span style={{ margin: '0 8px', color: '#e5e7eb' }}>·</span>
                                                    <i className="fa-solid fa-hashtag" style={{ fontSize: 9, marginRight: 3 }} />
                                                    Qty: {r.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Status Badge */}
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            padding: '5px 12px', borderRadius: 8,
                                            background: s.bg, fontSize: 12, fontWeight: 600, color: s.color,
                                        }}>
                                            <i className={`fa-solid ${s.icon}`} style={{ fontSize: 10 }} />
                                            {s.label}
                                        </span>
                                    </div>

                                    {/* Price Comparison */}
                                    <div style={{
                                        padding: '14px 22px', marginLeft: 22, marginRight: 22,
                                        borderRadius: 12, background: '#f9fafb',
                                        border: '1px solid #f3f4f6',
                                        display: 'grid', gridTemplateColumns: r.vendor_price > 0 ? '1fr 1fr' : '1fr',
                                        gap: 16, marginBottom: 14,
                                    }}>
                                        <div>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                <i className="fa-solid fa-tag" style={{ fontSize: 9, marginRight: 4 }} /> Your Price
                                            </span>
                                            <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '4px 0 0 0' }}>
                                                ${r.expected_price.toFixed(2)}<span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>/unit</span>
                                            </p>
                                        </div>
                                        {r.vendor_price > 0 && (
                                            <div>
                                                <span style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                    <i className="fa-solid fa-handshake" style={{ fontSize: 9, marginRight: 4 }} /> Vendor Price
                                                </span>
                                                <p style={{ fontSize: 18, fontWeight: 700, color: '#6366f1', margin: '4px 0 0 0' }}>
                                                    ${r.vendor_price.toFixed(2)}<span style={{ fontSize: 12, fontWeight: 500, color: '#9ca3af' }}>/unit</span>
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Vendor Notes */}
                                    {r.vendor_notes && (
                                        <div style={{
                                            padding: '12px 16px', marginLeft: 22, marginRight: 22,
                                            borderRadius: 10, background: '#fff',
                                            border: '1px solid #f3f4f6', marginBottom: 14,
                                            fontSize: 13, color: '#6b7280', lineHeight: 1.5,
                                        }}>
                                            <i className="fa-solid fa-quote-left" style={{ color: '#d1d5db', fontSize: 11, marginRight: 6 }} />
                                            {r.vendor_notes}
                                        </div>
                                    )}

                                    {/* Actions */}
                                    {hasActions && (
                                        <div style={{
                                            padding: '14px 22px', borderTop: '1px solid #f3f4f6',
                                            display: 'flex', gap: 10,
                                        }}>
                                            <button onClick={() => handleAction(r.id, 'accept')}
                                                style={{
                                                    padding: '10px 20px', borderRadius: 10, border: 'none',
                                                    background: 'linear-gradient(135deg, #10b981, #34d399)',
                                                    color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                                    transition: 'opacity 0.15s',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                            >
                                                <i className="fa-solid fa-check" style={{ marginRight: 5, fontSize: 11 }} />
                                                Accept & Proceed
                                            </button>
                                            <button onClick={() => handleAction(r.id, 'decline')}
                                                style={{
                                                    padding: '10px 20px', borderRadius: 10,
                                                    border: '1.5px solid #e5e7eb', background: '#fff',
                                                    color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                                    transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#fecaca'; e.currentTarget.style.color = '#ef4444'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#6b7280'; }}
                                            >
                                                <i className="fa-solid fa-xmark" style={{ marginRight: 4, fontSize: 11 }} />
                                                Decline
                                            </button>
                                        </div>
                                    )}

                                    {/* Bottom padding when no actions */}
                                    {!hasActions && <div style={{ paddingBottom: 8 }} />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

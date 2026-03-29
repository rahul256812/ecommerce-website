import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import api from '../../api';
import { convertAndFormatINR, formatINR, convertToINR } from '../../utils/currency';

const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid #e5e7eb', background: '#fafafa',
    fontSize: 14, color: '#111827', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
};

const statusColors = {
    pending: { bg: '#fef3c7', color: '#92400e', icon: 'fa-clock', label: 'Pending' },
    accepted: { bg: '#d1fae5', color: '#065f46', icon: 'fa-check-circle', label: 'Accepted' },
    revised: { bg: '#dbeafe', color: '#1e40af', icon: 'fa-pen', label: 'Revised' },
    rejected: { bg: '#fee2e2', color: '#991b1b', icon: 'fa-times-circle', label: 'Rejected' },
};

export default function VendorQuotations() {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [respondForm, setRespondForm] = useState({ id: null, price: '', notes: '', action: '' });
    const [focusedField, setFocusedField] = useState(null);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/rfq/vendor'); setRfqs(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleRespond = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/rfq/${respondForm.id}/respond`, {
                vendor_price: parseFloat(respondForm.price),
                vendor_notes: respondForm.notes,
                status: respondForm.action,
            });
            setRespondForm({ id: null, price: '', notes: '', action: '' });
            load();
        } catch (err) { console.error(err); }
    };

    const pending = rfqs.filter(r => r.status === 'pending');
    const past = rfqs.filter(r => r.status !== 'pending');

    const getInputStyle = (field) => ({
        ...inputStyle,
        ...(focusedField === field ? { borderColor: '#a5b4fc', boxShadow: '0 0 0 3px rgba(99,102,241,0.08)', background: '#fff' } : {}),
    });

    const StatusBadge = ({ status }) => {
        const s = statusColors[status] || statusColors.pending;
        return (
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: s.bg, color: s.color,
            }}>
                <i className={`fa-solid ${s.icon}`} style={{ fontSize: 9 }} />
                {s.label}
            </span>
        );
    };

    return (
        <Sidebar>
            <div style={{ maxWidth: 960, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20, marginBottom: 12,
                        background: '#eef2ff', color: '#6366f1', fontSize: 12, fontWeight: 600,
                    }}>
                        <i className="fa-solid fa-file-invoice" style={{ fontSize: 10 }} />
                        Quotations
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, margin: '0 0 4px 0' }}>
                        Quotation Requests
                    </h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                        Review and respond to buyer quotation requests.
                    </p>
                </div>

                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
                    {[
                        { label: 'Total Requests', value: rfqs.length, icon: 'fa-file-lines', color: '#6366f1', bg: '#eef2ff' },
                        { label: 'Pending', value: pending.length, icon: 'fa-clock', color: '#f59e0b', bg: '#fffbeb' },
                        { label: 'Responded', value: past.length, icon: 'fa-check-double', color: '#10b981', bg: '#ecfdf5' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14,
                            border: '1px solid #f3f4f6', padding: '20px 22px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 12,
                            }}>
                                <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 14 }} />
                            </div>
                            <div style={{ fontSize: 24, fontWeight: 700, color: '#111827' }}>{s.value}</div>
                            <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 2 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Pending Section */}
                <div style={{ marginBottom: 36 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 16,
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className="fa-solid fa-clock" style={{ color: '#f59e0b', fontSize: 12 }} />
                        </div>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
                            Pending Requests
                        </h2>
                        <span style={{
                            background: '#fef3c7', color: '#92400e',
                            padding: '2px 8px', borderRadius: 10,
                            fontSize: 11, fontWeight: 700,
                        }}>
                            {pending.length}
                        </span>
                    </div>

                    {loading ? (
                        <div style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '48px 0', textAlign: 'center',
                        }}>
                            <div style={{
                                width: 32, height: 32, border: '3px solid #e5e7eb',
                                borderTopColor: '#6366f1', borderRadius: '50%',
                                animation: 'spin 0.6s linear infinite',
                                margin: '0 auto',
                            }} />
                        </div>
                    ) : pending.length === 0 ? (
                        <div style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '40px 24px', textAlign: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 12, background: '#f3f4f6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px',
                            }}>
                                <i className="fa-solid fa-inbox" style={{ fontSize: 20, color: '#9ca3af' }} />
                            </div>
                            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 2px 0', fontWeight: 500 }}>
                                No pending quotations
                            </p>
                            <p style={{ fontSize: 12, color: '#c4c8d0', margin: 0 }}>
                                New requests from buyers will appear here.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            {pending.map((r) => (
                                <div key={r.id} style={{
                                    background: '#fff', borderRadius: 14,
                                    border: '1px solid #f3f4f6',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                    overflow: 'hidden',
                                }}>
                                    {/* RFQ Header */}
                                    <div style={{
                                        padding: '18px 22px',
                                        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                                <div style={{
                                                    width: 38, height: 38, borderRadius: 10,
                                                    background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <i className="fa-solid fa-cube" style={{ color: '#6366f1', fontSize: 15 }} />
                                                </div>
                                                <div>
                                                    <h3 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>
                                                        {r.product_name}
                                                    </h3>
                                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>
                                                        RFQ-{r.id}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Details Row */}
                                            <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: 6,
                                                    padding: '6px 12px', borderRadius: 8,
                                                    background: '#f9fafb', fontSize: 12, color: '#6b7280',
                                                }}>
                                                    <i className="fa-solid fa-user" style={{ fontSize: 10, color: '#9ca3af' }} />
                                                    <span style={{ fontWeight: 600, color: '#374151' }}>{r.buyer_name}</span>
                                                </div>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: 6,
                                                    padding: '6px 12px', borderRadius: 8,
                                                    background: '#f9fafb', fontSize: 12, color: '#6b7280',
                                                }}>
                                                    <i className="fa-solid fa-boxes-stacked" style={{ fontSize: 10, color: '#9ca3af' }} />
                                                    Qty: <span style={{ fontWeight: 600, color: '#374151' }}>{r.quantity}</span>
                                                </div>
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', gap: 6,
                                                    padding: '6px 12px', borderRadius: 8,
                                                    background: '#f9fafb', fontSize: 12, color: '#6b7280',
                                                }}>
                                                    <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: 10, color: '#9ca3af' }} />
                                                    Expected: <span style={{ fontWeight: 600, color: '#374151' }}>{convertAndFormatINR(r.expected_price)}/unit</span>
                                                </div>
                                            </div>
                                        </div>
                                        <StatusBadge status={r.status} />
                                    </div>

                                    {/* Action Area */}
                                    <div style={{
                                        padding: '14px 22px',
                                        borderTop: '1px solid #f3f4f6', background: '#fafafa',
                                    }}>
                                        {respondForm.id === r.id ? (
                                            <form onSubmit={handleRespond} style={{
                                                background: '#fff', borderRadius: 12, padding: 20,
                                                border: '1px solid #e5e7eb',
                                            }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                                                    <div>
                                                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                            <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: 10, color: '#9ca3af' }} />
                                                            Your Price (per unit)
                                                        </label>
                                                        <input
                                                            type="number" step="0.01"
                                                            value={respondForm.price}
                                                            onChange={(e) => setRespondForm({ ...respondForm, price: e.target.value })}
                                                            onFocus={() => setFocusedField('price')}
                                                            onBlur={() => setFocusedField(null)}
                                                            required
                                                            style={getInputStyle('price')}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
                                                            <i className="fa-solid fa-message" style={{ fontSize: 10, color: '#9ca3af' }} />
                                                            Notes
                                                        </label>
                                                        <input
                                                            value={respondForm.notes}
                                                            onChange={(e) => setRespondForm({ ...respondForm, notes: e.target.value })}
                                                            onFocus={() => setFocusedField('notes')}
                                                            onBlur={() => setFocusedField(null)}
                                                            placeholder="Optional notes..."
                                                            style={getInputStyle('notes')}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                                    {[
                                                        { action: 'accepted', label: 'Accept', icon: 'fa-check', bg: '#10b981', hoverBg: '#059669' },
                                                        { action: 'revised', label: 'Revise', icon: 'fa-pen', bg: '#3b82f6', hoverBg: '#2563eb' },
                                                        { action: 'rejected', label: 'Reject', icon: 'fa-times', bg: '#ef4444', hoverBg: '#dc2626' },
                                                    ].map(btn => (
                                                        <button
                                                            key={btn.action}
                                                            type="submit"
                                                            onClick={() => setRespondForm({ ...respondForm, action: btn.action })}
                                                            onMouseEnter={() => setHoveredBtn(btn.action)}
                                                            onMouseLeave={() => setHoveredBtn(null)}
                                                            style={{
                                                                padding: '8px 16px', borderRadius: 8, border: 'none',
                                                                background: hoveredBtn === btn.action ? btn.hoverBg : btn.bg,
                                                                color: '#fff', fontSize: 12, fontWeight: 600,
                                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                                                                transition: 'all 0.15s',
                                                            }}
                                                        >
                                                            <i className={`fa-solid ${btn.icon}`} style={{ fontSize: 10 }} />
                                                            {btn.label}
                                                        </button>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => setRespondForm({ id: null, price: '', notes: '', action: '' })}
                                                        onMouseEnter={() => setHoveredBtn('cancel')}
                                                        onMouseLeave={() => setHoveredBtn(null)}
                                                        style={{
                                                            padding: '8px 16px', borderRadius: 8,
                                                            border: '1px solid #e5e7eb',
                                                            background: hoveredBtn === 'cancel' ? '#f3f4f6' : '#fff',
                                                            color: '#6b7280', fontSize: 12, fontWeight: 600,
                                                            cursor: 'pointer', marginLeft: 'auto',
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button
                                                onClick={() => setRespondForm({ id: r.id, price: r.expected_price.toString(), notes: '', action: '' })}
                                                onMouseEnter={() => setHoveredBtn(`respond-${r.id}`)}
                                                onMouseLeave={() => setHoveredBtn(null)}
                                                style={{
                                                    padding: '9px 20px', borderRadius: 10,
                                                    border: '1px solid #e0e7ff',
                                                    background: hoveredBtn === `respond-${r.id}` ? '#eef2ff' : '#fff',
                                                    color: '#6366f1', fontSize: 13, fontWeight: 600,
                                                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                                                    transition: 'all 0.15s',
                                                }}
                                            >
                                                <i className="fa-solid fa-reply" style={{ fontSize: 11 }} />
                                                Respond to Request
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past Section */}
                <div>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        marginBottom: 16,
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8,
                            background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className="fa-solid fa-check-double" style={{ color: '#10b981', fontSize: 12 }} />
                        </div>
                        <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>
                            Past Quotations
                        </h2>
                        <span style={{
                            background: '#d1fae5', color: '#065f46',
                            padding: '2px 8px', borderRadius: 10,
                            fontSize: 11, fontWeight: 700,
                        }}>
                            {past.length}
                        </span>
                    </div>

                    {past.length === 0 ? (
                        <div style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '40px 24px', textAlign: 'center',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{
                                width: 48, height: 48, borderRadius: 12, background: '#f3f4f6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 12px',
                            }}>
                                <i className="fa-solid fa-history" style={{ fontSize: 20, color: '#9ca3af' }} />
                            </div>
                            <p style={{ fontSize: 14, color: '#6b7280', margin: '0 0 2px 0', fontWeight: 500 }}>
                                No past quotations
                            </p>
                            <p style={{ fontSize: 12, color: '#c4c8d0', margin: 0 }}>
                                Responded quotations will be shown here.
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            background: '#fff', borderRadius: 14,
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            overflow: 'hidden',
                        }}>
                            {/* Table Header */}
                            <div style={{
                                display: 'grid', gridTemplateColumns: '2fr 1.5fr 0.7fr 1fr 0.8fr',
                                padding: '12px 22px', borderBottom: '1px solid #f3f4f6',
                                background: '#fafafa',
                            }}>
                                {['PRODUCT', 'BUYER', 'QTY', 'YOUR PRICE', 'STATUS'].map(h => (
                                    <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                        {h}
                                    </span>
                                ))}
                            </div>
                            {/* Rows */}
                            {past.map((r, i) => (
                                <div key={r.id} style={{
                                    display: 'grid', gridTemplateColumns: '2fr 1.5fr 0.7fr 1fr 0.8fr',
                                    padding: '14px 22px',
                                    borderBottom: i < past.length - 1 ? '1px solid #f9fafb' : 'none',
                                    alignItems: 'center',
                                    transition: 'background 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: '#f3f4f6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <i className="fa-solid fa-cube" style={{ color: '#6b7280', fontSize: 12 }} />
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{r.product_name}</span>
                                    </div>
                                    <span style={{ fontSize: 13, color: '#6b7280' }}>{r.buyer_name}</span>
                                    <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{r.quantity}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                                        {r.vendor_price ? convertAndFormatINR(r.vendor_price) : '—'}
                                    </span>
                                    <StatusBadge status={r.status} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}

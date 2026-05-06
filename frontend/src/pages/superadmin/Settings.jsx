import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

export default function SASettings() {
    const [commission, setCommission] = useState('5');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');
    const [saving, setSaving] = useState(false);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    useEffect(() => {
        api.get('/admin/commission')
            .then(res => { setCommission(res.data.commission_percentage.toString()); setLoading(false); })
            .catch(console.error);
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/commission', { commission_percentage: parseFloat(commission) });
            setMsg('Commission updated successfully!');
            setTimeout(() => setMsg(''), 4000);
        } catch (err) { console.error(err); }
        setSaving(false);
    };

    const commissionValue = parseFloat(commission) || 0;

    return (
        <Sidebar>
            <div style={{ maxWidth: 900, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-gear" style={{ fontSize: 11, marginRight: 6 }} />
                        Configuration
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>
                        Platform Settings
                    </h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Manage global platform configuration and parameters.</p>
                </div>

                {/* Success Toast */}
                {msg && (
                    <div style={{
                        marginBottom: 20, padding: '12px 16px', borderRadius: 12,
                        background: '#ecfdf5', border: '1px solid #a7f3d0',
                        display: 'flex', alignItems: 'center', gap: 10,
                        animation: 'fadeIn 0.3s ease-out',
                    }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 8, background: '#d1fae5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className="fa-solid fa-circle-check" style={{ fontSize: 13, color: '#10b981' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#065f46' }}>{msg}</span>
                    </div>
                )}

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 36, height: 36, border: '3px solid #e5e7eb',
                            borderTop: '3px solid #6366f1', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }`}</style>

                        {/* Commission Settings Card */}
                        <div style={{
                            background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                        }}>
                            {/* Card Header */}
                            <div style={{
                                padding: '20px 24px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 12,
                                        background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <i className="fa-solid fa-percent" style={{ fontSize: 15, color: '#6366f1' }} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
                                            Commission Rate
                                        </h2>
                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                            Platform fee charged on all orders
                                        </p>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
                                    background: '#ecfdf5', color: '#059669', textTransform: 'uppercase',
                                    letterSpacing: 0.5,
                                }}>
                                    <i className="fa-solid fa-circle" style={{ fontSize: 5, marginRight: 4, verticalAlign: 'middle' }} />
                                    Active
                                </span>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '24px' }}>
                                {/* Current Rate Display */}
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 24,
                                }}>
                                    <div style={{
                                        padding: '16px', borderRadius: 12, background: '#f9fafb', border: '1px solid #f3f4f6',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <i className="fa-solid fa-chart-pie" style={{ fontSize: 10, color: '#6366f1' }} />
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>Current Rate</span>
                                        </div>
                                        <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
                                            {commissionValue}%
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '16px', borderRadius: 12, background: '#f9fafb', border: '1px solid #f3f4f6',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <i className="fa-solid fa-calculator" style={{ fontSize: 10, color: '#f59e0b' }} />
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>Per $100 Order</span>
                                        </div>
                                        <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
                                            ${commissionValue.toFixed(2)}
                                        </p>
                                    </div>
                                    <div style={{
                                        padding: '16px', borderRadius: 12, background: '#f9fafb', border: '1px solid #f3f4f6',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                            <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: 10, color: '#10b981' }} />
                                            <span style={{ fontSize: 11, fontWeight: 600, color: '#6b7280' }}>Vendor Receives</span>
                                        </div>
                                        <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: 0 }}>
                                            ${(100 - commissionValue).toFixed(2)}
                                        </p>
                                    </div>
                                </div>

                                {/* Input Group */}
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                                        <i className="fa-solid fa-sliders" style={{ fontSize: 10, marginRight: 6, color: '#9ca3af' }} />
                                        Commission Percentage (%)
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="number" step="0.1" min="0" max="100"
                                            value={commission}
                                            onChange={(e) => setCommission(e.target.value)}
                                            style={{
                                                width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10,
                                                border: '1.5px solid #e5e7eb', fontSize: 14, fontWeight: 600,
                                                color: '#111827', outline: 'none', background: '#fff',
                                                transition: 'border-color 0.2s', boxSizing: 'border-box',
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                        />
                                        <span style={{
                                            position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                            fontSize: 14, fontWeight: 700, color: '#9ca3af',
                                        }}>%</span>
                                    </div>
                                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '6px 0 0 0' }}>
                                        Enter a value between 0 and 100. This will apply to all new orders.
                                    </p>
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    onMouseEnter={() => setHoveredBtn('save')}
                                    onMouseLeave={() => setHoveredBtn(null)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 8,
                                        padding: '11px 24px', borderRadius: 10, border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
                                        background: hoveredBtn === 'save' ? 'linear-gradient(135deg, #4f46e5, #4338ca)' : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                        color: '#fff', fontSize: 13, fontWeight: 600,
                                        boxShadow: '0 2px 8px rgba(99,102,241,0.25)',
                                        transition: 'all 0.2s', opacity: saving ? 0.7 : 1,
                                    }}
                                >
                                    <i className={saving ? 'fa-solid fa-spinner fa-spin' : 'fa-solid fa-check'} style={{ fontSize: 11 }} />
                                    {saving ? 'Saving…' : 'Save Commission Rate'}
                                </button>
                            </div>
                        </div>

                        {/* Info Cards Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                            {/* Platform Info */}
                            <div style={{
                                background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '16px 20px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'linear-gradient(135deg, #eff6ff, #dbeafe)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <i className="fa-solid fa-circle-info" style={{ fontSize: 13, color: '#3b82f6' }} />
                                    </div>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>
                                        Platform Info
                                    </h3>
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    {[
                                        { label: 'Platform', value: 'VenDora B2B', icon: 'fa-building', color: '#6366f1' },
                                        { label: 'Version', value: 'v1.0.0', icon: 'fa-code-branch', color: '#10b981' },
                                        { label: 'Environment', value: 'Production', icon: 'fa-server', color: '#f59e0b' },
                                    ].map((item, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px 0',
                                            borderBottom: i < 2 ? '1px solid #f9fafb' : 'none',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <i className={`fa-solid ${item.icon}`} style={{ fontSize: 10, color: item.color }} />
                                                <span style={{ fontSize: 12, color: '#6b7280' }}>{item.label}</span>
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#111827' }}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* System Status */}
                            <div style={{
                                background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                            }}>
                                <div style={{
                                    padding: '16px 20px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                                    display: 'flex', alignItems: 'center', gap: 10,
                                }}>
                                    <div style={{
                                        width: 32, height: 32, borderRadius: 8,
                                        background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <i className="fa-solid fa-heart-pulse" style={{ fontSize: 13, color: '#10b981' }} />
                                    </div>
                                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>
                                        System Status
                                    </h3>
                                </div>
                                <div style={{ padding: '16px 20px' }}>
                                    {[
                                        { label: 'API Server', status: 'Operational', color: '#10b981' },
                                        { label: 'Database', status: 'Operational', color: '#10b981' },
                                        { label: 'Auth Service', status: 'Operational', color: '#10b981' },
                                    ].map((item, i) => (
                                        <div key={i} style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '10px 0',
                                            borderBottom: i < 2 ? '1px solid #f9fafb' : 'none',
                                        }}>
                                            <span style={{ fontSize: 12, color: '#6b7280' }}>{item.label}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: item.color, display: 'inline-block' }} />
                                                <span style={{ fontSize: 11, fontWeight: 600, color: item.color }}>{item.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Gradient Banner */}
                        <div style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: 16, padding: '20px 24px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 4px 0' }}>
                                    <i className="fa-solid fa-shield-halved" style={{ fontSize: 12, marginRight: 8, opacity: 0.8 }} />
                                    Super Admin Access
                                </h3>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
                                    You have full platform management privileges. Changes take effect immediately.
                                </p>
                            </div>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: 'rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className="fa-solid fa-user-shield" style={{ fontSize: 16, color: '#fff' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

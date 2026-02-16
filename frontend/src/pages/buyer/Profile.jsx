import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

export default function BuyerProfile() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [msg, setMsg] = useState('');
    const [focusField, setFocusField] = useState(null);

    useEffect(() => {
        api.get('/users/me').then(res => { setProfile(res.data); setForm(res.data); }).catch(console.error);
    }, []);

    const handleSave = async () => {
        try {
            await api.put('/users/me', { name: form.name, address: form.address });
            setProfile({ ...profile, ...form });
            setEditing(false);
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); }
    };

    if (!profile) return (
        <Sidebar>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                <div style={{
                    width: 36, height: 36, border: '3px solid #e5e7eb',
                    borderTop: '3px solid #6366f1', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </Sidebar>
    );

    const initial = profile.name?.charAt(0)?.toUpperCase() || '?';

    const fields = [
        { label: 'Full Name', key: 'name', icon: 'fa-user', editable: true, type: 'text' },
        { label: 'Email Address', key: 'email', icon: 'fa-envelope', editable: false, type: 'text' },
        { label: 'Buyer ID', key: 'generated_id', icon: 'fa-fingerprint', editable: false, type: 'text' },
        { label: 'Shipping Address', key: 'address', icon: 'fa-location-dot', editable: true, type: 'textarea' },
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-user-gear" style={{ fontSize: 11, marginRight: 6 }} />
                        Account
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>My Profile</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Manage your account information and preferences.</p>
                </div>

                {/* Success Message */}
                {msg && (
                    <div style={{
                        marginBottom: 18, padding: '12px 16px', borderRadius: 12,
                        background: '#ecfdf5', border: '1px solid #a7f3d0',
                        display: 'flex', alignItems: 'center', gap: 8,
                    }}>
                        <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: 14 }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#065f46' }}>{msg}</span>
                    </div>
                )}

                {/* Profile Card */}
                <div style={{
                    background: '#fff', borderRadius: 18, overflow: 'hidden',
                    border: '1px solid #f3f4f6', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>

                    {/* Gradient Banner + Avatar */}
                    <div style={{
                        background: 'linear-gradient(135deg, #6366f1, #818cf8, #a78bfa)',
                        padding: '32px 28px 48px', position: 'relative',
                    }}>
                        {/* Decorative circles */}
                        <div style={{
                            position: 'absolute', top: -20, right: -20, width: 100, height: 100,
                            borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                        }} />
                        <div style={{
                            position: 'absolute', bottom: -10, left: 60, width: 60, height: 60,
                            borderRadius: '50%', background: 'rgba(255,255,255,0.05)',
                        }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <i className="fa-solid fa-building" style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Buyer Account
                            </span>
                        </div>
                    </div>

                    {/* Avatar (overlapping banner) */}
                    <div style={{ padding: '0 28px', marginTop: -36 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: 18, flexShrink: 0,
                                background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '4px solid #fff', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                            }}>
                                <span style={{ color: '#fff', fontWeight: 700, fontSize: 26 }}>{initial}</span>
                            </div>
                            <div style={{ paddingBottom: 6 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: 0 }}>{profile.name}</h2>
                                <span style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 4,
                                    fontSize: 11, fontWeight: 600, color: '#6366f1', background: '#eef2ff',
                                    padding: '3px 10px', borderRadius: 6, marginTop: 4,
                                    fontFamily: 'monospace',
                                }}>
                                    <i className="fa-solid fa-id-badge" style={{ fontSize: 10 }} />
                                    {profile.generated_id}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Info Sections */}
                    <div style={{ padding: '24px 28px 28px' }}>

                        {/* Section: Personal Information */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <div style={{
                                    width: 28, height: 28, borderRadius: 7, background: '#eef2ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-user" style={{ color: '#6366f1', fontSize: 11 }} />
                                </div>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Personal Information</h3>
                            </div>

                            <div style={{
                                background: '#fafbfc', borderRadius: 14, padding: '4px 0',
                                border: '1px solid #f3f4f6',
                            }}>
                                {fields.map((field, i) => (
                                    <div key={field.key} style={{
                                        padding: '14px 18px',
                                        borderBottom: i < fields.length - 1 ? '1px solid #f3f4f6' : 'none',
                                        display: 'flex', alignItems: editing && field.editable ? 'flex-start' : 'center',
                                        gap: 14,
                                    }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                                            background: '#fff', border: '1px solid #f3f4f6',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <i className={`fa-solid ${field.icon}`}
                                                style={{ fontSize: 12, color: field.editable ? '#6366f1' : '#9ca3af' }} />
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <label style={{
                                                fontSize: 11, fontWeight: 700, color: '#9ca3af',
                                                textTransform: 'uppercase', letterSpacing: 0.3,
                                                display: 'block', marginBottom: 4,
                                            }}>{field.label}</label>

                                            {editing && field.editable ? (
                                                field.type === 'textarea' ? (
                                                    <textarea
                                                        value={form[field.key] || ''}
                                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                                        onFocus={() => setFocusField(field.key)}
                                                        onBlur={() => setFocusField(null)}
                                                        style={{
                                                            width: '100%', padding: '10px 12px', borderRadius: 10,
                                                            border: `1.5px solid ${focusField === field.key ? '#818cf8' : '#e5e7eb'}`,
                                                            boxShadow: focusField === field.key ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                                                            fontSize: 13, outline: 'none', minHeight: 70, resize: 'none',
                                                            fontFamily: 'inherit', transition: 'all 0.15s',
                                                            background: '#fff', boxSizing: 'border-box', color: '#374151',
                                                        }}
                                                    />
                                                ) : (
                                                    <input
                                                        value={form[field.key] || ''}
                                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                                        onFocus={() => setFocusField(field.key)}
                                                        onBlur={() => setFocusField(null)}
                                                        style={{
                                                            width: '100%', padding: '10px 12px', borderRadius: 10,
                                                            border: `1.5px solid ${focusField === field.key ? '#818cf8' : '#e5e7eb'}`,
                                                            boxShadow: focusField === field.key ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                                                            fontSize: 13, outline: 'none', fontFamily: 'inherit',
                                                            transition: 'all 0.15s', background: '#fff',
                                                            boxSizing: 'border-box', color: '#374151',
                                                        }}
                                                    />
                                                )
                                            ) : (
                                                <p style={{
                                                    fontSize: 14, fontWeight: 600, color: '#374151', margin: 0,
                                                    fontFamily: field.key === 'generated_id' ? 'monospace' : 'inherit',
                                                }}>
                                                    {profile[field.key] || '—'}
                                                    {!field.editable && (
                                                        <i className="fa-solid fa-lock" style={{ marginLeft: 6, fontSize: 9, color: '#d1d5db' }} />
                                                    )}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: 10 }}>
                            {editing ? (
                                <>
                                    <button onClick={() => { setEditing(false); setForm(profile); }} style={{
                                        padding: '11px 22px', borderRadius: 10,
                                        border: '1.5px solid #e5e7eb', background: '#fff',
                                        color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                    >Cancel</button>
                                    <button onClick={handleSave} style={{
                                        padding: '11px 22px', borderRadius: 10, border: 'none',
                                        background: 'linear-gradient(135deg, #10b981, #34d399)',
                                        color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        transition: 'opacity 0.15s',
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        <i className="fa-solid fa-check" style={{ fontSize: 11 }} />
                                        Save Changes
                                    </button>
                                </>
                            ) : (
                                <button onClick={() => setEditing(true)} style={{
                                    padding: '11px 22px', borderRadius: 10, border: 'none',
                                    background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                    color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    transition: 'opacity 0.15s',
                                }}
                                    onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                >
                                    <i className="fa-solid fa-pen" style={{ fontSize: 11 }} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Account Details Card */}
                <div style={{
                    background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '20px 24px', marginTop: 18,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 7, background: '#f5f3ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className="fa-solid fa-shield-halved" style={{ color: '#8b5cf6', fontSize: 11 }} />
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Account Security</h3>
                    </div>
                    <div style={{
                        background: '#fafbfc', borderRadius: 12, padding: '14px 18px',
                        border: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{
                                width: 34, height: 34, borderRadius: 9, background: '#fff', border: '1px solid #f3f4f6',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className="fa-solid fa-key" style={{ fontSize: 12, color: '#9ca3af' }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>Password</p>
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>••••••••••</p>
                            </div>
                        </div>
                        <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 500 }}>
                            <i className="fa-solid fa-lock" style={{ fontSize: 9, marginRight: 3 }} />
                            Managed by admin
                        </span>
                    </div>
                </div>

                {/* Account Type Card */}
                <div style={{
                    background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)', padding: '20px 24px', marginTop: 14,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                        <div style={{
                            width: 28, height: 28, borderRadius: 7, background: '#ecfdf5',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: 11 }} />
                        </div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Account Status</h3>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        {[
                            { label: 'Account Type', value: 'Buyer', icon: 'fa-tag', color: '#6366f1', bg: '#eef2ff' },
                            { label: 'Status', value: 'Active', icon: 'fa-circle-check', color: '#10b981', bg: '#ecfdf5' },
                            { label: 'Verified', value: profile.is_verified ? 'Yes' : 'Pending', icon: 'fa-badge-check', color: profile.is_verified ? '#10b981' : '#f59e0b', bg: profile.is_verified ? '#ecfdf5' : '#fffbeb' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                flex: 1, background: '#fafbfc', borderRadius: 12, padding: '14px 16px',
                                border: '1px solid #f3f4f6',
                            }}>
                                <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.3, margin: '0 0 6px 0' }}>{item.label}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        width: 22, height: 22, borderRadius: 6, background: item.bg,
                                    }}>
                                        <i className={`fa-solid ${item.icon}`} style={{ fontSize: 10, color: item.color }} />
                                    </span>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>{item.value}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </Sidebar>
    );
}

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: 10,
    border: '1px solid #e5e7eb', background: '#fafafa',
    fontSize: 14, color: '#111827', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
};

const focusStyle = {
    borderColor: '#a5b4fc', boxShadow: '0 0 0 3px rgba(99,102,241,0.08)', background: '#fff',
};

const labelStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, fontWeight: 600, color: '#9ca3af',
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3,
};

export default function AdminProfile() {
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [msg, setMsg] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    useEffect(() => {
        api.get('/users/me').then(res => {
            setProfile(res.data);
            setForm(res.data);
        }).catch(console.error);
    }, []);

    const handleSave = async () => {
        try {
            await api.put('/users/me', { name: form.name, address: form.address });
            setProfile({ ...profile, ...form });
            setEditing(false);
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) {
            console.error(err);
            setMsg('Failed to update profile.');
            setTimeout(() => setMsg(''), 3000);
        }
    };

    const getInputStyle = (field) => ({
        ...inputStyle,
        ...(focusedField === field ? focusStyle : {}),
    });

    if (!profile) return (
        <Sidebar>
            <div style={{ display: 'flex', justifyContent: 'center', padding: '96px 0' }}>
                <div style={{
                    width: 36, height: 36, border: '3px solid #e5e7eb',
                    borderTopColor: '#6366f1', borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        </Sidebar>
    );

    const initial = profile.name?.charAt(0)?.toUpperCase() || 'A';

    return (
        <Sidebar>
            <div style={{ maxWidth: 720, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20, marginBottom: 12,
                        background: '#eef2ff', color: '#6366f1', fontSize: 12, fontWeight: 600,
                    }}>
                        <i className="fa-solid fa-user-shield" style={{ fontSize: 10 }} />
                        Account
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, margin: '0 0 4px 0' }}>
                        My Profile
                    </h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                        Manage your admin account details and preferences.
                    </p>
                </div>

                {/* Success Toast */}
                {msg && (
                    <div style={{
                        marginBottom: 20, padding: '12px 18px',
                        background: msg.includes('Failed') ? '#fef2f2' : '#ecfdf5',
                        border: `1px solid ${msg.includes('Failed') ? '#fca5a5' : '#a7f3d0'}`,
                        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        <i className={`fa-solid ${msg.includes('Failed') ? 'fa-circle-xmark' : 'fa-circle-check'}`}
                            style={{ color: msg.includes('Failed') ? '#ef4444' : '#10b981', fontSize: 14 }} />
                        <span style={{ fontSize: 13, color: msg.includes('Failed') ? '#991b1b' : '#065f46', fontWeight: 500 }}>{msg}</span>
                    </div>
                )}

                {/* Profile Card */}
                <div style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                }}>

                    {/* Gradient Banner with avatar + name inside */}
                    <div style={{
                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)',
                        padding: '24px 28px 22px',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        {/* Decorative dots */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                        {/* Avatar + Name row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 18, position: 'relative' }}>
                            <div style={{
                                width: 72, height: 72, borderRadius: 18, flexShrink: 0,
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid rgba(255,255,255,0.4)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                            }}>
                                <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{initial}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 6px 0', textShadow: '0 1px 3px rgba(0,0,0,0.15)' }}>
                                    {profile.name}
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 6,
                                        background: 'rgba(255,255,255,0.92)', fontSize: 11, fontWeight: 600,
                                        color: '#6b7280', fontFamily: 'monospace',
                                    }}>
                                        {profile.generated_id}
                                    </span>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 6,
                                        background: 'rgba(255,255,255,0.92)', fontSize: 11, fontWeight: 600,
                                        color: '#6366f1',
                                    }}>
                                        <i className="fa-solid fa-user-shield" style={{ fontSize: 9, marginRight: 4 }} />
                                        Admin
                                    </span>
                                </div>
                            </div>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    onMouseEnter={() => setHoveredBtn('edit')}
                                    onMouseLeave={() => setHoveredBtn(null)}
                                    style={{
                                        padding: '8px 18px', borderRadius: 10,
                                        border: '1.5px solid rgba(255,255,255,0.6)',
                                        background: hoveredBtn === 'edit' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                                        color: '#fff', fontSize: 13, fontWeight: 600,
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                                        transition: 'all 0.15s', backdropFilter: 'blur(4px)',
                                    }}
                                >
                                    <i className="fa-solid fa-pen" style={{ fontSize: 10 }} />
                                    Edit Profile
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div style={{ padding: '0 28px 28px 28px' }}>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#f3f4f6', margin: '20px 0 24px 0' }} />

                        {/* Personal Information */}
                        <div style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8,
                                    background: '#eef2ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-id-card" style={{ color: '#6366f1', fontSize: 12 }} />
                                </div>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Personal Information</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                                {/* Name */}
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-user" style={{ fontSize: 10 }} />
                                        Full Name
                                    </label>
                                    {editing ? (
                                        <input
                                            value={form.name || ''}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                            onFocus={() => setFocusedField('name')}
                                            onBlur={() => setFocusedField(null)}
                                            style={getInputStyle('name')}
                                        />
                                    ) : (
                                        <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0, padding: '10px 0' }}>{profile.name || '—'}</p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-envelope" style={{ fontSize: 10 }} />
                                        Email Address
                                    </label>
                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', margin: 0, padding: '10px 0' }}>
                                        {profile.email}
                                        <i className="fa-solid fa-lock" style={{ marginLeft: 6, fontSize: 9, color: '#d1d5db' }} />
                                    </p>
                                </div>

                                {/* Admin ID */}
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-fingerprint" style={{ fontSize: 10 }} />
                                        Admin ID
                                    </label>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', margin: 0, padding: '10px 0', fontFamily: 'monospace' }}>
                                        {profile.generated_id}
                                        <i className="fa-solid fa-lock" style={{ marginLeft: 6, fontSize: 9, color: '#d1d5db' }} />
                                    </p>
                                </div>

                                {/* Address */}
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-location-dot" style={{ fontSize: 10 }} />
                                        Address
                                    </label>
                                    {editing ? (
                                        <input
                                            value={form.address || ''}
                                            onChange={e => setForm({ ...form, address: e.target.value })}
                                            onFocus={() => setFocusedField('address')}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter your address"
                                            style={getInputStyle('address')}
                                        />
                                    ) : (
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', margin: 0, padding: '10px 0' }}>
                                            {profile.address || '—'}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#f3f4f6', margin: '0 0 24px 0' }} />

                        {/* Account Status */}
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8, background: '#ecfdf5',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: 12 }} />
                                </div>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Account Status</h3>
                            </div>
                            <div style={{ display: 'flex', gap: 12 }}>
                                {[
                                    { label: 'Account Type', value: 'Admin', icon: 'fa-user-shield', color: '#6366f1', bg: '#eef2ff' },
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

                        {/* Security Section */}
                        <div style={{ marginTop: 24 }}>
                            <div style={{ height: 1, background: '#f3f4f6', margin: '0 0 24px 0' }} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8, background: '#f5f3ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-shield-halved" style={{ color: '#8b5cf6', fontSize: 12 }} />
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
                                    Managed by super admin
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    {editing && (
                        <div style={{
                            padding: '18px 28px',
                            background: '#fafafa', borderTop: '1px solid #f3f4f6',
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                            <button
                                onClick={() => { setEditing(false); setForm(profile); }}
                                onMouseEnter={() => setHoveredBtn('cancel')}
                                onMouseLeave={() => setHoveredBtn(null)}
                                style={{
                                    padding: '10px 22px', borderRadius: 10,
                                    border: '1px solid #e5e7eb',
                                    background: hoveredBtn === 'cancel' ? '#f3f4f6' : '#fff',
                                    fontSize: 13, fontWeight: 600, color: '#6b7280',
                                    cursor: 'pointer', transition: 'all 0.15s',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                onMouseEnter={() => setHoveredBtn('save')}
                                onMouseLeave={() => setHoveredBtn(null)}
                                style={{
                                    flex: 1, padding: '10px 20px', borderRadius: 10,
                                    border: 'none',
                                    background: hoveredBtn === 'save'
                                        ? 'linear-gradient(135deg, #4f46e5, #4338ca)'
                                        : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: '#fff', fontSize: 13, fontWeight: 600,
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                                    transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    transform: hoveredBtn === 'save' ? 'translateY(-1px)' : 'none',
                                }}
                            >
                                <i className="fa-solid fa-check" style={{ fontSize: 11 }} />
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}

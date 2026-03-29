import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

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

export default function VendorProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [msg, setMsg] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    useEffect(() => {
        api.get('/users/me').then(res => { 
            console.log('Profile data loaded:', res.data);
            setProfile(res.data); 
            setForm(res.data); 
        }).catch(err => {
            console.error('Failed to load profile:', err);
            // Try alternative endpoint
            api.get('/users/profile').then(res => { 
                console.log('Profile data loaded (alternative):', res.data);
                setProfile(res.data); 
                setForm(res.data); 
            }).catch(err2 => {
                console.error('Failed to load profile (alternative):', err2);
            });
        });
    }, []);

    const handleSave = async () => {
        try {
            console.log('Saving profile:', form);
            await api.put('/users/me', { name: form.name, address: form.address, date_of_birth: form.date_of_birth });
            setProfile({ ...profile, ...form });
            setEditing(false);
            setMsg('Profile updated successfully!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { 
            console.error('Failed to save profile:', err);
            setMsg('Failed to update profile');
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
            </div>
        </Sidebar>
    );

    const initial = profile.name?.charAt(0)?.toUpperCase() || 'V';

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
                        <i className="fa-solid fa-user-gear" style={{ fontSize: 10 }} />
                        Account
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, margin: '0 0 4px 0' }}>
                        My Profile
                    </h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                        Manage your account details and preferences.
                    </p>
                </div>

                {/* Success Toast */}
                {msg && (
                    <div style={{
                        marginBottom: 20, padding: '12px 18px',
                        background: '#ecfdf5', border: '1px solid #a7f3d0',
                        borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                        <i className="fa-solid fa-circle-check" style={{ color: '#10b981', fontSize: 14 }} />
                        <span style={{ fontSize: 13, color: '#065f46', fontWeight: 500 }}>{msg}</span>
                    </div>
                )}

                {/* Profile Card */}
                <div style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                }}>

                    {/* Profile Banner */}
                    <div style={{
                        height: 100,
                        background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 50%, #a5b4fc 100%)',
                        position: 'relative',
                    }}>
                        {/* Decorative dots */}
                        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    </div>

                    {/* Avatar + Name Section */}
                    <div style={{ padding: '0 28px 24px 28px', marginTop: -40 }}>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, marginBottom: 20 }}>
                            <div style={{
                                width: 80, height: 80, borderRadius: 20,
                                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '4px solid #fff',
                                boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
                                flexShrink: 0,
                            }}>
                                <span style={{ color: '#fff', fontSize: 28, fontWeight: 700 }}>{initial}</span>
                            </div>
                            <div style={{ paddingBottom: 4 }}>
                                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 4px 0' }}>
                                    {profile.name}
                                </h2>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 6,
                                        background: '#f3f4f6', fontSize: 11, fontWeight: 600,
                                        color: '#6b7280', fontFamily: 'monospace',
                                    }}>
                                        {profile.generated_id}
                                    </span>
                                    <span style={{
                                        padding: '3px 10px', borderRadius: 6,
                                        background: '#eef2ff', fontSize: 11, fontWeight: 600,
                                        color: '#6366f1',
                                    }}>
                                        <i className="fa-solid fa-store" style={{ fontSize: 9, marginRight: 4 }} />
                                        Vendor
                                    </span>
                                </div>
                            </div>
                            <div style={{ marginLeft: 'auto', paddingBottom: 4 }}>
                                {!editing && (
                                    <button
                                        onClick={() => setEditing(true)}
                                        onMouseEnter={() => setHoveredBtn('edit')}
                                        onMouseLeave={() => setHoveredBtn(null)}
                                        style={{
                                            padding: '8px 18px', borderRadius: 10,
                                            border: '1px solid #e0e7ff',
                                            background: hoveredBtn === 'edit' ? '#eef2ff' : '#fff',
                                            color: '#6366f1', fontSize: 13, fontWeight: 600,
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7,
                                            transition: 'all 0.15s',
                                        }}
                                    >
                                        <i className="fa-solid fa-pen" style={{ fontSize: 10 }} />
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#f3f4f6', margin: '0 0 24px 0' }} />

                        {/* Personal Information Section */}
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
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', margin: 0, padding: '10px 0' }}>{profile.email}</p>
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-calendar" style={{ fontSize: 10 }} />
                                        Date of Birth
                                    </label>
                                    {editing ? (
                                        <input
                                            type="date"
                                            value={form.date_of_birth || ''}
                                            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
                                            onFocus={() => setFocusedField('dob')}
                                            onBlur={() => setFocusedField(null)}
                                            style={getInputStyle('dob')}
                                        />
                                    ) : (
                                        <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', margin: 0, padding: '10px 0' }}>{profile.date_of_birth || '—'}</p>
                                    )}
                                </div>

                                {/* Vendor ID */}
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-fingerprint" style={{ fontSize: 10 }} />
                                        Vendor ID
                                    </label>
                                    <p style={{
                                        fontSize: 13, fontWeight: 600, color: '#6b7280', margin: 0,
                                        padding: '10px 0', fontFamily: 'monospace',
                                    }}>
                                        {profile.generated_id}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#f3f4f6', margin: '0 0 24px 0' }} />

                        {/* Address Section */}
                        <div style={{ marginBottom: editing ? 0 : 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8,
                                    background: '#ecfdf5',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-location-dot" style={{ color: '#10b981', fontSize: 12 }} />
                                </div>
                                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Business Address</h3>
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <i className="fa-solid fa-building" style={{ fontSize: 10 }} />
                                    Address
                                </label>
                                {editing ? (
                                    <input
                                        value={form.address || ''}
                                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                                        onFocus={() => setFocusedField('address')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="Enter your business address"
                                        style={getInputStyle('address')}
                                    />
                                ) : (
                                    <p style={{ fontSize: 14, fontWeight: 500, color: '#374151', margin: 0, padding: '10px 0' }}>
                                        {profile.address || '—'}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ID Proof */}
                        {profile.id_proof_path && (
                            <>
                                <div style={{ height: 1, background: '#f3f4f6', margin: '24px 0' }} />
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                        <div style={{
                                            width: 30, height: 30, borderRadius: 8,
                                            background: '#eff6ff',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <i className="fa-solid fa-shield-halved" style={{ color: '#3b82f6', fontSize: 12 }} />
                                        </div>
                                        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', margin: 0 }}>Verification</h3>
                                    </div>
                                    <a
                                        href={profile.id_proof_path}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 8,
                                            padding: '10px 16px', borderRadius: 10,
                                            background: '#f9fafb', border: '1px solid #e5e7eb',
                                            color: '#4f46e5', fontSize: 13, fontWeight: 600,
                                            textDecoration: 'none', transition: 'all 0.15s',
                                        }}
                                    >
                                        <i className="fa-solid fa-file-lines" style={{ fontSize: 12 }} />
                                        View ID Proof Document
                                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: 10, marginLeft: 4 }} />
                                    </a>
                                </div>
                            </>
                        )}
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

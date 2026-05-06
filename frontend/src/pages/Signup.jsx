import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
    const { role } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', address: '', date_of_birth: '', age: 0 });
    const [idProof, setIdProof] = useState(null);
    const [officialDoc, setOfficialDoc] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const roleLabel = role?.charAt(0).toUpperCase() + role?.slice(1);
    const roleIcon = { vendor: 'fa-store', buyer: 'fa-cart-shopping', admin: 'fa-shield-halved' }[role] || 'fa-user';
    const roleColor = { vendor: '#3b82f6', buyer: '#6366f1', admin: '#f59e0b' }[role] || '#6366f1';
    const roleColorBg = { vendor: '#eff6ff', buyer: '#f0f0ff', admin: '#fffbeb' }[role] || '#f0f0ff';

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(''); setLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('password', form.password);
            formData.append('role', role);
            formData.append('address', form.address);
            formData.append('date_of_birth', form.date_of_birth);
            formData.append('age', form.age || 0);
            if (idProof) formData.append('id_proof', idProof);
            if (officialDoc) formData.append('official_doc', officialDoc);

            const res = await api.post('/users/signup', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSuccess(res.data.message + ` Your ID: ${res.data.user_id}`);
            setTimeout(() => navigate(`/login/${role}`), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Signup failed');
        } finally { setLoading(false); }
    };

    const inputStyle = {
        width: '100%', padding: '12px 14px', borderRadius: 10,
        border: '1px solid #e5e7eb', fontSize: 14, color: '#111827',
        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
        background: '#fff', boxSizing: 'border-box',
    };

    const labelStyle = {
        display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6,
    };

    const onFocus = (e) => { e.target.style.borderColor = roleColor; e.target.style.boxShadow = `0 0 0 3px ${roleColor}15`; };
    const onBlur = (e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; };

    const benefits = [
        { icon: 'fa-solid fa-rocket', text: 'Get started in under 2 minutes' },
        { icon: 'fa-solid fa-shield-check', text: 'Enterprise-grade security' },
        { icon: 'fa-solid fa-handshake', text: 'Connect with verified partners' },
        { icon: 'fa-solid fa-headset', text: 'Dedicated support team' },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#f8f9fb' }}>

            {/* ──── Left Branding Panel ──── */}
            <div style={{
                width: 520, flexShrink: 0,
                background: 'linear-gradient(160deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '48px 48px', position: 'relative', overflow: 'hidden'
            }}>
                {/* Dot pattern */}
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.3,
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }} />
                {/* Gradient accent */}
                <div style={{
                    position: 'absolute', top: -120, right: -120, width: 400, height: 400,
                    background: `radial-gradient(circle, ${roleColor}20 0%, transparent 70%)`,
                    borderRadius: '50%'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Logo */}
                    <Link to="/" style={{
                        display: 'inline-flex', alignItems: 'center',
                        textDecoration: 'none', marginBottom: 72
                    }}>
                        <img src="/logoe.png" alt="VenDora" style={{ height: 36, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                    </Link>

                    {/* Headline */}
                    <h2 style={{
                        fontSize: 32, fontWeight: 700, color: '#fff',
                        lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 16
                    }}>
                        Join thousands of<br />businesses on VenDora
                    </h2>
                    <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 48 }}>
                        Create your account to start buying, selling, and managing your B2B operations seamlessly.
                    </p>

                    {/* Benefits list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {benefits.map((b, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: 'rgba(255,255,255,0.06)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <i className={b.icon} style={{ color: '#818cf8', fontSize: 12 }} />
                                </div>
                                <span style={{ fontSize: 14, color: '#cbd5e1' }}>{b.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom trust */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ display: 'flex' }}>
                            {[
                                { bg: 'linear-gradient(135deg, #3b82f6, #2563eb)', letter: 'A' },
                                { bg: 'linear-gradient(135deg, #10b981, #059669)', letter: 'B' },
                                { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', letter: 'C' },
                            ].map((avatar, i) => (
                                <div key={i} style={{
                                    width: 30, height: 30, borderRadius: '50%',
                                    background: avatar.bg, border: '2px solid #0f172a',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontSize: 10, fontWeight: 700,
                                    marginLeft: i > 0 ? -8 : 0
                                }}>
                                    {avatar.letter}
                                </div>
                            ))}
                        </div>
                        <span style={{ fontSize: 13, color: '#64748b' }}>500+ businesses trust VenDora</span>
                    </div>
                </div>
            </div>

            {/* ──── Right Form Panel ──── */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '48px 32px', overflowY: 'auto'
            }}>
                <div style={{ width: '100%', maxWidth: 440 }}>
                    {/* Role Icon + Header */}
                    <div style={{ marginBottom: 28 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: roleColorBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 20
                        }}>
                            <i className={`fa-solid ${roleIcon}`} style={{ color: roleColor, fontSize: 18 }} />
                        </div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: -0.3 }}>
                            {roleLabel} Sign Up
                        </h1>
                        <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 6 }}>
                            Create your account to get started.
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{
                            marginBottom: 20, padding: '12px 16px', borderRadius: 12,
                            background: '#fef2f2', border: '1px solid #fecaca',
                            display: 'flex', alignItems: 'flex-start', gap: 10
                        }}>
                            <i className="fa-solid fa-circle-exclamation" style={{ color: '#ef4444', marginTop: 2, fontSize: 14 }} />
                            <span style={{ fontSize: 14, color: '#b91c1c' }}>{error}</span>
                        </div>
                    )}

                    {/* Success */}
                    {success && (
                        <div style={{
                            marginBottom: 20, padding: '12px 16px', borderRadius: 12,
                            background: '#ecfdf5', border: '1px solid #a7f3d0',
                            display: 'flex', alignItems: 'flex-start', gap: 10
                        }}>
                            <i className="fa-solid fa-circle-check" style={{ color: '#10b981', marginTop: 2, fontSize: 14 }} />
                            <span style={{ fontSize: 14, color: '#065f46' }}>{success}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        {/* Name & Email row */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                            <div>
                                <label style={labelStyle}>Full Name</label>
                                <input
                                    name="name" value={form.name} onChange={handleChange} required
                                    placeholder="John Doe" style={inputStyle}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                            </div>
                            <div>
                                <label style={labelStyle}>Email</label>
                                <input
                                    name="email" type="email" value={form.email} onChange={handleChange} required
                                    placeholder="you@example.com" style={inputStyle}
                                    onFocus={onFocus} onBlur={onBlur}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Password</label>
                            <input
                                name="password" type="password" value={form.password} onChange={handleChange} required
                                placeholder="••••••••" style={inputStyle}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        {/* Address */}
                        <div style={{ marginBottom: 16 }}>
                            <label style={labelStyle}>Address</label>
                            <textarea
                                name="address" value={form.address} onChange={handleChange} rows={2}
                                placeholder="Your business address"
                                style={{ ...inputStyle, resize: 'none' }}
                                onFocus={onFocus} onBlur={onBlur}
                            />
                        </div>

                        {/* Conditional fields */}
                        {(role === 'vendor' || role === 'admin') && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Date of Birth</label>
                                <input
                                    name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange}
                                    style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                />
                            </div>
                        )}

                        {role === 'admin' && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Age</label>
                                <input
                                    name="age" type="number" value={form.age} onChange={handleChange}
                                    style={inputStyle} onFocus={onFocus} onBlur={onBlur}
                                />
                            </div>
                        )}

                        {role === 'vendor' && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>ID Proof Upload</label>
                                <div style={{
                                    border: '2px dashed #e5e7eb', borderRadius: 12, padding: '16px 20px',
                                    background: '#fafafa', cursor: 'pointer', transition: 'border-color 0.2s',
                                    display: 'flex', alignItems: 'center', gap: 12
                                }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10, background: '#f3f4f6',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#9ca3af', fontSize: 14 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {idProof ? (
                                            <p style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                                                <i className="fa-solid fa-file" style={{ marginRight: 6, color: roleColor, fontSize: 11 }} />
                                                {idProof.name}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: 13, color: '#9ca3af' }}>Choose a file or drag it here</p>
                                        )}
                                    </div>
                                    <input
                                        type="file" onChange={(e) => setIdProof(e.target.files[0])}
                                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                        id="id-proof-input"
                                    />
                                    <label htmlFor="id-proof-input" style={{
                                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                                        color: '#374151', background: '#f3f4f6', cursor: 'pointer',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        Browse
                                    </label>
                                </div>
                            </div>
                        )}

                        {role === 'admin' && (
                            <div style={{ marginBottom: 16 }}>
                                <label style={labelStyle}>Official Document Upload</label>
                                <div style={{
                                    border: '2px dashed #e5e7eb', borderRadius: 12, padding: '16px 20px',
                                    background: '#fafafa', cursor: 'pointer', transition: 'border-color 0.2s',
                                    display: 'flex', alignItems: 'center', gap: 12
                                }}>
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 10, background: '#f3f4f6',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                    }}>
                                        <i className="fa-solid fa-cloud-arrow-up" style={{ color: '#9ca3af', fontSize: 14 }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        {officialDoc ? (
                                            <p style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                                                <i className="fa-solid fa-file" style={{ marginRight: 6, color: roleColor, fontSize: 11 }} />
                                                {officialDoc.name}
                                            </p>
                                        ) : (
                                            <p style={{ fontSize: 13, color: '#9ca3af' }}>Choose a file or drag it here</p>
                                        )}
                                    </div>
                                    <input
                                        type="file" onChange={(e) => setOfficialDoc(e.target.files[0])}
                                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                        id="official-doc-input"
                                    />
                                    <label htmlFor="official-doc-input" style={{
                                        padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                                        color: '#374151', background: '#f3f4f6', cursor: 'pointer',
                                        border: '1px solid #e5e7eb'
                                    }}>
                                        Browse
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                            marginTop: 8,
                            background: loading ? '#a5b4fc' : `linear-gradient(135deg, ${roleColor}, ${roleColor}dd)`,
                            color: '#fff', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: `0 2px 8px ${roleColor}30`,
                            transition: 'opacity 0.2s, transform 0.1s', opacity: loading ? 0.7 : 1
                        }}>
                            {loading ? (
                                <>
                                    <div style={{
                                        width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: '#fff', borderRadius: '50%',
                                        animation: 'spin 0.6s linear infinite'
                                    }} />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer link */}
                    <p style={{ textAlign: 'center', fontSize: 14, color: '#9ca3af', marginTop: 28 }}>
                        Already have an account?{' '}
                        <Link to={`/login/${role}`} style={{ color: roleColor, fontWeight: 600, textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </p>

                    {/* Admin notice */}
                    {role === 'admin' && (
                        <div style={{
                            marginTop: 16, padding: '12px 16px', borderRadius: 12,
                            background: '#fffbeb', border: '1px solid #fde68a',
                            display: 'flex', alignItems: 'flex-start', gap: 10
                        }}>
                            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#d97706', marginTop: 2, fontSize: 13 }} />
                            <span style={{ fontSize: 13, color: '#92400e' }}>
                                Admin accounts require Super Admin approval before login.
                            </span>
                        </div>
                    )}

                    {/* Role switching */}
                    <div style={{
                        marginTop: 32, paddingTop: 24, borderTop: '1px solid #f3f4f6', textAlign: 'center'
                    }}>
                        <p style={{ fontSize: 12, color: '#d1d5db', marginBottom: 12 }}>Or sign up as</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                            {[
                                { r: 'vendor', label: 'Vendor', icon: 'fa-store', color: '#3b82f6', bg: '#eff6ff' },
                                { r: 'buyer', label: 'Buyer', icon: 'fa-cart-shopping', color: '#6366f1', bg: '#f0f0ff' },
                                { r: 'admin', label: 'Admin', icon: 'fa-shield-halved', color: '#f59e0b', bg: '#fffbeb' },
                            ].filter(x => x.r !== role).map(btn => (
                                <Link key={btn.r} to={`/signup/${btn.r}`} style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 6,
                                    padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                                    color: btn.color, background: btn.bg, textDecoration: 'none',
                                    transition: 'transform 0.2s'
                                }}>
                                    <i className={`fa-solid ${btn.icon}`} style={{ fontSize: 10 }} /> {btn.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

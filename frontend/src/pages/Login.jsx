import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const { role } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const roleLabel = role === 'super_admin' ? 'Super Admin' : role?.charAt(0).toUpperCase() + role?.slice(1);
    const roleIcon = { vendor: 'fa-store', buyer: 'fa-cart-shopping', admin: 'fa-shield-halved', super_admin: 'fa-crown' }[role] || 'fa-user';
    const roleColor = { vendor: '#3b82f6', buyer: '#6366f1', admin: '#f59e0b', super_admin: '#ef4444' }[role] || '#6366f1';
    const roleColorBg = { vendor: '#eff6ff', buyer: '#f0f0ff', admin: '#fffbeb', super_admin: '#fef2f2' }[role] || '#f0f0ff';
    const dashboardPath = { vendor: '/vendor', buyer: '/buyer', admin: '/admin', super_admin: '/superadmin' };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userData = await login(email, password, role);
            navigate(dashboardPath[userData.role] || '/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: 'fa-solid fa-shield-check', text: 'Enterprise-grade security' },
        { icon: 'fa-solid fa-bolt', text: 'Real-time order tracking' },
        { icon: 'fa-solid fa-chart-line', text: 'Analytics & insights' },
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
                {/* Dot pattern overlay */}
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
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        textDecoration: 'none', marginBottom: 72
                    }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: 12,
                            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <i className="fa-solid fa-store" style={{ color: '#fff', fontSize: 14 }} />
                        </div>
                        <span style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: -0.4 }}>VenDora</span>
                    </Link>

                    {/* Headline */}
                    <h2 style={{
                        fontSize: 32, fontWeight: 700, color: '#fff',
                        lineHeight: 1.2, letterSpacing: -0.5, marginBottom: 16
                    }}>
                        Streamline your<br />B2B procurement
                    </h2>
                    <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginBottom: 48 }}>
                        Connect with verified vendors, manage quotations, and scale your business operations on one platform.
                    </p>

                    {/* Feature list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {features.map((feat, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: 'rgba(255,255,255,0.06)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <i className={feat.icon} style={{ color: '#818cf8', fontSize: 12 }} />
                                </div>
                                <span style={{ fontSize: 14, color: '#cbd5e1' }}>{feat.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom trust indicator */}
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
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px'
            }}>
                <div style={{ width: '100%', maxWidth: 400 }}>
                    {/* Role Icon + Header */}
                    <div style={{ marginBottom: 32 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 14,
                            background: roleColorBg,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 20
                        }}>
                            <i className={`fa-solid ${roleIcon}`} style={{ color: roleColor, fontSize: 18 }} />
                        </div>
                        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#111827', letterSpacing: -0.3 }}>
                            {roleLabel} Login
                        </h1>
                        <p style={{ fontSize: 14, color: '#9ca3af', marginTop: 6 }}>
                            Enter your credentials to access your account.
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

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{
                                display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6
                            }}>
                                Email address
                            </label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                                placeholder="you@example.com"
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: 10,
                                    border: '1px solid #e5e7eb', fontSize: 14, color: '#111827',
                                    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                                    background: '#fff', boxSizing: 'border-box'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = roleColor; e.target.style.boxShadow = `0 0 0 3px ${roleColor}15`; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        <div style={{ marginBottom: 24 }}>
                            <label style={{
                                display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6
                            }}>
                                Password
                            </label>
                            <input
                                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                                placeholder="••••••••"
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: 10,
                                    border: '1px solid #e5e7eb', fontSize: 14, color: '#111827',
                                    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                                    background: '#fff', boxSizing: 'border-box'
                                }}
                                onFocus={(e) => { e.target.style.borderColor = roleColor; e.target.style.boxShadow = `0 0 0 3px ${roleColor}15`; }}
                                onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
                            />
                        </div>

                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
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
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer links */}
                    {role !== 'super_admin' && (
                        <p style={{ textAlign: 'center', fontSize: 14, color: '#9ca3af', marginTop: 32 }}>
                            Don't have an account?{' '}
                            <Link to={`/signup/${role}`} style={{
                                color: roleColor, fontWeight: 600, textDecoration: 'none'
                            }}>
                                Sign up
                            </Link>
                        </p>
                    )}

                    {role === 'admin' && (
                        <div style={{ textAlign: 'center', marginTop: 20 }}>
                            <Link to="/login/super_admin" style={{
                                fontSize: 12, color: '#d1d5db', textDecoration: 'none',
                                display: 'inline-flex', alignItems: 'center', gap: 4
                            }}>
                                Super Admin Login <i className="fa-solid fa-arrow-right" style={{ fontSize: 9 }} />
                            </Link>
                        </div>
                    )}

                    {/* Divider + other role links */}
                    <div style={{
                        marginTop: 40, paddingTop: 24, borderTop: '1px solid #f3f4f6', textAlign: 'center'
                    }}>
                        <p style={{ fontSize: 12, color: '#d1d5db', marginBottom: 12 }}>Or sign in as</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                            {[
                                { r: 'vendor', label: 'Vendor', icon: 'fa-store', color: '#3b82f6', bg: '#eff6ff' },
                                { r: 'buyer', label: 'Buyer', icon: 'fa-cart-shopping', color: '#6366f1', bg: '#f0f0ff' },
                                { r: 'admin', label: 'Admin', icon: 'fa-shield-halved', color: '#f59e0b', bg: '#fffbeb' },
                            ].filter(x => x.r !== role).map(btn => (
                                <Link key={btn.r} to={`/login/${btn.r}`} style={{
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

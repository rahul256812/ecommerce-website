import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { formatINR } from '../utils/currency';

export default function Landing() {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async (q = '') => {
        try {
            setLoading(true);
            const res = await api.get(`/products/?search=${q}`);
            setProducts(res.data.slice(0, 9));
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSearch = (e) => { e.preventDefault(); fetchProducts(search); };

    const dashboardLink = user ? {
        vendor: '/vendor', buyer: '/buyer', admin: '/admin', super_admin: '/superadmin'
    }[user.role] : null;

    const categoryIcons = {
        'Electronics': 'fa-solid fa-microchip',
        'Raw Materials': 'fa-solid fa-cubes',
        'Industrial': 'fa-solid fa-industry',
        'Office': 'fa-solid fa-chair',
        'Machinery': 'fa-solid fa-gears',
    };

    return (
        <div style={{ minHeight: '100vh', background: '#fff' }}>

            {/* ──── Navbar ──── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 50,
                background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(20px) saturate(180%)',
                borderBottom: '1px solid rgba(0,0,0,0.06)'
            }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '0 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64
                }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img src="/logos.png" alt="VenDora" style={{ height: 48, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                        <img src="/logoe.png" alt="VenDora" style={{ height: 24, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply', marginTop: 10 }} />
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {isAuthenticated && dashboardLink ? (
                            <>
                                <Link to={dashboardLink} style={{
                                    padding: '8px 16px', fontSize: 14, fontWeight: 500, color: '#6b7280',
                                    borderRadius: 8, textDecoration: 'none', transition: 'color 0.2s'
                                }}>
                                    <i className="fa-solid fa-grid-2" style={{ marginRight: 6, fontSize: 11 }} /> Dashboard
                                </Link>
                                <div style={{
                                    width: 34, height: 34, borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #818cf8, #6366f1)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#fff', fontWeight: 600, fontSize: 13
                                }}>
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/login/buyer" style={{
                                    padding: '8px 16px', fontSize: 14, fontWeight: 500, color: '#6b7280',
                                    borderRadius: 8, textDecoration: 'none'
                                }}>Sign In</Link>
                                <Link to="/signup/buyer" style={{
                                    padding: '9px 20px', fontSize: 14, fontWeight: 600, color: '#fff',
                                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: 10,
                                    textDecoration: 'none', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                                    display: 'inline-flex', alignItems: 'center', gap: 6
                                }}>
                                    Get Started <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* ──── Hero ──── */}
            <section style={{ position: 'relative', overflow: 'hidden' }}>
                {/* Background gradient blobs */}
                <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                    <div style={{
                        position: 'absolute', top: -100, left: -150, width: 600, height: 600,
                        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -100, right: -100, width: 500, height: 500,
                        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
                    }} />
                </div>

                <div style={{
                    maxWidth: 800, margin: '0 auto', padding: '80px 32px 60px', textAlign: 'center', position: 'relative'
                }}>
                    {/* Trust Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '6px 16px', borderRadius: 100,
                        background: '#f0f0ff', border: '1px solid #e0e0ff',
                        fontSize: 13, color: '#4f46e5', fontWeight: 500,
                        marginBottom: 32
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        Trusted by 500+ businesses worldwide
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800, color: '#111827',
                        lineHeight: 1.08, letterSpacing: -1.5, marginBottom: 20
                    }}>
                        B2B Procurement,{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                        }}>Reimagined</span>
                    </h1>

                    <p style={{
                        fontSize: 18, color: '#6b7280', lineHeight: 1.6,
                        maxWidth: 560, margin: '0 auto 40px'
                    }}>
                        Connect with verified vendors, request quotations, and streamline your entire procurement workflow on one powerful platform.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} style={{ maxWidth: 560, margin: '0 auto 28px' }}>
                        <div style={{
                            display: 'flex', borderRadius: 14, overflow: 'hidden',
                            border: '1px solid #e5e7eb', background: '#fff',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)'
                        }}>
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                <i className="fa-solid fa-magnifying-glass" style={{ padding: '0 0 0 18px', color: '#9ca3af', fontSize: 14 }} />
                                <input
                                    type="text"
                                    placeholder="Search products, categories, vendors..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        flex: 1, padding: '14px 16px', border: 'none', outline: 'none',
                                        fontSize: 14, color: '#374151', background: 'transparent'
                                    }}
                                />
                            </div>
                            <button type="submit" style={{
                                padding: '14px 24px', background: '#111827', color: '#fff',
                                border: 'none', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                                transition: 'background 0.2s'
                            }}>
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Portal Links */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { label: 'Vendor Portal', path: '/login/vendor', icon: 'fa-solid fa-store', bg: '#eff6ff', color: '#1d4ed8', border: '#dbeafe' },
                            { label: 'Buyer Portal', path: '/login/buyer', icon: 'fa-solid fa-cart-shopping', bg: '#ecfdf5', color: '#047857', border: '#d1fae5' },
                            { label: 'Admin Console', path: '/login/admin', icon: 'fa-solid fa-shield-halved', bg: '#fffbeb', color: '#b45309', border: '#fef3c7' },
                        ].map((btn) => (
                            <Link key={btn.path} to={btn.path} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                                background: btn.bg, color: btn.color, border: `1px solid ${btn.border}`,
                                textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s'
                            }}>
                                <i className={btn.icon} style={{ fontSize: 11 }} /> {btn.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── Stats Bar ──── */}
            <section style={{ borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', background: '#fafafa' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', padding: '48px 32px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
                        {[
                            { value: '500+', label: 'Active Businesses', icon: 'fa-solid fa-building', color: '#6366f1' },
                            { value: '10K+', label: 'Products Listed', icon: 'fa-solid fa-cubes', color: '#8b5cf6' },
                            { value: '2K+', label: 'RFQs Processed', icon: 'fa-solid fa-clipboard-check', color: '#06b6d4' },
                            { value: '99%', label: 'Satisfaction Rate', icon: 'fa-solid fa-star', color: '#f59e0b' },
                        ].map((stat, i) => (
                            <div key={i} style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: '#fff', border: '1px solid #f0f0f0',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 12px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                                }}>
                                    <i className={stat.icon} style={{ color: stat.color, fontSize: 16 }} />
                                </div>
                                <p style={{ fontSize: 30, fontWeight: 800, color: '#111827', letterSpacing: -1 }}>{stat.value}</p>
                                <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── Featured Products ──── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 32px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40 }}>
                    <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 }}>
                            Marketplace
                        </p>
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5 }}>Featured Products</h2>
                        <p style={{ color: '#9ca3af', marginTop: 8, fontSize: 15 }}>Discover quality products from verified vendors.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {isAuthenticated && user?.role === 'buyer' && (
                            <Link to="/buyer/products" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                                color: '#374151', border: '1px solid #e5e7eb', background: '#fff',
                                textDecoration: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                            }}>
                                Browse All <i className="fa-solid fa-arrow-right" style={{ fontSize: 10 }} />
                            </Link>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div className="spinner" />
                    </div>
                ) : products.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '80px 32px',
                        background: '#fafafa', borderRadius: 16, border: '1px solid #f3f4f6'
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
                        }}>
                            <i className="fa-solid fa-cubes" style={{ fontSize: 22, color: '#d1d5db' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 6 }}>No products listed yet</h3>
                        <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 20 }}>Be the first vendor to list products!</p>
                        <Link to="/signup/vendor" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '10px 20px', borderRadius: 10, fontSize: 14, fontWeight: 600,
                            color: '#fff', background: '#6366f1', textDecoration: 'none'
                        }}>
                            Start Selling <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 24 }}>
                        {products.map((product, i) => (
                            <div key={product.id} style={{
                                background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0',
                                overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
                                cursor: 'pointer'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                {/* Product Image */}
                                <div style={{
                                    height: 180, background: 'linear-gradient(135deg, #f8f9fa, #f0f0f5)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} style={{
                                            width: '100%', height: '100%', objectFit: 'cover'
                                        }} />
                                    ) : (
                                        <i className={categoryIcons[product.category] || 'fa-solid fa-box'} style={{
                                            fontSize: 36, color: '#d1d5db'
                                        }} />
                                    )}
                                    {product.discount > 0 && (
                                        <span style={{
                                            position: 'absolute', top: 12, right: 12,
                                            background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 700,
                                            padding: '4px 10px', borderRadius: 8
                                        }}>
                                            -{product.discount}%
                                        </span>
                                    )}
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '20px 20px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                                        <span style={{
                                            fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                                            background: '#f0f0ff', color: '#6366f1'
                                        }}>{product.category}</span>
                                        {product.quantity < 10 && product.quantity > 0 && (
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 6,
                                                background: '#fffbeb', color: '#d97706'
                                            }}>Low Stock</span>
                                        )}
                                    </div>

                                    <h3 style={{
                                        fontSize: 15, fontWeight: 600, color: '#111827', marginBottom: 4,
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>{product.name}</h3>

                                    <p style={{
                                        fontSize: 13, color: '#9ca3af', marginBottom: 16, lineHeight: 1.5,
                                        overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'
                                    }}>{product.description || 'No description available'}</p>

                                    {/* Price */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                            {product.discount > 0 ? (
                                                <>
                                                    <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
                                                        {formatINR(product.price * (1 - product.discount / 100))}
                                                    </span>
                                                    <span style={{ fontSize: 13, color: '#d1d5db', textDecoration: 'line-through' }}>
                                                        {formatINR(product.price)}
                                                    </span>
                                                </>
                                            ) : (
                                                <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
                                                    {formatINR(product.price)}
                                                </span>
                                            )}
                                        </div>
                                        <span style={{ fontSize: 12, color: '#d1d5db' }}>{product.quantity} in stock</span>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button
                                            onClick={() => isAuthenticated ? navigate('/buyer/products') : navigate('/login/buyer')}
                                            style={{
                                                flex: 1, padding: '10px 0', fontSize: 13, fontWeight: 600,
                                                color: '#fff', background: '#111827', border: 'none', borderRadius: 10,
                                                cursor: 'pointer', transition: 'background 0.2s'
                                            }}
                                        >
                                            <i className="fa-solid fa-cart-plus" style={{ marginRight: 6, fontSize: 11 }} />
                                            Add to Cart
                                        </button>
                                        <button
                                            onClick={() => isAuthenticated ? navigate('/buyer/products') : navigate('/login/buyer')}
                                            style={{
                                                padding: '10px 16px', fontSize: 13, fontWeight: 500,
                                                color: '#6b7280', background: '#f3f4f6', border: 'none', borderRadius: 10,
                                                cursor: 'pointer', transition: 'background 0.2s'
                                            }}
                                        >
                                            <i className="fa-solid fa-file-lines" style={{ marginRight: 4, fontSize: 11 }} />
                                            RFQ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ──── Why VenDora ──── */}
            <section style={{ background: '#fafafa', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 32px' }}>
                    <div style={{ textAlign: 'center', marginBottom: 56 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                            Why VenDora
                        </p>
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, marginBottom: 10 }}>
                            Built for Modern B2B Commerce
                        </h2>
                        <p style={{ color: '#9ca3af', maxWidth: 480, margin: '0 auto', fontSize: 15 }}>
                            Everything you need to scale your procurement operations, in one platform.
                        </p>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                        {[
                            { icon: 'fa-solid fa-clipboard-list', title: 'Smart RFQ System', desc: 'Request quotes, negotiate prices, and accept the best offers — all in one streamlined workflow.', color: '#6366f1', bg: '#f0f0ff' },
                            { icon: 'fa-solid fa-lock', title: 'Role-Based Access', desc: 'Separate dashboards for vendors, buyers, and admins with enterprise-grade security.', color: '#06b6d4', bg: '#ecfeff' },
                            { icon: 'fa-solid fa-chart-line', title: 'Real-time Analytics', desc: 'Track orders, monitor quotations, and gain actionable insights from your data.', color: '#8b5cf6', bg: '#f5f3ff' },
                        ].map((feat, i) => (
                            <div key={i} style={{
                                background: '#fff', borderRadius: 16, padding: 32,
                                border: '1px solid #f0f0f0', transition: 'transform 0.2s, box-shadow 0.2s'
                            }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.06)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                            >
                                <div style={{
                                    width: 48, height: 48, borderRadius: 12,
                                    background: feat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 20
                                }}>
                                    <i className={feat.icon} style={{ color: feat.color, fontSize: 18 }} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 8 }}>{feat.title}</h3>
                                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6 }}>{feat.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ──── How It Works ──── */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 32px' }}>
                <div style={{ textAlign: 'center', marginBottom: 56 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#6366f1', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 8 }}>
                        How It Works
                    </p>
                    <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5 }}>
                        Get Started in Minutes
                    </h2>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40, position: 'relative' }}>
                    {/* Connecting line */}
                    <div style={{
                        position: 'absolute', top: 32, left: '20%', right: '20%', height: 2,
                        background: 'linear-gradient(90deg, #e5e7eb, #6366f1, #e5e7eb)', opacity: 0.4, zIndex: 0
                    }} />
                    {[
                        { step: '01', title: 'Create Account', desc: 'Sign up as a buyer or vendor in seconds. No credit card required.', icon: 'fa-solid fa-user-plus' },
                        { step: '02', title: 'Browse & Connect', desc: 'Explore products, send RFQs, or list your inventory on the marketplace.', icon: 'fa-solid fa-handshake' },
                        { step: '03', title: 'Transact Securely', desc: 'Place orders, track shipments, and manage payments — all in one place.', icon: 'fa-solid fa-shield-check' },
                    ].map((item, i) => (
                        <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                            <div style={{
                                width: 64, height: 64, borderRadius: 16,
                                background: i === 1 ? '#6366f1' : '#fff',
                                border: i === 1 ? 'none' : '2px solid #f0f0f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px', boxShadow: i === 1 ? '0 8px 24px rgba(99,102,241,0.25)' : '0 2px 8px rgba(0,0,0,0.04)'
                            }}>
                                <i className={item.icon} style={{ fontSize: 22, color: i === 1 ? '#fff' : '#6366f1' }} />
                            </div>
                            <span style={{ fontSize: 11, fontWeight: 700, color: '#6366f1', letterSpacing: 1 }}>{item.step}</span>
                            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '8px 0' }}>{item.title}</h3>
                            <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.6 }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ──── CTA ──── */}
            <section style={{ padding: '0 32px 80px' }}>
                <div style={{
                    maxWidth: 900, margin: '0 auto', borderRadius: 24,
                    background: 'linear-gradient(135deg, #111827, #1e293b)',
                    padding: '72px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden'
                }}>
                    {/* Subtle dot pattern */}
                    <div style={{
                        position: 'absolute', inset: 0, opacity: 0.4,
                        backgroundImage: `radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                    }} />
                    <div style={{ position: 'relative' }}>
                        <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: '#fff', marginBottom: 14, letterSpacing: -0.5 }}>
                            Ready to Transform Your Procurement?
                        </h2>
                        <p style={{ color: '#94a3b8', marginBottom: 36, fontSize: 16, maxWidth: 480, margin: '0 auto 36px' }}>
                            Join hundreds of businesses already using VenDora to streamline their B2B operations.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <Link to="/signup/buyer" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '14px 32px', background: '#fff', color: '#111827',
                                fontWeight: 600, borderRadius: 12, fontSize: 14,
                                textDecoration: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                transition: 'transform 0.2s, box-shadow 0.2s'
                            }}>
                                Start Buying <i className="fa-solid fa-arrow-right" style={{ fontSize: 12 }} />
                            </Link>
                            <Link to="/signup/vendor" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                padding: '14px 32px', background: 'rgba(255,255,255,0.08)', color: '#fff',
                                fontWeight: 600, borderRadius: 12, fontSize: 14,
                                border: '1px solid rgba(255,255,255,0.12)',
                                textDecoration: 'none', transition: 'background 0.2s'
                            }}>
                                Start Selling
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ──── Footer ──── */}
            <footer style={{ borderTop: '1px solid #f3f4f6' }}>
                <div style={{
                    maxWidth: 1200, margin: '0 auto', padding: '40px 32px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 16
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <img src="/logos.png" alt="VenDora" style={{ height: 28, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply' }} />
                        <img src="/logoe.png" alt="VenDora" style={{ height: 14, width: 'auto', objectFit: 'contain', mixBlendMode: 'multiply', marginTop: 6 }} />
                    </div>
                    <p style={{ fontSize: 13, color: '#9ca3af' }}>© 2026 VenDora. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy', 'Terms', 'Contact'].map(link => (
                            <a key={link} href="#" style={{ fontSize: 13, color: '#9ca3af', textDecoration: 'none', transition: 'color 0.2s' }}>
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}

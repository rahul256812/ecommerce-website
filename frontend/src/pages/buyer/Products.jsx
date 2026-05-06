import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../utils/currency';

const catMeta = {
    Electronics: { icon: 'fa-microchip', color: '#6366f1', bg: '#eef2ff' },
    Industrial: { icon: 'fa-industry', color: '#f59e0b', bg: '#fffbeb' },
    'Raw Materials': { icon: 'fa-cubes', color: '#10b981', bg: '#ecfdf5' },
    Office: { icon: 'fa-chair', color: '#8b5cf6', bg: '#f5f3ff' },
    default: { icon: 'fa-box', color: '#6b7280', bg: '#f9fafb' },
};

export default function BuyerProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [rfqModal, setRfqModal] = useState({ open: false, product: null });
    const [rfqForm, setRfqForm] = useState({ quantity: '', message: '' });
    const [hoveredCard, setHoveredCard] = useState(null);
    const [focusSearch, setFocusSearch] = useState(false);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async (q = '') => {
        try {
            setLoading(true);
            const res = await api.get(`/products/?search=${q}`);
            setProducts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleSearch = (e) => { e.preventDefault(); fetchProducts(search); };

    const addToCart = async (productId) => {
        try {
            await api.post('/cart/', { product_id: productId, quantity: 1 });
            alert('Added to cart!');
        } catch (err) { alert(err.response?.data?.detail || 'Failed to add'); }
    };

    const submitRfq = async () => {
        try {
            await api.post('/rfq/', {
                product_id: rfqModal.product.id,
                vendor_id: rfqModal.product.vendor_id,
                quantity: parseInt(rfqForm.quantity),
                expected_price: rfqModal.product.price
            });
            setRfqModal({ open: false, product: null });
            setRfqForm({ quantity: '', message: '' });
            alert('RFQ submitted!');
        } catch (err) {
            let errorMsg = 'Failed to submit RFQ';
            if (err.response?.data) {
                const data = err.response.data;
                if (typeof data === 'string') {
                    errorMsg = data;
                } else if (data.detail) {
                    errorMsg = data.detail;
                } else if (Array.isArray(data)) {
                    errorMsg = data.join(', ');
                } else if (typeof data === 'object') {
                    const values = Object.values(data);
                    if (values.length > 0) {
                        errorMsg = values.map(v => Array.isArray(v) ? v.join(', ') : String(v)).join(', ');
                    }
                }
            }
            alert(errorMsg);
        }
    };

    const cm = (cat) => catMeta[cat] || catMeta.default;
    const icons = ['fa-box', 'fa-wrench', 'fa-gear', 'fa-desktop', 'fa-microchip', 'fa-plug'];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-bag-shopping" style={{ fontSize: 11, marginRight: 6 }} />
                        Marketplace
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>Browse Products</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '8px 0 0 0' }}>
                        <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Discover quality products from verified vendors.</p>
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} style={{ marginBottom: 24 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center',
                        background: '#fff', borderRadius: 12,
                        border: `1.5px solid ${focusSearch ? '#818cf8' : '#e5e7eb'}`,
                        boxShadow: focusSearch ? '0 0 0 3px rgba(99,102,241,0.1)' : '0 1px 2px rgba(0,0,0,0.03)',
                        transition: 'all 0.15s', overflow: 'hidden',
                    }}>
                        <i className="fa-solid fa-magnifying-glass" style={{ color: '#9ca3af', fontSize: 13, paddingLeft: 16 }} />
                        <input
                            type="text" placeholder="Search by name, category, or vendor..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            onFocus={() => setFocusSearch(true)}
                            onBlur={() => setFocusSearch(false)}
                            style={{
                                flex: 1, padding: '12px 14px', border: 'none', outline: 'none',
                                fontSize: 13, color: '#374151', background: 'transparent',
                            }}
                        />
                        <button type="submit" style={{
                            padding: '10px 22px', margin: 4, borderRadius: 8, border: 'none',
                            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            transition: 'opacity 0.15s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            <i className="fa-solid fa-magnifying-glass" style={{ marginRight: 6, fontSize: 11 }} />
                            Search
                        </button>
                    </div>
                </form>

                {/* Product count */}
                {!loading && products.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>
                            Showing <span style={{ fontWeight: 600, color: '#374151' }}>{products.length}</span> product{products.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                )}

                {/* Products Grid */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 36, height: 36, border: '3px solid #e5e7eb',
                            borderTop: '3px solid #6366f1', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : products.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '72px 20px',
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <i className="fa-solid fa-cubes" style={{ fontSize: 22, color: '#9ca3af' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No products found</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Try adjusting your search or check back later.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                        {products.map((p, i) => {
                            const cat = cm(p.category);
                            const discountedPrice = p.discount > 0 ? (p.price * (1 - p.discount / 100)).toFixed(2) : null;
                            const isHovered = hoveredCard === i;
                            return (
                                <div key={p.id}
                                    onMouseEnter={() => setHoveredCard(i)}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        background: '#fff', borderRadius: 16, overflow: 'hidden',
                                        border: `1px solid ${isHovered ? '#e0e7ff' : '#f3f4f6'}`,
                                        boxShadow: isHovered ? '0 8px 24px rgba(99,102,241,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
                                        transition: 'all 0.2s', transform: isHovered ? 'translateY(-3px)' : 'none',
                                    }}
                                >
                                    {/* Image Area */}
                                    <div style={{
                                        height: 160, position: 'relative',
                                        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        overflow: 'hidden',
                                    }}>
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.name} style={{
                                                width: '100%', height: '100%', objectFit: 'cover',
                                                transition: 'transform 0.4s',
                                                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                            }} />
                                        ) : (
                                            <div style={{
                                                width: 56, height: 56, borderRadius: 14,
                                                background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <i className={`fa-solid ${cat.icon}`} style={{ color: cat.color, fontSize: 22 }} />
                                            </div>
                                        )}
                                        {p.discount > 0 && (
                                            <span style={{
                                                position: 'absolute', top: 10, right: 10,
                                                background: '#ef4444', color: '#fff', fontSize: 11,
                                                fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                                            }}>-{p.discount}%</span>
                                        )}
                                        {p.quantity < 10 && p.quantity > 0 && (
                                            <span style={{
                                                position: 'absolute', top: 10, left: 10,
                                                background: '#fef3c7', color: '#d97706', fontSize: 10,
                                                fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                                            }}>Low Stock</span>
                                        )}
                                        {p.quantity === 0 && (
                                            <span style={{
                                                position: 'absolute', top: 10, left: 10,
                                                background: '#fee2e2', color: '#dc2626', fontSize: 10,
                                                fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                                            }}>Out of Stock</span>
                                        )}
                                    </div>

                                    {/* Card Body */}
                                    <div style={{ padding: '16px 18px 18px' }}>
                                        {/* Category badge */}
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            padding: '3px 10px', borderRadius: 8,
                                            background: cat.bg, fontSize: 11, fontWeight: 600, color: cat.color,
                                            marginBottom: 8,
                                        }}>
                                            <i className={`fa-solid ${cat.icon}`} style={{ fontSize: 9 }} />
                                            {p.category}
                                        </span>

                                        {/* Product name */}
                                        <h3 style={{
                                            fontSize: 14, fontWeight: 600, color: '#111827',
                                            margin: '0 0 3px 0', overflow: 'hidden',
                                            textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                        }}>{p.name}</h3>

                                        {/* Vendor */}
                                        <p style={{ fontSize: 12, color: '#9ca3af', margin: '0 0 12px 0' }}>
                                            <i className="fa-solid fa-store" style={{ fontSize: 9, marginRight: 4 }} />
                                            {p.vendor_name || 'Vendor'}
                                        </p>

                                        {/* Price Row */}
                                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                                <span style={{ fontSize: 20, fontWeight: 700, color: '#111827' }}>
                                                    {formatINR(discountedPrice || p.price)}
                                                </span>
                                                {discountedPrice && (
                                                    <span style={{ fontSize: 12, color: '#d1d5db', textDecoration: 'line-through' }}>
                                                        {formatINR(p.price)}
                                                    </span>
                                                )}
                                            </div>
                                            <span style={{
                                                fontSize: 11, color: p.quantity < 10 ? '#f59e0b' : '#9ca3af', fontWeight: 500,
                                            }}>
                                                {p.quantity} in stock
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div style={{ display: 'flex', gap: 8 }}>
                                            <button onClick={() => addToCart(p.id)} disabled={p.quantity === 0}
                                                style={{
                                                    flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                                                    background: p.quantity === 0 ? '#e5e7eb' : 'linear-gradient(135deg, #6366f1, #818cf8)',
                                                    color: p.quantity === 0 ? '#9ca3af' : '#fff', fontSize: 12, fontWeight: 600,
                                                    cursor: p.quantity === 0 ? 'not-allowed' : 'pointer',
                                                    transition: 'opacity 0.15s',
                                                }}
                                                onMouseEnter={e => { if (p.quantity > 0) e.currentTarget.style.opacity = '0.9'; }}
                                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                            >
                                                <i className="fa-solid fa-cart-plus" style={{ marginRight: 5, fontSize: 11 }} />
                                                Add to Cart
                                            </button>
                                            <button onClick={() => setRfqModal({ open: true, product: p })}
                                                style={{
                                                    padding: '10px 16px', borderRadius: 10,
                                                    border: '1.5px solid #e5e7eb', background: '#fff',
                                                    color: '#374151', fontSize: 12, fontWeight: 600,
                                                    cursor: 'pointer', transition: 'all 0.15s',
                                                }}
                                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.color = '#6366f1'; }}
                                                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151'; }}
                                            >
                                                <i className="fa-solid fa-file-invoice" style={{ marginRight: 4, fontSize: 10 }} />
                                                RFQ
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* RFQ Modal */}
            {rfqModal.open && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
                }} onClick={() => setRfqModal({ open: false, product: null })}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'relative', background: '#fff', borderRadius: 18,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)', width: '100%', maxWidth: 440, padding: '28px 26px',
                    }} onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10,
                                    background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-file-invoice" style={{ color: '#6366f1', fontSize: 14 }} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Request for Quotation</h3>
                            </div>
                            <button onClick={() => setRfqModal({ open: false, product: null })} style={{
                                width: 32, height: 32, borderRadius: 8, border: 'none', background: '#f3f4f6',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#6b7280', transition: 'background 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                                onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                            >
                                <i className="fa-solid fa-xmark" style={{ fontSize: 13 }} />
                            </button>
                        </div>

                        {/* Product Info */}
                        <div style={{
                            padding: '12px 14px', borderRadius: 10, background: '#f9fafb',
                            border: '1px solid #f3f4f6', marginBottom: 18,
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: cm(rfqModal.product?.category).bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                            }}>
                                <i className={`fa-solid ${cm(rfqModal.product?.category).icon}`} style={{ color: cm(rfqModal.product?.category).color, fontSize: 15 }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{rfqModal.product?.name}</p>
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0 0' }}>
                                    {formatINR(rfqModal.product?.price)} · {rfqModal.product?.quantity} in stock
                                </p>
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div style={{ marginBottom: 12 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                <i className="fa-solid fa-hashtag" style={{ marginRight: 4, fontSize: 9 }} /> Quantity
                            </label>
                            <input type="number" value={rfqForm.quantity} onChange={e => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                                placeholder="Enter quantity" min="1"
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10, marginTop: 6,
                                    border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none',
                                    transition: 'border-color 0.15s', boxSizing: 'border-box',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#818cf8'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                <i className="fa-solid fa-message" style={{ marginRight: 4, fontSize: 9 }} /> Message (optional)
                            </label>
                            <textarea value={rfqForm.message} onChange={e => setRfqForm({ ...rfqForm, message: e.target.value })}
                                placeholder="Any special requirements..."
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10, marginTop: 6,
                                    border: '1.5px solid #e5e7eb', fontSize: 13, outline: 'none',
                                    minHeight: 80, resize: 'none', fontFamily: 'inherit',
                                    transition: 'border-color 0.15s', boxSizing: 'border-box',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = '#818cf8'}
                                onBlur={e => e.currentTarget.style.borderColor = '#e5e7eb'}
                            />
                        </div>

                        {/* Modal Actions */}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setRfqModal({ open: false, product: null })} style={{
                                flex: 1, padding: '11px 0', borderRadius: 10,
                                border: '1.5px solid #e5e7eb', background: '#fff',
                                color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={submitRfq} style={{
                                flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
                                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                transition: 'opacity 0.15s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <i className="fa-solid fa-paper-plane" style={{ marginRight: 5, fontSize: 11 }} />
                                Submit RFQ
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}

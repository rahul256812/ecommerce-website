import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { convertAndFormatINR, formatINR, convertToINR } from '../../utils/currency';

export default function BuyerCart() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutModal, setCheckoutModal] = useState(false);
    const [address, setAddress] = useState('');
    const [hoveredItem, setHoveredItem] = useState(null);
    const [focusAddr, setFocusAddr] = useState(false);
    const navigate = useNavigate();

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/cart/'); setItems(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateQty = async (itemId, qty) => {
        if (qty < 1) return;
        try {
            await api.put(`/cart/${itemId}`, { quantity: qty });
            setItems(items.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
        } catch (err) { console.error(err); }
    };

    const removeItem = async (itemId) => {
        try {
            await api.delete(`/cart/${itemId}`);
            setItems(items.filter(i => i.id !== itemId));
        } catch (err) { console.error(err); }
    };

    const checkout = async () => {
        try {
            await api.post('/orders/', { shipping_address: address });
            navigate('/buyer/orders');
        } catch (err) { alert(err.response?.data?.detail || 'Checkout failed'); }
    };

    const subtotal = items.reduce((sum, i) => {
        const price = i.product_price * (1 - (i.product_discount || 0) / 100);
        return sum + price * i.quantity;
    }, 0);

    const totalSaved = items.reduce((sum, i) => {
        if (!i.product_discount) return sum;
        return sum + (i.product_price * i.product_discount / 100) * i.quantity;
    }, 0);

    const productIcons = ['fa-microchip', 'fa-chair', 'fa-industry', 'fa-cubes', 'fa-box'];
    const productColors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981', '#6b7280'];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>

                {/* Page Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-cart-shopping" style={{ fontSize: 11, marginRight: 6 }} />
                        Shopping Cart
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>Your Cart</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                        {items.length} item{items.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 36, height: 36, border: '3px solid #e5e7eb',
                            borderTop: '3px solid #6366f1', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>

                    /* Empty State */
                ) : items.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '72px 20px',
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#eef2ff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px',
                        }}>
                            <i className="fa-solid fa-cart-shopping" style={{ fontSize: 22, color: '#6366f1' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>Your cart is empty</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 18px 0' }}>Browse products and add items to get started.</p>
                        <button onClick={() => navigate('/buyer/products')} style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '10px 22px', borderRadius: 10, border: 'none',
                            background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                        }}>
                            Browse Products <i className="fa-solid fa-arrow-right" style={{ fontSize: 11 }} />
                        </button>
                    </div>

                    /* Cart Content */
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>

                        {/* Cart Items */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {items.map((item, i) => {
                                const unitPrice = item.product_price * (1 - (item.product_discount || 0) / 100);
                                const lineTotal = unitPrice * item.quantity;
                                const isHovered = hoveredItem === i;
                                const iconIdx = i % productIcons.length;
                                return (
                                    <div key={item.id}
                                        onMouseEnter={() => setHoveredItem(i)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        style={{
                                            background: '#fff', borderRadius: 16, overflow: 'hidden',
                                            border: `1px solid ${isHovered ? '#e0e7ff' : '#f3f4f6'}`,
                                            boxShadow: isHovered ? '0 4px 16px rgba(99,102,241,0.06)' : '0 1px 3px rgba(0,0,0,0.04)',
                                            transition: 'all 0.2s', padding: '18px 20px',
                                            display: 'flex', alignItems: 'center', gap: 16,
                                        }}
                                    >
                                        {/* Product Image / Icon */}
                                        <div style={{
                                            width: 64, height: 64, borderRadius: 14, flexShrink: 0, overflow: 'hidden',
                                            background: item.product_image ? '#f3f4f6' : `${productColors[iconIdx]}11`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            {item.product_image ? (
                                                <img src={item.product_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <i className={`fa-solid ${productIcons[iconIdx]}`} style={{ color: productColors[iconIdx], fontSize: 22 }} />
                                            )}
                                        </div>

                                        {/* Product Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h3 style={{
                                                fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 3px 0',
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            }}>{item.product_name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                                                    {convertAndFormatINR(unitPrice)}
                                                </span>
                                                {item.product_discount > 0 && (
                                                    <>
                                                        <span style={{ fontSize: 12, color: '#d1d5db', textDecoration: 'line-through' }}>
                                                            {formatINR(convertToINR(item.product_price))}
                                                        </span>
                                                        <span style={{
                                                            fontSize: 10, fontWeight: 700, color: '#ef4444',
                                                            background: '#fef2f2', padding: '2px 6px', borderRadius: 6,
                                                        }}>-{item.product_discount}%</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 2,
                                            background: '#f9fafb', borderRadius: 10, padding: 3,
                                            border: '1px solid #f3f4f6',
                                        }}>
                                            <button onClick={() => updateQty(item.id, item.quantity - 1)} style={{
                                                width: 32, height: 32, borderRadius: 8, border: 'none',
                                                background: 'transparent', color: '#6b7280', fontSize: 14,
                                                fontWeight: 700, cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                transition: 'background 0.15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >−</button>
                                            <span style={{
                                                width: 36, textAlign: 'center', fontSize: 14,
                                                fontWeight: 700, color: '#111827',
                                            }}>{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, item.quantity + 1)} style={{
                                                width: 32, height: 32, borderRadius: 8, border: 'none',
                                                background: 'transparent', color: '#6b7280', fontSize: 14,
                                                fontWeight: 700, cursor: 'pointer', display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                transition: 'background 0.15s',
                                            }}
                                                onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >+</button>
                                        </div>

                                        {/* Line Total */}
                                        <div style={{ width: 100, textAlign: 'right' }}>
                                            <p style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>
                                                {convertAndFormatINR(lineTotal)}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button onClick={() => removeItem(item.id)} style={{
                                            width: 34, height: 34, borderRadius: 9, border: 'none',
                                            background: 'transparent', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#d1d5db', transition: 'all 0.15s', flexShrink: 0,
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#ef4444'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d1d5db'; }}
                                        >
                                            <i className="fa-solid fa-trash-can" style={{ fontSize: 13 }} />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary Sidebar */}
                        <div style={{
                            background: '#fff', borderRadius: 18, border: '1px solid #f3f4f6',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.04)', padding: '24px 22px',
                            position: 'sticky', top: 24,
                        }}>
                            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{
                                    width: 30, height: 30, borderRadius: 8, background: '#eef2ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-receipt" style={{ color: '#6366f1', fontSize: 12 }} />
                                </div>
                                Order Summary
                            </h3>

{/* Line items */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f3f4f6' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
<span style={{ color: '#6b7280' }}>Subtotal ({items.length} items)</span>
<span style={{ fontWeight: 600, color: '#374151' }}>{convertAndFormatINR(subtotal)}</span>
</div>
<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
<span style={{ color: '#6b7280' }}>Shipping</span>
<span style={{ fontWeight: 600, color: '#374151' }}>FREE</span>
</div>
{totalSaved > 0 && (
<div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
<span style={{ color: '#6b7280' }}>You save</span>
<span style={{ fontWeight: 600, color: '#ef4444' }}>{formatINR(convertToINR(totalSaved))}</span>
</div>
)}
</div>

{/* Total */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 }}>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>Total</span>
                                <span style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>{convertAndFormatINR(subtotal)}</span>
                            </div>

                            {/* Checkout Button */}
                            <button onClick={() => setCheckoutModal(true)} style={{
                                width: '100%', padding: '13px 0', borderRadius: 12, border: 'none',
                                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                                transition: 'opacity 0.15s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            }}
                                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <i className="fa-solid fa-lock" style={{ fontSize: 12 }} />
                                Proceed to Checkout
                            </button>

                            <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                                <i className="fa-solid fa-shield-halved" style={{ fontSize: 10 }} />
                                Secure & encrypted checkout
                            </p>

                            {/* Trust Badges */}
                            <div style={{
                                marginTop: 16, paddingTop: 16, borderTop: '1px solid #f3f4f6',
                                display: 'flex', justifyContent: 'center', gap: 16,
                            }}>
                                {[
                                    { icon: 'fa-truck-fast', label: 'Free Shipping' },
                                    { icon: 'fa-rotate-left', label: 'Easy Returns' },
                                    { icon: 'fa-headset', label: 'Support' },
                                ].map((t, i) => (
                                    <div key={i} style={{ textAlign: 'center' }}>
                                        <i className={`fa-solid ${t.icon}`} style={{ fontSize: 14, color: '#c7d2fe', display: 'block', marginBottom: 4 }} />
                                        <span style={{ fontSize: 10, color: '#9ca3af', fontWeight: 600 }}>{t.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            {checkoutModal && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
                }} onClick={() => setCheckoutModal(false)}>
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
                                    <i className="fa-solid fa-location-dot" style={{ color: '#6366f1', fontSize: 14 }} />
                                </div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>Shipping Address</h3>
                            </div>
                            <button onClick={() => setCheckoutModal(false)} style={{
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

                        {/* Order Quick Summary */}
                        <div style={{
                            padding: '12px 14px', borderRadius: 10, background: '#f9fafb',
                            border: '1px solid #f3f4f6', marginBottom: 18,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <span style={{ fontSize: 13, color: '#6b7280' }}>
                                <i className="fa-solid fa-bag-shopping" style={{ marginRight: 5, fontSize: 11 }} />
                                {items.length} item{items.length !== 1 ? 's' : ''}
                            </span>
                            <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{convertAndFormatINR(subtotal)}</span>
                        </div>

                        {/* Address Field */}
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                <i className="fa-solid fa-map-pin" style={{ marginRight: 4, fontSize: 9 }} /> Delivery Address
                            </label>
                            <textarea value={address} onChange={e => setAddress(e.target.value)}
                                placeholder="Enter your full shipping address..."
                                onFocus={() => setFocusAddr(true)}
                                onBlur={() => setFocusAddr(false)}
                                style={{
                                    width: '100%', padding: '12px 14px', borderRadius: 10, marginTop: 6,
                                    border: `1.5px solid ${focusAddr ? '#818cf8' : '#e5e7eb'}`,
                                    boxShadow: focusAddr ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                                    fontSize: 13, outline: 'none', minHeight: 90, resize: 'none',
                                    fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box',
                                    color: '#374151',
                                }}
                            />
                        </div>

                        {/* Modal Actions */}
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setCheckoutModal(false)} style={{
                                flex: 1, padding: '11px 0', borderRadius: 10,
                                border: '1.5px solid #e5e7eb', background: '#fff',
                                color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={checkout} disabled={!address.trim()} style={{
                                flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
                                background: address.trim() ? 'linear-gradient(135deg, #10b981, #34d399)' : '#e5e7eb',
                                color: address.trim() ? '#fff' : '#9ca3af', fontSize: 13, fontWeight: 600,
                                cursor: address.trim() ? 'pointer' : 'not-allowed',
                                transition: 'opacity 0.15s',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                            }}
                                onMouseEnter={e => { if (address.trim()) e.currentTarget.style.opacity = '0.9'; }}
                                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                                <i className="fa-solid fa-check" style={{ fontSize: 11 }} />
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}

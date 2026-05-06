import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import api from '../../api';
import { formatINR } from '../../utils/currency';

const categoryColors = {
    'Electronics': { bg: '#eef2ff', color: '#6366f1' },
    'Industrial': { bg: '#fef3c7', color: '#d97706' },
    'Raw Materials': { bg: '#ecfdf5', color: '#059669' },
    'Office': { bg: '#eff6ff', color: '#3b82f6' },
    'default': { bg: '#f3f4f6', color: '#6b7280' },
};

const categoryIcons = {
    'Electronics': 'fa-microchip',
    'Industrial': 'fa-industry',
    'Raw Materials': 'fa-cubes',
    'Office': 'fa-chair',
    'default': 'fa-box',
};

export default function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [editModal, setEditModal] = useState({ open: false, product: null });
    const [hoveredRow, setHoveredRow] = useState(null);
    const [addBtnHover, setAddBtnHover] = useState(false);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await api.get('/products/vendor/my');
            setProducts(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateQty = async (id, delta) => {
        const product = products.find(p => p.id === id);
        const newQty = Math.max(0, product.quantity + delta);
        try {
            await api.put(`/products/${id}`, { quantity: newQty });
            setProducts(products.map(p => p.id === id ? { ...p, quantity: newQty } : p));
        } catch (err) { console.error(err); }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/products/${deleteModal.id}`);
            setProducts(products.filter(p => p.id !== deleteModal.id));
            setDeleteModal({ open: false, id: null });
        } catch (err) { console.error(err); }
    };

    const handleEditField = async (id, field, value) => {
        try {
            const res = await api.put(`/products/${id}`, { [field]: value });
            console.log('Update successful:', res.data);
            setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
            alert('Product updated successfully!');
        } catch (err) {
            console.error('Update failed:', err.response?.data || err.message);
            alert('Failed to update product: ' + (err.response?.data?.detail || err.message));
        }
    };

    const totalValue = products.reduce((s, p) => s + p.price * p.quantity, 0);
    const totalStock = products.reduce((s, p) => s + p.quantity, 0);
    const lowStock = products.filter(p => p.quantity < 10).length;

    const getCat = (cat) => categoryColors[cat] || categoryColors.default;
    const getCatIcon = (cat) => categoryIcons[cat] || categoryIcons.default;

    return (
        <Sidebar>
            <div>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
                    <div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '5px 12px', borderRadius: 20, marginBottom: 12,
                            background: '#eef2ff', color: '#6366f1', fontSize: 12, fontWeight: 600,
                        }}>
                            <i className="fa-solid fa-cubes" style={{ fontSize: 10 }} />
                            Inventory
                        </div>
                        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, margin: '0 0 4px 0' }}>
                            My Products
                        </h1>
                        <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                            {products.length} product{products.length !== 1 ? 's' : ''} listed
                        </p>
                    </div>
                    <Link
                        to="/vendor/products/add"
                        onMouseEnter={() => setAddBtnHover(true)}
                        onMouseLeave={() => setAddBtnHover(false)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                            background: addBtnHover
                                ? 'linear-gradient(135deg, #4f46e5, #4338ca)'
                                : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            color: '#fff', textDecoration: 'none',
                            boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                            transition: 'all 0.2s ease',
                            transform: addBtnHover ? 'translateY(-1px)' : 'none',
                        }}
                    >
                        <i className="fa-solid fa-plus" style={{ fontSize: 11 }} /> Add Product
                    </Link>
                </div>

                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
                    {[
                        { label: 'Total Products', value: products.length, icon: 'fa-boxes-stacked', color: '#6366f1', bg: '#eef2ff' },
                        { label: 'Total Stock', value: totalStock.toLocaleString(), icon: 'fa-warehouse', color: '#3b82f6', bg: '#eff6ff' },
                        { label: 'Inventory Value', value: formatINR(totalValue), icon: 'fa-indian-rupee-sign', color: '#10b981', bg: '#ecfdf5' },
                        { label: 'Low Stock', value: lowStock, icon: 'fa-triangle-exclamation', color: lowStock > 0 ? '#f59e0b' : '#10b981', bg: lowStock > 0 ? '#fffbeb' : '#ecfdf5' },
                    ].map((s, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14, padding: '18px 20px',
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 10, background: s.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className={`fa-solid ${s.icon}`} style={{ color: s.color, fontSize: 14 }} />
                                </div>
                            </div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 2px 0', letterSpacing: -0.3 }}>{loading ? '—' : s.value}</p>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Products Table */}
                {loading ? (
                    <div style={{
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        padding: '80px 0',
                    }}>
                        <div style={{
                            width: 32, height: 32, border: '3px solid #e5e7eb',
                            borderTopColor: '#6366f1', borderRadius: '50%',
                            animation: 'spin 0.6s linear infinite',
                        }} />
                    </div>
                ) : products.length === 0 ? (
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '64px 32px',
                        border: '1px solid #f3f4f6', textAlign: 'center',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 16, background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px auto',
                        }}>
                            <i className="fa-solid fa-cubes" style={{ color: '#9ca3af', fontSize: 22 }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 6px 0' }}>No products yet</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px 0' }}>Add your first product to start selling.</p>
                        <Link to="/vendor/products/add" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff',
                            textDecoration: 'none', boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                        }}>
                            <i className="fa-solid fa-plus" style={{ fontSize: 11 }} /> Add Product
                        </Link>
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', borderRadius: 16, overflow: 'hidden',
                        border: '1px solid #f3f4f6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 140px 100px',
                            padding: '14px 24px', borderBottom: '1px solid #f3f4f6',
                            background: '#fafafa',
                        }}>
                            {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                                <div key={h} style={{
                                    fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
                                    letterSpacing: 0.8, color: '#9ca3af',
                                    textAlign: h === 'Actions' ? 'right' : 'left',
                                }}>{h}</div>
                            ))}
                        </div>

                        {/* Rows */}
                        {products.map((p, i) => {
                            const cat = getCat(p.category);
                            const catIcon = getCatIcon(p.category);
                            const isHovered = hoveredRow === i;
                            const isLowStock = p.quantity < 10;
                            return (
                                <div
                                    key={p.id}
                                    onMouseEnter={() => setHoveredRow(i)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 140px 100px',
                                        padding: '16px 24px', alignItems: 'center',
                                        borderBottom: i < products.length - 1 ? '1px solid #f9fafb' : 'none',
                                        background: isHovered ? '#fafbff' : '#fff',
                                        transition: 'background 0.15s ease',
                                    }}
                                >
                                    {/* Product */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <div style={{
                                            width: 42, height: 42, borderRadius: 10,
                                            background: cat.bg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {p.image_url ? (
                                                <img src={p.image_url} alt="" style={{
                                                    width: 42, height: 42, borderRadius: 10, objectFit: 'cover',
                                                }} />
                                            ) : (
                                                <i className={`fa-solid ${catIcon}`} style={{ color: cat.color, fontSize: 15 }} />
                                            )}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{p.name}</p>
                                            <p style={{ fontSize: 11, color: '#c4c8d0', margin: '2px 0 0 0' }}>ID: {p.id}</p>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <span style={{
                                            display: 'inline-flex', alignItems: 'center', gap: 5,
                                            padding: '4px 10px', borderRadius: 6,
                                            background: cat.bg, color: cat.color,
                                            fontSize: 11, fontWeight: 600,
                                        }}>
                                            <i className={`fa-solid ${catIcon}`} style={{ fontSize: 9 }} />
                                            {p.category}
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>
                                            {formatINR(p.price)}
                                        </span>
                                        {p.discount > 0 && (
                                            <span style={{
                                                fontSize: 11, fontWeight: 600, color: '#ef4444',
                                                padding: '2px 6px', borderRadius: 4,
                                                background: '#fef2f2',
                                            }}>
                                                -{p.discount}%
                                            </span>
                                        )}
                                    </div>

                                    {/* Stock */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <button onClick={() => updateQty(p.id, -1)} style={{
                                            width: 28, height: 28, borderRadius: 7,
                                            border: '1px solid #e5e7eb', background: '#fafafa',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#6b7280',
                                            transition: 'background 0.15s',
                                        }}>−</button>
                                        <span style={{
                                            width: 40, textAlign: 'center', fontSize: 14,
                                            fontWeight: 700,
                                            color: isLowStock ? '#f59e0b' : '#111827',
                                        }}>{p.quantity}</span>
                                        <button onClick={() => updateQty(p.id, 1)} style={{
                                            width: 28, height: 28, borderRadius: 7,
                                            border: '1px solid #e5e7eb', background: '#fafafa',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', fontSize: 13, fontWeight: 700, color: '#6b7280',
                                            transition: 'background 0.15s',
                                        }}>+</button>
                                        {isLowStock && (
                                            <i className="fa-solid fa-triangle-exclamation" style={{
                                                fontSize: 10, color: '#f59e0b', marginLeft: 4,
                                            }} />
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                        <button
                                            onClick={() => setEditModal({ open: true, product: p })}
                                            title="Edit product"
                                            style={{
                                                width: 32, height: 32, borderRadius: 8,
                                                border: '1px solid #e0e7ff', background: '#eef2ff',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}
                                        >
                                            <i className="fa-solid fa-pen" style={{ fontSize: 12, color: '#6366f1' }} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ open: true, id: p.id })}
                                            title="Delete product"
                                            style={{
                                                width: 32, height: 32, borderRadius: 8,
                                                border: '1px solid #fee2e2', background: '#fef2f2',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                cursor: 'pointer', transition: 'all 0.15s',
                                            }}
                                        >
                                            <i className="fa-solid fa-trash-can" style={{ fontSize: 12, color: '#ef4444' }} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Table Footer */}
                        <div style={{
                            padding: '14px 24px', background: '#fafafa',
                            borderTop: '1px solid #f3f4f6',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                Showing {products.length} product{products.length !== 1 ? 's' : ''}
                            </span>
                            <span style={{ fontSize: 12, color: '#9ca3af' }}>
                                Total inventory value: <strong style={{ color: '#374151' }}>{formatINR(totalValue)}</strong>
                            </span>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={handleDelete}
                title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." confirmText="Delete" danger />

            {/* Edit Modal */}
            {editModal.open && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
                }} onClick={() => setEditModal({ open: false, product: null })}>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }} />
                    <div style={{
                        position: 'relative', background: '#fff', borderRadius: 18,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)', width: '100%', maxWidth: 500, padding: '28px 26px',
                    }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Edit Product</h3>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Price</label>
                            <input
                                type="number" step="0.01"
                                defaultValue={editModal.product?.price}
                                onBlur={(e) => handleEditField(editModal.product.id, 'price', parseFloat(e.target.value))}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1.5px solid #e5e7eb', fontSize: 14,
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Discount (%)</label>
                            <input
                                type="number" step="0.1"
                                defaultValue={editModal.product?.discount}
                                onBlur={(e) => handleEditField(editModal.product.id, 'discount', parseFloat(e.target.value))}
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1.5px solid #e5e7eb', fontSize: 14,
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: 20 }}>
                            <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Image URL</label>
                            <input
                                type="text"
                                defaultValue={editModal.product?.image_url}
                                onBlur={(e) => handleEditField(editModal.product.id, 'image_url', e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                style={{
                                    width: '100%', padding: '10px 14px', borderRadius: 10,
                                    border: '1.5px solid #e5e7eb', fontSize: 14,
                                }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setEditModal({ open: false, product: null })} style={{
                                flex: 1, padding: '11px 0', borderRadius: 10,
                                border: '1.5px solid #e5e7eb', background: '#fff',
                                color: '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}>Cancel</button>
                            <button onClick={() => setEditModal({ open: false, product: null })} style={{
                                flex: 1, padding: '11px 0', borderRadius: 10, border: 'none',
                                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                                color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                            }}>Done</button>
                        </div>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}

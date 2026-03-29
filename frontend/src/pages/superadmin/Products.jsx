import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import api from '../../api';
import { convertAndFormatINR } from '../../utils/currency';

export default function SAProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredDel, setHoveredDel] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/admin/products'); setProducts(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/products/${deleteModal.id}`);
            setProducts(products.filter(p => p.id !== deleteModal.id));
            setDeleteModal({ open: false, id: null });
        } catch (err) { console.error(err); }
    };

    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const totalValue = products.reduce((s, p) => s + (p.price || 0) * (p.quantity || 0), 0);

    const productColors = [
        ['#6366f1', '#eef2ff'], ['#3b82f6', '#eff6ff'], ['#10b981', '#ecfdf5'],
        ['#f59e0b', '#fffbeb'], ['#ef4444', '#fef2f2'], ['#8b5cf6', '#f5f3ff'],
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-cubes" style={{ fontSize: 11, marginRight: 6 }} />
                        Inventory
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>All Products</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Manage all products across the platform.</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Total Products', value: products.length, icon: 'fa-cubes', color: '#6366f1', bg: '#eef2ff', sub: 'Listed items' },
                        { label: 'Categories', value: categories.length, icon: 'fa-tags', color: '#f59e0b', bg: '#fffbeb', sub: 'Product types' },
                        { label: 'Total Stock', value: products.reduce((s, p) => s + (p.quantity || 0), 0).toLocaleString(), icon: 'fa-warehouse', color: '#10b981', bg: '#ecfdf5', sub: 'Units available' },
                        { label: 'Inventory Value', value: convertAndFormatINR(totalValue), icon: 'fa-indian-rupee-sign', color: '#8b5cf6', bg: '#f5f3ff', sub: 'Estimated value' },
                    ].map((card, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, background: card.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                            }}>
                                <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: 14 }} />
                            </div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{card.value}</p>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 2px 0' }}>{card.label}</p>
                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Content */}
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
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                        }}>
                            <i className="fa-solid fa-cubes" style={{ fontSize: 22, color: '#d1d5db' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>No products</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Products will appear here once vendors start listing.</p>
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.7fr 0.7fr 0.6fr',
                            padding: '14px 20px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                        }}>
                            {['PRODUCT', 'VENDOR', 'CATEGORY', 'PRICE', 'STOCK', 'ACTIONS'].map(h => (
                                <span key={h} style={{
                                    fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5,
                                    textAlign: h === 'ACTIONS' ? 'right' : 'left',
                                }}>{h}</span>
                            ))}
                        </div>

                        {/* Table Rows */}
                        {products.map((p, i) => {
                            const [iconColor, iconBg] = productColors[i % productColors.length];
                            const lowStock = (p.quantity || 0) < 10;
                            return (
                                <div key={p.id}
                                    onMouseEnter={() => setHoveredRow(p.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '2fr 1fr 0.8fr 0.7fr 0.7fr 0.6fr',
                                        padding: '14px 20px', alignItems: 'center',
                                        borderBottom: i < products.length - 1 ? '1px solid #f9fafb' : 'none',
                                        background: hoveredRow === p.id ? '#f9fafb' : '#fff',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* Product */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 9, background: iconBg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            <i className="fa-solid fa-cube" style={{ fontSize: 12, color: iconColor }} />
                                        </div>
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {p.name}
                                            </p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>ID: {p.id}</p>
                                        </div>
                                    </div>

                                    {/* Vendor */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <div style={{
                                            width: 22, height: 22, borderRadius: 6, fontSize: 9, fontWeight: 700,
                                            background: '#d1fae5', color: '#10b981',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                        }}>
                                            {p.vendor_name?.charAt(0) || 'V'}
                                        </div>
                                        <span style={{ fontSize: 12, color: '#374151' }}>{p.vendor_name}</span>
                                    </div>

                                    {/* Category */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content',
                                        padding: '3px 9px', borderRadius: 6, fontSize: 10,
                                        fontWeight: 600, color: '#6366f1', background: '#eef2ff',
                                    }}>
                                        <i className="fa-solid fa-tag" style={{ fontSize: 7 }} />
                                        {p.category || 'General'}
                                    </span>

                                    {/* Price */}
                                    <div>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>
                                            {convertAndFormatINR(p.price)}
                                        </span>
                                        {p.discount > 0 && (
                                            <span style={{
                                                fontSize: 9, fontWeight: 700, color: '#ef4444', background: '#fef2f2',
                                                padding: '1px 5px', borderRadius: 4, marginLeft: 4,
                                            }}>
                                                -{p.discount}%
                                            </span>
                                        )}
                                    </div>

                                    {/* Stock */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <span style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: lowStock ? '#ef4444' : '#10b981',
                                            display: 'inline-block',
                                        }} />
                                        <span style={{
                                            fontSize: 13, fontWeight: 600,
                                            color: lowStock ? '#ef4444' : '#111827',
                                        }}>
                                            {p.quantity}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => setDeleteModal({ open: true, id: p.id })}
                                            onMouseEnter={() => setHoveredDel(p.id)}
                                            onMouseLeave={() => setHoveredDel(null)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                                                fontSize: 11, fontWeight: 600,
                                                background: hoveredDel === p.id ? '#fef2f2' : 'transparent',
                                                color: '#ef4444', transition: 'background 0.15s',
                                            }}
                                        >
                                            <i className="fa-solid fa-trash" style={{ fontSize: 9 }} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Table Footer */}
                        <div style={{
                            padding: '12px 20px', background: '#fafbfc', borderTop: '1px solid #f3f4f6',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                Showing {products.length} products
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Live data</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={handleDelete}
                title="Delete Product" message="Delete this product? This cannot be undone." confirmText="Delete" danger />
        </Sidebar>
    );
}

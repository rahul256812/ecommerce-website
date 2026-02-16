import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

const categories = ['General', 'Electronics', 'Clothing', 'Food', 'Industrial', 'Office', 'Raw Materials'];

const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1px solid #e5e7eb', background: '#fafafa',
    fontSize: 14, color: '#111827', outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
};

const inputFocusStyle = {
    borderColor: '#a5b4fc', boxShadow: '0 0 0 3px rgba(99,102,241,0.08)',
    background: '#fff',
};

const labelStyle = {
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 13, fontWeight: 600, color: '#374151',
    marginBottom: 6,
};

export default function AddProduct() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '', discount: '0', category: 'General', image_url: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [focusedField, setFocusedField] = useState(null);
    const [cancelHover, setCancelHover] = useState(false);
    const [submitHover, setSubmitHover] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await api.post('/products/', { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity), discount: parseFloat(form.discount) });
            navigate('/vendor/products');
        } catch (err) { setError(err.response?.data?.detail || 'Failed to create product'); }
        finally { setLoading(false); }
    };

    const getInputStyle = (field) => ({
        ...inputStyle,
        ...(focusedField === field ? inputFocusStyle : {}),
    });

    return (
        <Sidebar>
            <div style={{ maxWidth: 680, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20, marginBottom: 12,
                        background: '#eef2ff', color: '#6366f1', fontSize: 12, fontWeight: 600,
                    }}>
                        <i className="fa-solid fa-circle-plus" style={{ fontSize: 10 }} />
                        New Product
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, margin: '0 0 4px 0' }}>
                        Add New Product
                    </h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                        Fill in the details to list a new product on the marketplace.
                    </p>
                </div>

                {/* Form Card */}
                <div style={{
                    background: '#fff', borderRadius: 16,
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                    overflow: 'hidden',
                }}>
                    {/* Error Alert */}
                    {error && (
                        <div style={{
                            margin: '24px 28px 0 28px', padding: '12px 16px',
                            background: '#fef2f2', border: '1px solid #fee2e2',
                            borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                            <i className="fa-solid fa-circle-exclamation" style={{ color: '#ef4444', fontSize: 14 }} />
                            <span style={{ fontSize: 13, color: '#991b1b' }}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>

                        {/* Section: Basic Info */}
                        <div style={{ padding: '28px 28px 0 28px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                marginBottom: 20,
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: '#eef2ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-tag" style={{ color: '#6366f1', fontSize: 13 }} />
                                </div>
                                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Basic Information</h2>
                            </div>

                            <div style={{ marginBottom: 18 }}>
                                <label style={labelStyle}>
                                    <i className="fa-solid fa-font" style={{ fontSize: 11, color: '#9ca3af' }} />
                                    Product Name
                                </label>
                                <input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => setFocusedField(null)}
                                    required
                                    placeholder="e.g. Industrial Bolt Set M12"
                                    style={getInputStyle('name')}
                                />
                            </div>

                            <div style={{ marginBottom: 18 }}>
                                <label style={labelStyle}>
                                    <i className="fa-solid fa-align-left" style={{ fontSize: 11, color: '#9ca3af' }} />
                                    Description
                                </label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    onFocus={() => setFocusedField('desc')}
                                    onBlur={() => setFocusedField(null)}
                                    rows={3}
                                    placeholder="Describe your product features, specifications, and use cases..."
                                    style={{ ...getInputStyle('desc'), resize: 'none' }}
                                />
                            </div>

                            <div style={{ marginBottom: 0 }}>
                                <label style={labelStyle}>
                                    <i className="fa-solid fa-layer-group" style={{ fontSize: 11, color: '#9ca3af' }} />
                                    Category
                                </label>
                                <select
                                    value={form.category}
                                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                                    onFocus={() => setFocusedField('cat')}
                                    onBlur={() => setFocusedField(null)}
                                    style={{ ...getInputStyle('cat'), cursor: 'pointer', appearance: 'none', paddingRight: 36, backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: 16 }}
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#f3f4f6', margin: '24px 0' }} />

                        {/* Section: Pricing & Stock */}
                        <div style={{ padding: '0 28px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                marginBottom: 20,
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: '#ecfdf5',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-dollar-sign" style={{ color: '#10b981', fontSize: 13 }} />
                                </div>
                                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Pricing & Stock</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 0 }}>
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-dollar-sign" style={{ fontSize: 11, color: '#9ca3af' }} />
                                        Price
                                    </label>
                                    <input
                                        type="number" step="0.01"
                                        value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        onFocus={() => setFocusedField('price')}
                                        onBlur={() => setFocusedField(null)}
                                        required placeholder="0.00"
                                        style={getInputStyle('price')}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-boxes-stacked" style={{ fontSize: 11, color: '#9ca3af' }} />
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={form.quantity}
                                        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                                        onFocus={() => setFocusedField('qty')}
                                        onBlur={() => setFocusedField(null)}
                                        required placeholder="0"
                                        style={getInputStyle('qty')}
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>
                                        <i className="fa-solid fa-percent" style={{ fontSize: 11, color: '#9ca3af' }} />
                                        Discount
                                    </label>
                                    <input
                                        type="number" step="0.1"
                                        value={form.discount}
                                        onChange={(e) => setForm({ ...form, discount: e.target.value })}
                                        onFocus={() => setFocusedField('disc')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder="0"
                                        style={getInputStyle('disc')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: '#f3f4f6', margin: '24px 0' }} />

                        {/* Section: Media */}
                        <div style={{ padding: '0 28px' }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                marginBottom: 20,
                            }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: '#eff6ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className="fa-solid fa-image" style={{ color: '#3b82f6', fontSize: 13 }} />
                                </div>
                                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>Media</h2>
                            </div>

                            <div>
                                <label style={labelStyle}>
                                    <i className="fa-solid fa-link" style={{ fontSize: 11, color: '#9ca3af' }} />
                                    Image URL <span style={{ fontWeight: 400, color: '#c4c8d0' }}>(optional)</span>
                                </label>
                                <input
                                    value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    onFocus={() => setFocusedField('img')}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="https://example.com/product-image.jpg"
                                    style={getInputStyle('img')}
                                />
                                {form.image_url && (
                                    <div style={{
                                        marginTop: 12, borderRadius: 10, overflow: 'hidden',
                                        border: '1px solid #f3f4f6', height: 120,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: '#fafafa',
                                    }}>
                                        <img
                                            src={form.image_url}
                                            alt="Preview"
                                            onError={(e) => { e.target.style.display = 'none'; }}
                                            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions Footer */}
                        <div style={{
                            padding: '20px 28px', marginTop: 24,
                            background: '#fafafa', borderTop: '1px solid #f3f4f6',
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                            <button
                                type="button"
                                onClick={() => navigate('/vendor/products')}
                                onMouseEnter={() => setCancelHover(true)}
                                onMouseLeave={() => setCancelHover(false)}
                                style={{
                                    padding: '10px 22px', borderRadius: 10,
                                    border: '1px solid #e5e7eb',
                                    background: cancelHover ? '#f3f4f6' : '#fff',
                                    fontSize: 13, fontWeight: 600, color: '#6b7280',
                                    cursor: 'pointer', transition: 'all 0.15s',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                onMouseEnter={() => setSubmitHover(true)}
                                onMouseLeave={() => setSubmitHover(false)}
                                style={{
                                    flex: 1, padding: '11px 20px', borderRadius: 10,
                                    border: 'none',
                                    background: loading ? '#a5b4fc'
                                        : submitHover ? 'linear-gradient(135deg, #4f46e5, #4338ca)'
                                            : 'linear-gradient(135deg, #6366f1, #4f46e5)',
                                    color: '#fff', fontSize: 13, fontWeight: 600,
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                                    transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    transform: submitHover && !loading ? 'translateY(-1px)' : 'none',
                                }}
                            >
                                {loading ? (
                                    <>
                                        <div style={{
                                            width: 16, height: 16,
                                            border: '2px solid rgba(255,255,255,0.3)',
                                            borderTopColor: '#fff', borderRadius: '50%',
                                            animation: 'spin 0.6s linear infinite',
                                        }} />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-plus" style={{ fontSize: 11 }} />
                                        Create Product
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidebar>
    );
}

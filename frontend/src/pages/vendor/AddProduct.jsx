import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

const categories = ['General', 'Electronics', 'Clothing', 'Food', 'Industrial', 'Office', 'Raw Materials'];

export default function AddProduct() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '', discount: '0', category: 'General', image_url: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setLoading(true);
        try {
            await api.post('/products/', { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity), discount: parseFloat(form.discount) });
            navigate('/vendor/products');
        } catch (err) { setError(err.response?.data?.detail || 'Failed to create product'); }
        finally { setLoading(false); }
    };

    return (
        <Sidebar>
            <div className="max-w-2xl">
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-plus text-xs mr-1.5" />
                        New Product
                    </p>
                    <h1>Add New Product</h1>
                    <p>Fill in the details to list a new product.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    {error && (
                        <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 animate-scaleIn">
                            <i className="fa-solid fa-circle-exclamation text-red-500 mt-0.5 text-sm" />
                            <span className="text-sm text-red-700">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="input-label">Product Name</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="input" placeholder="e.g. Industrial Bolt Set" />
                        </div>
                        <div>
                            <label className="input-label">Description</label>
                            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" placeholder="Describe your product..." />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Price ($)</label>
                                <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="input" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="input-label">Quantity</label>
                                <input type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required className="input" placeholder="0" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="input-label">Discount (%)</label>
                                <input type="number" step="0.1" value={form.discount} onChange={(e) => setForm({ ...form, discount: e.target.value })} className="input" placeholder="0" />
                            </div>
                            <div>
                                <label className="input-label">Category</label>
                                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Image URL (optional)</label>
                            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="input" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={() => navigate('/vendor/products')} className="btn-secondary py-2.5 px-5">Cancel</button>
                            <button type="submit" disabled={loading} className="btn-primary flex-1 py-2.5 disabled:opacity-60">
                                {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : <><i className="fa-solid fa-plus text-xs" /> Create Product</>}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Sidebar>
    );
}

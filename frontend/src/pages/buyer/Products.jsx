import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function BuyerProducts() {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [rfqModal, setRfqModal] = useState({ open: false, product: null });
    const [rfqForm, setRfqForm] = useState({ quantity: '', message: '' });

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
            await api.post('/cart/add', { product_id: productId, quantity: 1 });
            alert('Added to cart!');
        } catch (err) { alert(err.response?.data?.detail || 'Failed to add'); }
    };

    const submitRfq = async () => {
        try {
            await api.post('/rfq/', { product_id: rfqModal.product.id, quantity: parseInt(rfqForm.quantity), message: rfqForm.message });
            setRfqModal({ open: false, product: null });
            setRfqForm({ quantity: '', message: '' });
            alert('RFQ submitted!');
        } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
    };

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-bag-shopping text-xs mr-1.5" />
                        Marketplace
                    </p>
                    <h1>Browse Products</h1>
                    <p>Discover quality products from verified vendors.</p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="flex bg-white rounded-xl border border-gray-200 overflow-hidden focus-within:border-primary-300 focus-within:ring-2 focus-within:ring-primary-500/10 transition-all">
                        <div className="flex-1 flex items-center">
                            <i className="fa-solid fa-magnifying-glass pl-4 text-gray-400 text-sm" />
                            <input
                                type="text" placeholder="Search by name, category, or vendor..."
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="flex-1 px-3 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none"
                            />
                        </div>
                        <button type="submit" className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                            Search
                        </button>
                    </div>
                </form>

                {/* Products */}
                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-cubes" /></div>
                        <h3>No products found</h3>
                        <p>Try adjusting your search or check back later.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {products.map((p, i) => (
                            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover animate-fadeIn group" style={{ animationDelay: `${i * 40}ms` }}>
                                <div className="h-44 bg-gradient-to-br from-gray-50 to-gray-100/80 flex items-center justify-center overflow-hidden relative">
                                    {p.image_url ? (
                                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <i className={`fa-solid ${['fa-box', 'fa-wrench', 'fa-gear', 'fa-desktop', 'fa-microchip', 'fa-plug'][i % 6]} text-3xl text-gray-300`} />
                                    )}
                                    {p.discount > 0 && (
                                        <span className="absolute top-3 right-3 bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">-{p.discount}%</span>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="badge bg-primary-50 text-primary-700">{p.category}</span>
                                        {p.quantity < 10 && p.quantity > 0 && <span className="badge bg-amber-50 text-amber-700">Low Stock</span>}
                                        {p.quantity === 0 && <span className="badge bg-red-50 text-red-600">Out of Stock</span>}
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5 line-clamp-1">{p.name}</h3>
                                    <p className="text-xs text-gray-400 mb-3">by {p.vendor_name || 'Vendor'}</p>
                                    <div className="flex items-baseline justify-between mb-4">
                                        {p.discount > 0 ? (
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-lg font-bold text-gray-900">${(p.price * (1 - p.discount / 100)).toFixed(2)}</span>
                                                <span className="text-xs text-gray-400 line-through">${p.price.toFixed(2)}</span>
                                            </div>
                                        ) : (
                                            <span className="text-lg font-bold text-gray-900">${p.price.toFixed(2)}</span>
                                        )}
                                        <span className="text-xs text-gray-400">{p.quantity} in stock</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => addToCart(p.id)} disabled={p.quantity === 0}
                                            className="flex-1 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                                            <i className="fa-solid fa-cart-plus text-xs mr-1.5" /> Add to Cart
                                        </button>
                                        <button onClick={() => setRfqModal({ open: true, product: p })}
                                            className="py-2.5 px-4 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all">
                                            RFQ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* RFQ Modal */}
            {rfqModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setRfqModal({ open: false, product: null })}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Request for Quotation</h3>
                            <button onClick={() => setRfqModal({ open: false, product: null })} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 transition-colors">
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-5">
                            Requesting quote for <span className="font-medium text-gray-900">{rfqModal.product?.name}</span>
                        </p>
                        <div className="space-y-4">
                            <div>
                                <label className="input-label">Quantity</label>
                                <input type="number" value={rfqForm.quantity} onChange={e => setRfqForm({ ...rfqForm, quantity: e.target.value })}
                                    className="input" placeholder="Enter quantity" min="1" />
                            </div>
                            <div>
                                <label className="input-label">Message (optional)</label>
                                <textarea value={rfqForm.message} onChange={e => setRfqForm({ ...rfqForm, message: e.target.value })}
                                    className="input min-h-[80px] resize-none" placeholder="Any special requirements..." />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setRfqModal({ open: false, product: null })} className="btn-secondary flex-1 py-2.5">Cancel</button>
                            <button onClick={submitRfq} className="btn-primary flex-1 py-2.5">Submit RFQ</button>
                        </div>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}

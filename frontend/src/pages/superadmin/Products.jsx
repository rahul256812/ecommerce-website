import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import api from '../../api';

export default function SAProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

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

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-cubes text-xs mr-1.5" />
                        Inventory
                    </p>
                    <h1>All Products</h1>
                    <p>Manage all products across the platform.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-cubes" /></div>
                        <h3>No products</h3>
                        <p>Products will appear here once vendors start listing.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Vendor</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, i) => (
                                        <tr key={p.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                                        <i className="fa-solid fa-box text-gray-300 text-xs" />
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-gray-900 text-sm">{p.name}</span>
                                                        <span className="badge bg-gray-100 text-gray-500 ml-2">{p.category}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-600">{p.vendor_name}</td>
                                            <td>
                                                <span className="font-medium text-gray-900">${p.price?.toFixed(2)}</span>
                                                {p.discount > 0 && <span className="text-red-500 text-xs ml-1">-{p.discount}%</span>}
                                            </td>
                                            <td className="text-sm text-gray-600">{p.quantity}</td>
                                            <td className="text-right">
                                                <button onClick={() => setDeleteModal({ open: true, id: p.id })}
                                                    className="text-xs text-red-500 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null })} onConfirm={handleDelete}
                title="Delete Product" message="Delete this product? This cannot be undone." confirmText="Delete" danger />
        </Sidebar>
    );
}

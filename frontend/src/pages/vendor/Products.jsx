import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import api from '../../api';

export default function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

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

    return (
        <Sidebar>
            <div>
                <div className="flex items-center justify-between mb-8">
                    <div className="page-header" style={{ marginBottom: 0 }}>
                        <p className="text-sm font-medium text-primary-600 mb-1">
                            <i className="fa-solid fa-cubes text-xs mr-1.5" />
                            Inventory
                        </p>
                        <h1>My Products</h1>
                        <p>{products.length} product{products.length !== 1 ? 's' : ''} listed</p>
                    </div>
                    <Link to="/vendor/products/add" className="btn-primary text-sm">
                        <i className="fa-solid fa-plus text-xs" /> Add Product
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-cubes" /></div>
                        <h3>No products yet</h3>
                        <p>Add your first product to start selling.</p>
                        <Link to="/vendor/products/add" className="btn-primary mt-5 text-sm">
                            <i className="fa-solid fa-plus text-xs" /> Add Product
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Stock</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((p, i) => (
                                        <tr key={p.id} className="animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                        {p.image_url ? <img src={p.image_url} alt="" className="w-full h-full object-cover rounded-lg" /> : <i className="fa-solid fa-box text-gray-300 text-sm" />}
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm">{p.name}</span>
                                                </div>
                                            </td>
                                            <td><span className="badge bg-gray-100 text-gray-600">{p.category}</span></td>
                                            <td>
                                                <span className="font-medium text-gray-900">${p.price.toFixed(2)}</span>
                                                {p.discount > 0 && <span className="text-red-500 text-xs ml-1">-{p.discount}%</span>}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-1.5">
                                                    <button onClick={() => updateQty(p.id, -1)} className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold transition-colors">−</button>
                                                    <span className="w-10 text-center font-semibold text-sm text-gray-900">{p.quantity}</span>
                                                    <button onClick={() => updateQty(p.id, 1)} className="w-7 h-7 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold transition-colors">+</button>
                                                </div>
                                            </td>
                                            <td className="text-right">
                                                <button onClick={() => setDeleteModal({ open: true, id: p.id })} className="w-8 h-8 rounded-lg hover:bg-red-50 inline-flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                                    <i className="fa-solid fa-trash-can text-xs" />
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
                title="Delete Product" message="Are you sure you want to delete this product? This action cannot be undone." confirmText="Delete" danger />
        </Sidebar>
    );
}

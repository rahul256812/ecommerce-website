import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

export default function BuyerCart() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutModal, setCheckoutModal] = useState(false);
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => { load(); }, []);

    const load = async () => {
        try {
            const res = await api.get('/cart/');
            setItems(res.data);
        } catch (err) { console.error(err); }
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

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-cart-shopping text-xs mr-1.5" />
                        Shopping Cart
                    </p>
                    <h1>Your Cart</h1>
                    <p>{items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : items.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-cart-shopping" /></div>
                        <h3>Your cart is empty</h3>
                        <p>Browse products and add items to get started.</p>
                        <button onClick={() => navigate('/buyer/products')} className="btn-primary mt-5 text-sm">
                            Browse Products <i className="fa-solid fa-arrow-right text-xs" />
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-3">
                            {items.map((item, i) => {
                                const unitPrice = item.product_price * (1 - (item.product_discount || 0) / 100);
                                return (
                                    <div key={item.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center gap-5 animate-fadeIn" style={{ animationDelay: `${i * 40}ms` }}>
                                        <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {item.product_image ? (
                                                <img src={item.product_image} alt="" className="w-full h-full object-cover rounded-xl" />
                                            ) : (
                                                <i className="fa-solid fa-box text-gray-300 text-lg" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm truncate">{item.product_name}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                ${unitPrice.toFixed(2)} each
                                                {item.product_discount > 0 && <span className="text-red-500 ml-1">(-{item.product_discount}%)</span>}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => updateQty(item.id, item.quantity - 1)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold transition-colors">−</button>
                                            <span className="w-10 text-center font-semibold text-sm text-gray-900">{item.quantity}</span>
                                            <button onClick={() => updateQty(item.id, item.quantity + 1)}
                                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-bold transition-colors">+</button>
                                        </div>
                                        <p className="font-bold text-gray-900 text-sm w-20 text-right">${(unitPrice * item.quantity).toFixed(2)}</p>
                                        <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                            <i className="fa-solid fa-trash-can text-xs" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl border border-gray-100 p-6 sticky top-24">
                                <h3 className="font-semibold text-gray-900 mb-5">Order Summary</h3>
                                <div className="space-y-3 mb-5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal ({items.length} items)</span>
                                        <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="font-medium text-emerald-600">Free</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 flex justify-between">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                                    </div>
                                </div>
                                <button onClick={() => setCheckoutModal(true)} className="btn-primary w-full py-3 text-sm">
                                    <i className="fa-solid fa-lock text-xs" /> Checkout
                                </button>
                                <p className="text-xs text-gray-400 text-center mt-3">
                                    <i className="fa-solid fa-shield-halved mr-1" /> Secure checkout
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Modal */}
            {checkoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setCheckoutModal(false)}>
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
                            <button onClick={() => setCheckoutModal(false)} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400">
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>
                        <div>
                            <label className="input-label">Delivery Address</label>
                            <textarea value={address} onChange={e => setAddress(e.target.value)}
                                className="input min-h-[100px] resize-none" placeholder="Enter your full shipping address..." />
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setCheckoutModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
                            <button onClick={checkout} disabled={!address.trim()} className="btn-primary flex-1 py-2.5 disabled:opacity-50">
                                <i className="fa-solid fa-check text-xs" /> Place Order
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Sidebar>
    );
}

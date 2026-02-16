import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api';

export default function BuyerOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/my').then(res => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-receipt text-xs mr-1.5" />
                        Orders
                    </p>
                    <h1>My Orders</h1>
                    <p>Track and manage your purchase history.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-receipt" /></div>
                        <h3>No orders yet</h3>
                        <p>Your purchase history will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((o, i) => (
                            <div key={o.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fadeIn" style={{ animationDelay: `${i * 40}ms` }}>
                                {/* Order Header */}
                                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Order #{o.id}</p>
                                            <p className="text-xs text-gray-400">{new Date(o.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <StatusBadge status={o.status} />
                                </div>
                                {/* Items */}
                                <div className="px-5 py-3">
                                    {o.items.map((item, j) => (
                                        <div key={j} className="flex justify-between py-2.5 text-sm border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                                                    <i className="fa-solid fa-box text-gray-400 text-xs" />
                                                </div>
                                                <span className="text-gray-700">{item.product_name} <span className="text-gray-400">× {item.quantity}</span></span>
                                            </div>
                                            <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                {/* Footer */}
                                <div className="px-5 py-3 border-t border-gray-100 flex justify-between items-center bg-gray-50/30">
                                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                                        <i className="fa-solid fa-location-dot" /> {o.shipping_address}
                                    </span>
                                    <span className="font-bold text-gray-900">${o.total_amount.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

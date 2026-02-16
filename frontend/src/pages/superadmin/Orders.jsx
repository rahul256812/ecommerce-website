import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api';

export default function SAOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/all').then(res => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const total = orders.reduce((s, o) => s + o.total_amount, 0);
    const commission = orders.reduce((s, o) => s + o.commission_amount, 0);

    const summaryCards = [
        { label: 'Total Orders', value: orders.length, icon: 'fa-solid fa-receipt', iconBg: 'bg-blue-50', iconColor: 'text-blue-600' },
        { label: 'Total Revenue', value: `$${total.toFixed(2)}`, icon: 'fa-solid fa-dollar-sign', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        { label: 'Total Commission', value: `$${commission.toFixed(2)}`, icon: 'fa-solid fa-hand-holding-dollar', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    ];

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-receipt text-xs mr-1.5" />
                        Order Management
                    </p>
                    <h1>All Orders</h1>
                    <p>Full platform order visibility.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {summaryCards.map((card, i) => (
                        <div key={i} className="stat-card animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="flex items-center justify-between">
                                <div className={`stat-icon ${card.iconBg}`}>
                                    <i className={`${card.icon} ${card.iconColor}`} />
                                </div>
                            </div>
                            <p className="stat-value">{card.value}</p>
                            <p className="stat-label">{card.label}</p>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : orders.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-receipt" /></div>
                        <h3>No orders yet</h3>
                        <p>Orders will appear here once buyers start purchasing.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((o, i) => (
                            <div key={o.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
                                <div className="px-5 py-4 flex items-center justify-between border-b border-gray-50 bg-gray-50/50">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">Order #{o.id}</p>
                                        <p className="text-xs text-gray-400">Buyer: {o.buyer_name} · {new Date(o.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <StatusBadge status={o.status} />
                                        <span className="font-bold text-gray-900">${o.total_amount.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="px-5 py-3">
                                    {o.items.map((item, j) => (
                                        <div key={j} className="flex justify-between py-2 text-sm border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center">
                                                    <i className="fa-solid fa-box text-gray-400 text-[10px]" />
                                                </div>
                                                <span className="text-gray-700">{item.product_name} <span className="text-gray-400">× {item.quantity}</span></span>
                                            </div>
                                            <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-5 py-3 border-t border-gray-100 flex justify-between text-xs text-gray-400 bg-gray-50/30">
                                    <span>Commission: ${o.commission_amount.toFixed(2)} · {o.payment_method}</span>
                                    <span><i className="fa-solid fa-location-dot mr-1" />{o.shipping_address}{o.shipping_city ? `, ${o.shipping_city}` : ''}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

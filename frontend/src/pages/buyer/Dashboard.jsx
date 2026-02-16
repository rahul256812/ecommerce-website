import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function BuyerDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ rfqs: 0, pendingRfqs: 0, cartItems: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [rfqs, cart] = await Promise.all([api.get('/rfq/buyer'), api.get('/cart/')]);
                setStats({
                    rfqs: rfqs.data.length,
                    pendingRfqs: rfqs.data.filter(r => r.status === 'pending').length,
                    cartItems: cart.data.length,
                });
            } catch (err) { console.error(err); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Cart Items', value: stats.cartItems, icon: 'fa-solid fa-cart-shopping', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', change: 'In your cart' },
        { label: 'Pending RFQs', value: stats.pendingRfqs, icon: 'fa-solid fa-clock', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', change: 'Awaiting response' },
        { label: 'Total RFQs', value: stats.rfqs, icon: 'fa-solid fa-clipboard-list', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', change: 'All time' },
    ];

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-house text-xs mr-1.5" />
                        Buyer Dashboard
                    </p>
                    <h1>Welcome, {user?.name}</h1>
                    <p>Your procurement overview at a glance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {cards.map((card, i) => (
                        <div key={i} className="stat-card animate-fadeIn" style={{ animationDelay: `${i * 80}ms` }}>
                            <div className="flex items-center justify-between">
                                <div className={`stat-icon ${card.iconBg}`}>
                                    <i className={`${card.icon} ${card.iconColor}`} />
                                </div>
                                <span className="text-xs font-medium text-gray-400">{card.change}</span>
                            </div>
                            <p className="stat-value">{card.value}</p>
                            <p className="stat-label">{card.label}</p>
                        </div>
                    ))}
                </div>

                <div className="card p-6">
                    <h2 className="text-base font-semibold text-gray-900 mb-5">Quick Actions</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/buyer/products" className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-25 transition-all duration-200">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                <i className="fa-solid fa-bag-shopping text-sm" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">Browse Products</p>
                                <p className="text-xs text-gray-500">Find products from verified vendors</p>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs group-hover:text-primary-400 transition-colors" />
                        </Link>
                        <Link to="/buyer/cart" className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-accent-50/50 transition-all duration-200">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                <i className="fa-solid fa-cart-shopping text-sm" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">View Cart</p>
                                <p className="text-xs text-gray-500">Review items and checkout</p>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs group-hover:text-emerald-400 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

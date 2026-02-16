import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function VendorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ products: 0, pendingRfqs: 0, totalRfqs: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [prods, rfqs] = await Promise.all([
                    api.get('/products/vendor/my'),
                    api.get('/rfq/vendor'),
                ]);
                setStats({
                    products: prods.data.length,
                    pendingRfqs: rfqs.data.filter(r => r.status === 'pending').length,
                    totalRfqs: rfqs.data.length,
                });
            } catch (err) { console.error(err); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Total Products', value: stats.products, icon: 'fa-solid fa-cubes', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', change: '+2 this month' },
        { label: 'Pending RFQs', value: stats.pendingRfqs, icon: 'fa-solid fa-clock', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', change: 'Needs response' },
        { label: 'Total Quotations', value: stats.totalRfqs, icon: 'fa-solid fa-file-invoice', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', change: 'All time' },
    ];

    return (
        <Sidebar>
            <div>
                {/* Page Header */}
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-house text-xs mr-1.5" />
                        Vendor Dashboard
                    </p>
                    <h1>Welcome back, {user?.name}</h1>
                    <p>Here's what's happening with your store today.</p>
                </div>

                {/* Stats Grid */}
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

                {/* Quick Actions */}
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-base font-semibold text-gray-900">Quick Actions</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link to="/vendor/products/add" className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-25 transition-all duration-200">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                                <i className="fa-solid fa-plus text-sm" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">Add New Product</p>
                                <p className="text-xs text-gray-500">List a new product for buyers</p>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs group-hover:text-primary-400 transition-colors" />
                        </Link>
                        <Link to="/vendor/quotations" className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all duration-200">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                                <i className="fa-solid fa-file-invoice text-sm" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 text-sm">View Quotations</p>
                                <p className="text-xs text-gray-500">Review and respond to RFQs</p>
                            </div>
                            <i className="fa-solid fa-chevron-right text-gray-300 ml-auto text-xs group-hover:text-amber-400 transition-colors" />
                        </Link>
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

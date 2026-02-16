import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function SuperAdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ admins: 0, vendors: 0, buyers: 0, products: 0, rfqs: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [a, v, b, p, r] = await Promise.all([
                    api.get('/admin/admins'), api.get('/admin/vendors'), api.get('/admin/buyers'),
                    api.get('/admin/products'), api.get('/rfq/all'),
                ]);
                setStats({ admins: a.data.length, vendors: v.data.length, buyers: b.data.length, products: p.data.length, rfqs: r.data.length });
            } catch (err) { console.error(err); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Admins', value: stats.admins, icon: 'fa-solid fa-shield-halved', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600', change: 'Platform' },
        { label: 'Vendors', value: stats.vendors, icon: 'fa-solid fa-store', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', change: 'Active' },
        { label: 'Buyers', value: stats.buyers, icon: 'fa-solid fa-users', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', change: 'Registered' },
        { label: 'Products', value: stats.products, icon: 'fa-solid fa-cubes', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', change: 'Listed' },
        { label: 'RFQs', value: stats.rfqs, icon: 'fa-solid fa-clipboard-list', iconBg: 'bg-violet-50', iconColor: 'text-violet-600', change: 'All time' },
    ];

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-house text-xs mr-1.5" />
                        Platform Overview
                    </p>
                    <h1>Super Admin Dashboard</h1>
                    <p>Complete platform analytics and controls.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                    {cards.map((card, i) => (
                        <div key={i} className="stat-card animate-fadeIn" style={{ animationDelay: `${i * 60}ms` }}>
                            <div className="flex items-center justify-between">
                                <div className={`stat-icon ${card.iconBg}`}>
                                    <i className={`${card.icon} ${card.iconColor}`} />
                                </div>
                                <span className="text-[11px] font-medium text-gray-400">{card.change}</span>
                            </div>
                            <p className="stat-value">{card.value}</p>
                            <p className="stat-label">{card.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </Sidebar>
    );
}

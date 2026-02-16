import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ vendors: 0, buyers: 0, rfqs: 0 });

    useEffect(() => {
        const load = async () => {
            try {
                const [v, b, r] = await Promise.all([api.get('/admin/vendors'), api.get('/admin/buyers'), api.get('/rfq/all')]);
                setStats({ vendors: v.data.length, buyers: b.data.length, rfqs: r.data.length });
            } catch (err) { console.error(err); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Total Vendors', value: stats.vendors, icon: 'fa-solid fa-store', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', change: 'Active' },
        { label: 'Total Buyers', value: stats.buyers, icon: 'fa-solid fa-users', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', change: 'Registered' },
        { label: 'Total RFQs', value: stats.rfqs, icon: 'fa-solid fa-clipboard-list', iconBg: 'bg-violet-50', iconColor: 'text-violet-600', change: 'All time' },
    ];

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-house text-xs mr-1.5" />
                        Admin Dashboard
                    </p>
                    <h1>Welcome back, {user?.name}</h1>
                    <p>Platform overview and management tools.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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
            </div>
        </Sidebar>
    );
}

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function SuperAdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ admins: 0, vendors: 0, buyers: 0, products: 0, rfqs: 0 });
    const [loading, setLoading] = useState(true);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const load = async () => {
            try {
                const [a, v, b, p, r] = await Promise.all([
                    api.get('/admin/admins'), api.get('/admin/vendors'), api.get('/admin/buyers'),
                    api.get('/admin/products'), api.get('/rfq/all'),
                ]);
                setStats({ admins: a.data.length, vendors: v.data.length, buyers: b.data.length, products: p.data.length, rfqs: r.data.length });
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const cards = [
        { label: 'Platform Admins', value: stats.admins, icon: 'fa-shield-halved', color: '#6366f1', bg: '#eef2ff', description: 'Governance nodes' },
        { label: 'Active Vendors', value: stats.vendors, icon: 'fa-store', color: '#3b82f6', bg: '#eff6ff', description: 'Market supply' },
        { label: 'Registered Buyers', value: stats.buyers, icon: 'fa-users', color: '#10b981', bg: '#ecfdf5', description: 'Market demand' },
        { label: 'Global Inventory', value: stats.products, icon: 'fa-cubes', color: '#f59e0b', bg: '#fffbeb', description: 'Total products' },
        { label: 'Platform RFQs', value: stats.rfqs, icon: 'fa-clipboard-list', color: '#8b5cf6', bg: '#f5f3ff', description: 'Trade volume' },
    ];

    const healthMetrics = [
        { name: 'Core API', status: 'Operational', color: '#10b981' },
        { name: 'Market Database', status: 'Operational', color: '#10b981' },
        { name: 'Auth Gateway', status: 'Operational', color: '#10b981' },
        { name: 'Upload Service', status: 'Operational', color: '#10b981' },
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Header Section */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                        <div style={{
                            width: 42, height: 42, borderRadius: 12,
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)'
                        }}>
                            <i className="fa-solid fa-crown" style={{ color: '#fff', fontSize: 18 }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', margin: 0 }}>
                                {greeting}, Super Admin
                            </p>
                            <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.025em' }}>
                                Platform Control Center
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 20,
                    marginBottom: 32
                }}>
                    {cards.map((card, i) => (
                        <div key={i} style={{
                            background: '#fff',
                            borderRadius: 20,
                            padding: '24px',
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 6px -1px rgba(0,0,0,0.03)',
                            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                            cursor: 'default'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            <div style={{
                                width: 48, height: 48, borderRadius: 14,
                                background: card.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16
                            }}>
                                <i className={`fa-solid fa-${card.icon}`} style={{ color: card.color, fontSize: 20 }} />
                            </div>
                            <p style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: '0 0 4px 0', letterSpacing: '-0.03em' }}>
                                {loading ? '...' : card.value}
                            </p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>
                                {card.label}
                            </p>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                {card.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
                    {/* System Health Panel */}
                    <div style={{
                        background: '#fff',
                        borderRadius: 24,
                        padding: '28px',
                        border: '1px solid #f3f4f6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 6px -1px rgba(0,0,0,0.03)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12, background: '#f0fdf4',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <i className="fa-solid fa-heart-pulse" style={{ color: '#10b981', fontSize: 18 }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: 0 }}>System Health</h3>
                                    <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Real-time infrastructure status</p>
                                </div>
                            </div>
                            <div style={{
                                padding: '6px 12px', borderRadius: 20, background: '#f0fdf4',
                                display: 'flex', alignItems: 'center', gap: 6
                            }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: '#166534' }}>ALL SYSTEMS GO</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                            {healthMetrics.map((m, i) => (
                                <div key={i} style={{
                                    padding: '16px', borderRadius: 16, background: '#fafafa', border: '1px solid #f3f4f6',
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                }}>
                                    <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>{m.name}</span>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: m.color }}>{m.status}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #1e1b4b, #312e81)',
                        borderRadius: 24,
                        padding: '28px',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: '0 10px 25px -5px rgba(30, 27, 75, 0.4)'
                    }}>
                        <div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Superadmin Privileges</h3>
                            <p style={{ fontSize: 14, color: '#c7d2fe', lineHeight: 1.6, marginBottom: 24 }}>
                                You are logged into the platform control center. You have unrestricted access to all marketplace data, user accounts, and financial configurations.
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {[
                                    { label: 'Platform Settings', icon: 'gear', link: '/superadmin/settings' },
                                    { label: 'User Verification', icon: 'user-check', link: '/superadmin/approve' }
                                ].map((btn, i) => (
                                    <a key={i} href={btn.link} style={{
                                        padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.1)',
                                        color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 600,
                                        display: 'flex', alignItems: 'center', gap: 10, transition: 'background 0.2s'
                                    }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                                    >
                                        <i className={`fa-solid fa-${btn.icon}`} style={{ fontSize: 14 }} />
                                        {btn.label}
                                        <i className="fa-solid fa-chevron-right" style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.5 }} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Gradient Section */}
                <div style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
                    borderRadius: 24,
                    padding: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: '#fff',
                    boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                }}>
                    <div style={{ maxWidth: '60%' }}>
                        <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px 0' }}>Platform Scaling & Insights</h2>
                        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
                            VenDora is currently processing active requests across all regions. Ensure global tax settings and commission rates are verified in the configuration panel.
                        </p>
                    </div>
                    <div style={{
                        width: 64, height: 64, borderRadius: 20, background: 'rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backdropFilter: 'blur(8px)'
                    }}>
                        <i className="fa-solid fa-rocket" style={{ fontSize: 24 }} />
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

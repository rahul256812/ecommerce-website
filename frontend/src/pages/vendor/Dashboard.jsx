import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function VendorDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ products: 0, pendingRfqs: 0, totalRfqs: 0 });
    const [loading, setLoading] = useState(true);
    const [hoveredAction, setHoveredAction] = useState(null);

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
            finally { setLoading(false); }
        };
        load();
    }, []);

    const cards = [
        {
            label: 'Total Products', value: stats.products,
            icon: 'fa-solid fa-cubes', color: '#3b82f6', bg: '#eff6ff',
            change: '+2 this month', changeIcon: 'fa-arrow-trend-up', changeColor: '#10b981',
        },
        {
            label: 'Pending RFQs', value: stats.pendingRfqs,
            icon: 'fa-solid fa-clock', color: '#f59e0b', bg: '#fffbeb',
            change: 'Needs response', changeIcon: 'fa-circle-exclamation', changeColor: '#f59e0b',
        },
        {
            label: 'Total Quotations', value: stats.totalRfqs,
            icon: 'fa-solid fa-file-invoice', color: '#10b981', bg: '#ecfdf5',
            change: 'All time', changeIcon: 'fa-chart-line', changeColor: '#6b7280',
        },
    ];

    const quickActions = [
        {
            to: '/vendor/products/add',
            icon: 'fa-solid fa-plus', color: '#6366f1', bg: '#eef2ff',
            title: 'Add New Product', desc: 'List a new product for buyers',
        },
        {
            to: '/vendor/quotations',
            icon: 'fa-solid fa-file-invoice', color: '#f59e0b', bg: '#fffbeb',
            title: 'View Quotations', desc: 'Review and respond to RFQs',
        },
        {
            to: '/vendor/products',
            icon: 'fa-solid fa-boxes-stacked', color: '#3b82f6', bg: '#eff6ff',
            title: 'Manage Products', desc: 'Edit or update your listings',
        },
        {
            to: '/vendor/profile',
            icon: 'fa-solid fa-user-pen', color: '#10b981', bg: '#ecfdf5',
            title: 'Edit Profile', desc: 'Update your business info',
        },
    ];

    return (
        <Sidebar>
            <div>
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20, marginBottom: 12,
                        background: '#eef2ff', color: '#6366f1', fontSize: 12, fontWeight: 600,
                    }}>
                        <i className="fa-solid fa-house" style={{ fontSize: 10 }} />
                        Vendor Dashboard
                    </div>
                    <h1 style={{
                        fontSize: 28, fontWeight: 700, color: '#111827',
                        letterSpacing: -0.5, margin: '0 0 6px 0',
                    }}>
                        Welcome back, {user?.name}
                    </h1>
                    <p style={{ fontSize: 15, color: '#9ca3af', margin: 0 }}>
                        Here's what's happening with your store today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 20, marginBottom: 32,
                }}>
                    {cards.map((card, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 16, padding: 24,
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                <div style={{
                                    width: 44, height: 44, borderRadius: 12,
                                    background: card.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className={card.icon} style={{ color: card.color, fontSize: 18 }} />
                                </div>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: 4,
                                    fontSize: 11, fontWeight: 500, color: card.changeColor,
                                }}>
                                    <i className={`fa-solid ${card.changeIcon}`} style={{ fontSize: 9 }} />
                                    {card.change}
                                </div>
                            </div>
                            <p style={{
                                fontSize: 32, fontWeight: 700, color: '#111827',
                                letterSpacing: -0.5, margin: '0 0 4px 0', lineHeight: 1,
                            }}>
                                {loading ? '—' : card.value}
                            </p>
                            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 28,
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                    marginBottom: 32,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                        <div>
                            <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: 0 }}>Quick Actions</h2>
                            <p style={{ fontSize: 13, color: '#9ca3af', margin: '4px 0 0 0' }}>Common tasks at your fingertips</p>
                        </div>
                    </div>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12,
                    }}>
                        {quickActions.map((action, i) => (
                            <Link
                                key={i} to={action.to}
                                onMouseEnter={() => setHoveredAction(i)}
                                onMouseLeave={() => setHoveredAction(null)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 14,
                                    padding: '16px 18px', borderRadius: 12,
                                    border: hoveredAction === i ? `1px solid ${action.color}30` : '1px solid #f3f4f6',
                                    background: hoveredAction === i ? `${action.bg}` : '#fafafa',
                                    textDecoration: 'none', transition: 'all 0.2s ease',
                                    transform: hoveredAction === i ? 'translateY(-1px)' : 'none',
                                }}
                            >
                                <div style={{
                                    width: 42, height: 42, borderRadius: 11,
                                    background: action.bg,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <i className={action.icon} style={{ color: action.color, fontSize: 15 }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{action.title}</p>
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: '2px 0 0 0' }}>{action.desc}</p>
                                </div>
                                <i className="fa-solid fa-chevron-right" style={{
                                    fontSize: 10, color: hoveredAction === i ? action.color : '#d1d5db',
                                    transition: 'color 0.2s ease',
                                }} />
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Performance Overview */}
                <div style={{
                    background: '#fff', borderRadius: 16, padding: 28,
                    border: '1px solid #f3f4f6',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.02)',
                }}>
                    <h2 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '0 0 20px 0' }}>
                        Store Overview
                    </h2>
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
                    }}>
                        {[
                            {
                                icon: 'fa-solid fa-chart-line', color: '#6366f1', bg: '#eef2ff',
                                label: 'Conversion Rate', value: '—',
                                sub: 'RFQ to order',
                            },
                            {
                                icon: 'fa-solid fa-star', color: '#f59e0b', bg: '#fffbeb',
                                label: 'Response Time', value: '< 24h',
                                sub: 'Avg RFQ response',
                            },
                            {
                                icon: 'fa-solid fa-shield-check', color: '#10b981', bg: '#ecfdf5',
                                label: 'Account Status', value: 'Verified',
                                sub: 'All documents clear',
                            },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: 20, borderRadius: 12,
                                background: '#fafafa', border: '1px solid #f3f4f6',
                                textAlign: 'center',
                            }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: item.bg, margin: '0 auto 12px auto',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <i className={item.icon} style={{ color: item.color, fontSize: 15 }} />
                                </div>
                                <p style={{ fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{item.value}</p>
                                <p style={{ fontSize: 12, fontWeight: 500, color: '#6b7280', margin: '0 0 2px 0' }}>{item.label}</p>
                                <p style={{ fontSize: 11, color: '#c4c8d0', margin: 0 }}>{item.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

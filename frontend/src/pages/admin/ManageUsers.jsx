import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import api from '../../api';

export default function ManageUsers() {
    const [tab, setTab] = useState('vendors');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => { load(); }, [tab]);

    const load = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/${tab}`);
            setUsers(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/users/${deleteModal.id}`);
            setUsers(users.filter(u => u.id !== deleteModal.id));
            setDeleteModal({ open: false, id: null, name: '' });
        } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
    };

    const tabs = [
        { key: 'vendors', label: 'Vendors', icon: 'fa-store', color: '#3b82f6' },
        { key: 'buyers', label: 'Buyers', icon: 'fa-users', color: '#10b981' },
    ];

    const avatarColors = [
        ['#6366f1', '#818cf8'], ['#3b82f6', '#60a5fa'], ['#10b981', '#34d399'],
        ['#f59e0b', '#fbbf24'], ['#ef4444', '#f87171'], ['#8b5cf6', '#a78bfa'],
    ];
    const getAvatar = (i) => avatarColors[i % avatarColors.length];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1040, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-users-gear" style={{ fontSize: 11, marginRight: 6 }} />
                        User Management
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>Manage Users</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>View, manage, and monitor platform users.</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Total Users', value: users.length, icon: 'fa-user-group', color: '#6366f1', bg: '#eef2ff', sub: tab === 'vendors' ? 'Vendors' : 'Buyers' },
                        { label: 'Active', value: users.filter(u => u.is_approved !== false).length, icon: 'fa-circle-check', color: '#10b981', bg: '#ecfdf5', sub: 'Approved accounts' },
                        { label: 'Current View', value: tab.charAt(0).toUpperCase() + tab.slice(1), icon: tab === 'vendors' ? 'fa-store' : 'fa-users', color: '#f59e0b', bg: '#fffbeb', sub: 'Showing ' + tab },
                    ].map((card, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '18px 18px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', gap: 14,
                        }}>
                            <div style={{
                                width: 42, height: 42, borderRadius: 11, background: card.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: 15 }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 20, fontWeight: 700, color: '#111827', margin: '0 0 1px 0' }}>{card.value}</p>
                                <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={{
                    display: 'inline-flex', gap: 4, padding: 4, background: '#f3f4f6',
                    borderRadius: 12, marginBottom: 20,
                }}>
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: 7,
                                padding: '9px 20px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                                background: tab === t.key ? '#fff' : 'transparent',
                                color: tab === t.key ? '#111827' : '#9ca3af',
                                boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                            }}
                        >
                            <i className={`fa-solid ${t.icon}`} style={{ fontSize: 11, color: tab === t.key ? t.color : '#d1d5db' }} />
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{
                            width: 36, height: 36, border: '3px solid #e5e7eb',
                            borderTop: '3px solid #6366f1', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite',
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : users.length === 0 ? (
                    <div style={{
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        padding: '60px 20px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}>
                        <div style={{
                            width: 56, height: 56, borderRadius: 14, background: '#f3f4f6',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px',
                        }}>
                            <i className="fa-solid fa-users" style={{ fontSize: 22, color: '#d1d5db' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>No {tab} found</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>There are currently no {tab} registered on the platform.</p>
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1fr 0.8fr',
                            padding: '12px 20px', borderBottom: '1px solid #f3f4f6',
                            background: '#fafbfc',
                        }}>
                            {['User', 'Email', 'ID', 'Joined', 'Actions'].map((h, i) => (
                                <p key={i} style={{
                                    fontSize: 11, fontWeight: 700, color: '#9ca3af', margin: 0,
                                    textTransform: 'uppercase', letterSpacing: 0.5,
                                    textAlign: i === 4 ? 'right' : 'left',
                                }}>{h}</p>
                            ))}
                        </div>

                        {/* User Rows */}
                        {users.map((u, i) => {
                            const [c1, c2] = getAvatar(i);
                            return (
                                <div key={u.id}
                                    onMouseEnter={() => setHoveredRow(u.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '2fr 2fr 1.2fr 1fr 0.8fr',
                                        padding: '14px 20px', alignItems: 'center',
                                        borderBottom: i < users.length - 1 ? '1px solid #f9fafb' : 'none',
                                        background: hoveredRow === u.id ? '#fafbfc' : '#fff',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* User */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 34, height: 34, borderRadius: 9,
                                            background: `linear-gradient(135deg, ${c1}, ${c2})`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                                        }}>
                                            {u.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: 0 }}>{u.name}</p>
                                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>
                                                <i className={`fa-solid ${tab === 'vendors' ? 'fa-store' : 'fa-user'}`} style={{ fontSize: 8, marginRight: 4 }} />
                                                {tab === 'vendors' ? 'Vendor' : 'Buyer'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                        <i className="fa-solid fa-envelope" style={{ fontSize: 10, color: '#d1d5db' }} />
                                        <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{u.email}</p>
                                    </div>

                                    {/* ID */}
                                    <span style={{
                                        display: 'inline-block', fontSize: 11, fontFamily: "'SF Mono', 'Consolas', monospace",
                                        color: '#6b7280', background: '#f3f4f6', padding: '3px 8px',
                                        borderRadius: 6, width: 'fit-content',
                                    }}>
                                        {u.generated_id}
                                    </span>

                                    {/* Joined */}
                                    <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                        {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>

                                    {/* Actions */}
                                    <div style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => setDeleteModal({ open: true, id: u.id, name: u.name })}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#ef4444'; }}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 5,
                                                padding: '6px 12px', borderRadius: 8, border: 'none',
                                                background: 'transparent', color: '#ef4444',
                                                fontSize: 12, fontWeight: 600, cursor: 'pointer',
                                                transition: 'all 0.15s',
                                            }}
                                        >
                                            <i className="fa-solid fa-trash-can" style={{ fontSize: 10 }} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Footer */}
                        <div style={{
                            padding: '12px 20px', background: '#fafbfc', borderTop: '1px solid #f3f4f6',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                Showing {users.length} {tab}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Live data</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null, name: '' })} onConfirm={handleDelete}
                title="Remove User" message={`Remove ${deleteModal.name}? This will also delete all their associated data.`} confirmText="Remove" danger />
        </Sidebar>
    );
}

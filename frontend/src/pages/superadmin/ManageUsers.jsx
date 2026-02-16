import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import api from '../../api';

export default function SAManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });
    const [hoveredRow, setHoveredRow] = useState(null);
    const [hoveredDel, setHoveredDel] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/admin/all-users'); setUsers(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/admin/users/${deleteModal.id}`);
            setUsers(users.filter(u => u.id !== deleteModal.id));
            setDeleteModal({ open: false, id: null, name: '' });
        } catch (err) { alert(err.response?.data?.detail || 'Failed'); }
    };

    const filtered = filter === 'all' ? users : users.filter(u => u.role === filter);

    const roleConfig = {
        vendor: { color: '#10b981', bg: '#ecfdf5', icon: 'fa-store', label: 'Vendor' },
        buyer: { color: '#3b82f6', bg: '#eff6ff', icon: 'fa-bag-shopping', label: 'Buyer' },
        admin: { color: '#8b5cf6', bg: '#f5f3ff', icon: 'fa-user-shield', label: 'Admin' },
    };
    const getRole = (r) => roleConfig[r] || { color: '#6b7280', bg: '#f9fafb', icon: 'fa-user', label: r };

    const statusConfig = {
        approved: { color: '#10b981', bg: '#ecfdf5', label: 'Approved' },
        pending: { color: '#f59e0b', bg: '#fffbeb', label: 'Pending' },
        rejected: { color: '#ef4444', bg: '#fef2f2', label: 'Rejected' },
    };
    const getStatusCfg = (s) => statusConfig[s] || { color: '#6b7280', bg: '#f9fafb', label: s || '—' };

    const avatarGradients = [
        'linear-gradient(135deg, #6366f1, #8b5cf6)',
        'linear-gradient(135deg, #3b82f6, #2dd4bf)',
        'linear-gradient(135deg, #f59e0b, #ef4444)',
        'linear-gradient(135deg, #10b981, #3b82f6)',
        'linear-gradient(135deg, #ec4899, #8b5cf6)',
        'linear-gradient(135deg, #f97316, #f59e0b)',
    ];

    const filterTabs = [
        { key: 'all', label: 'All', icon: 'fa-users', color: '#6366f1' },
        { key: 'vendor', label: 'Vendors', icon: 'fa-store', color: '#10b981' },
        { key: 'buyer', label: 'Buyers', icon: 'fa-bag-shopping', color: '#3b82f6' },
        { key: 'admin', label: 'Admins', icon: 'fa-user-shield', color: '#8b5cf6' },
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-users" style={{ fontSize: 11, marginRight: 6 }} />
                        Platform Users
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>All Users</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>View and manage all platform users.</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Total Users', value: users.length, icon: 'fa-users', color: '#6366f1', bg: '#eef2ff', sub: 'All accounts' },
                        { label: 'Vendors', value: users.filter(u => u.role === 'vendor').length, icon: 'fa-store', color: '#10b981', bg: '#ecfdf5', sub: 'Seller accounts' },
                        { label: 'Buyers', value: users.filter(u => u.role === 'buyer').length, icon: 'fa-bag-shopping', color: '#3b82f6', bg: '#eff6ff', sub: 'Buyer accounts' },
                        { label: 'Admins', value: users.filter(u => u.role === 'admin').length, icon: 'fa-user-shield', color: '#8b5cf6', bg: '#f5f3ff', sub: 'Admin accounts' },
                    ].map((card, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '18px 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10, background: card.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
                            }}>
                                <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: 14 }} />
                            </div>
                            <p style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 2px 0' }}>{card.value}</p>
                            <p style={{ fontSize: 12, fontWeight: 600, color: '#374151', margin: '0 0 2px 0' }}>{card.label}</p>
                            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{card.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div style={{
                    display: 'inline-flex', gap: 4, padding: 4, background: '#f3f4f6',
                    borderRadius: 12, marginBottom: 20,
                }}>
                    {filterTabs.map(t => {
                        const count = t.key === 'all' ? users.length : users.filter(u => u.role === t.key).length;
                        return (
                            <button key={t.key} onClick={() => setFilter(t.key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 6,
                                    padding: '9px 16px', borderRadius: 9, border: 'none', cursor: 'pointer',
                                    fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                                    background: filter === t.key ? '#fff' : 'transparent',
                                    color: filter === t.key ? '#111827' : '#9ca3af',
                                    boxShadow: filter === t.key ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                                }}
                            >
                                <i className={`fa-solid ${t.icon}`} style={{ fontSize: 10, color: filter === t.key ? t.color : '#d1d5db' }} />
                                {t.label}
                                <span style={{
                                    fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                                    background: filter === t.key ? '#eef2ff' : '#e5e7eb',
                                    color: filter === t.key ? '#6366f1' : '#9ca3af',
                                }}>{count}</span>
                            </button>
                        );
                    })}
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
                ) : filtered.length === 0 ? (
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
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>No users found</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No users match the current filter.</p>
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 0.7fr 1fr 0.7fr 0.6fr',
                            padding: '14px 20px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                        }}>
                            {['NAME', 'EMAIL', 'ROLE', 'USER ID', 'STATUS', 'ACTIONS'].map(h => (
                                <span key={h} style={{
                                    fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5,
                                    textAlign: h === 'ACTIONS' ? 'right' : 'left',
                                }}>{h}</span>
                            ))}
                        </div>

                        {/* Table Rows */}
                        {filtered.map((u, i) => {
                            const role = getRole(u.role);
                            const status = getStatusCfg(u.approval_status);
                            return (
                                <div key={u.id}
                                    onMouseEnter={() => setHoveredRow(u.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 0.7fr 1fr 0.7fr 0.6fr',
                                        padding: '14px 20px', alignItems: 'center',
                                        borderBottom: i < filtered.length - 1 ? '1px solid #f9fafb' : 'none',
                                        background: hoveredRow === u.id ? '#f9fafb' : '#fff',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* Name */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            background: avatarGradients[i % avatarGradients.length],
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                                        }}>
                                            {u.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{u.name}</span>
                                    </div>

                                    {/* Email */}
                                    <span style={{ fontSize: 12, color: '#6b7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {u.email}
                                    </span>

                                    {/* Role */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content',
                                        padding: '3px 9px', borderRadius: 6, fontSize: 10,
                                        fontWeight: 700, color: role.color, background: role.bg,
                                        textTransform: 'capitalize',
                                    }}>
                                        <i className={`fa-solid ${role.icon}`} style={{ fontSize: 8 }} />
                                        {role.label}
                                    </span>

                                    {/* User ID */}
                                    <span style={{
                                        fontSize: 11, fontFamily: 'monospace', color: '#9ca3af',
                                        background: '#f9fafb', padding: '3px 8px', borderRadius: 5,
                                        display: 'inline-block', width: 'fit-content',
                                    }}>
                                        {u.generated_id}
                                    </span>

                                    {/* Status */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <span style={{
                                            width: 6, height: 6, borderRadius: '50%',
                                            background: status.color, display: 'inline-block',
                                        }} />
                                        <span style={{ fontSize: 11, fontWeight: 600, color: status.color }}>
                                            {status.label}
                                        </span>
                                    </div>

                                    {/* Actions */}
                                    <div style={{ textAlign: 'right' }}>
                                        <button
                                            onClick={() => setDeleteModal({ open: true, id: u.id, name: u.name })}
                                            onMouseEnter={() => setHoveredDel(u.id)}
                                            onMouseLeave={() => setHoveredDel(null)}
                                            style={{
                                                display: 'inline-flex', alignItems: 'center', gap: 4,
                                                padding: '5px 12px', borderRadius: 7, border: 'none', cursor: 'pointer',
                                                fontSize: 11, fontWeight: 600,
                                                background: hoveredDel === u.id ? '#fef2f2' : 'transparent',
                                                color: '#ef4444', transition: 'background 0.15s',
                                            }}
                                        >
                                            <i className="fa-solid fa-trash" style={{ fontSize: 9 }} />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Table Footer */}
                        <div style={{
                            padding: '12px 20px', background: '#fafbfc', borderTop: '1px solid #f3f4f6',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>
                                Showing {filtered.length} of {users.length} users
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
                title="Delete User" message={`Delete ${deleteModal.name}? This cannot be undone.`} confirmText="Delete" danger />
        </Sidebar>
    );
}

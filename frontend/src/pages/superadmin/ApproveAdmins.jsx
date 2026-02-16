import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

export default function ApproveAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/admin/admins'); setAdmins(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to ${action} this admin?`)) return;
        try { await api.put(`/admin/${action}/${id}`); load(); }
        catch (err) { alert(err.response?.data?.detail || 'Failed'); }
    };

    const filtered = filter === 'all' ? admins : admins.filter(a => a.approval_status === filter);

    const statusConfig = {
        approved: { color: '#10b981', bg: '#ecfdf5', icon: 'fa-circle-check', label: 'Verified' },
        pending: { color: '#f59e0b', bg: '#fffbeb', icon: 'fa-clock', label: 'Pending' },
        rejected: { color: '#ef4444', bg: '#fef2f2', icon: 'fa-circle-xmark', label: 'Rejected' },
    };
    const getStatus = (s) => statusConfig[s] || { color: '#6b7280', bg: '#f9fafb', icon: 'fa-circle', label: s };

    const filterTabs = [
        { key: 'all', label: 'All', icon: 'fa-users', color: '#6366f1' },
        { key: 'pending', label: 'Pending', icon: 'fa-clock', color: '#f59e0b' },
        { key: 'approved', label: 'Verified', icon: 'fa-check-double', color: '#10b981' },
        { key: 'rejected', label: 'Rejected', icon: 'fa-ban', color: '#ef4444' },
    ];

    return (
        <Sidebar>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#6366f1', marginBottom: 4 }}>
                        <i className="fa-solid fa-user-check" style={{ fontSize: 11, marginRight: 6 }} />
                        Security & Access
                    </p>
                    <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', margin: '0 0 4px 0', letterSpacing: -0.5 }}>Admin Verification</h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Review and approve administrative access requests.</p>
                </div>

                {/* Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                    {[
                        { label: 'Total Admins', value: admins.length, icon: 'fa-users-gear', color: '#6366f1', bg: '#eef2ff', sub: 'All records' },
                        { label: 'Pending Requests', value: admins.filter(a => a.approval_status === 'pending').length, icon: 'fa-clock', color: '#f59e0b', bg: '#fffbeb', sub: 'Action required' },
                        { label: 'Verified Staff', value: admins.filter(a => a.approval_status === 'approved').length, icon: 'fa-shield-check', color: '#10b981', bg: '#ecfdf5', sub: 'Active access' },
                    ].map((card, i) => (
                        <div key={i} style={{
                            background: '#fff', borderRadius: 14, border: '1px solid #f3f4f6',
                            padding: '18px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                        }}>
                            <div>
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', margin: '0 0 4px 0' }}>{card.label}</p>
                                <p style={{ fontSize: 24, fontWeight: 700, color: '#111827', margin: 0 }}>{card.value}</p>
                                <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0 0' }}>{card.sub}</p>
                            </div>
                            <div style={{
                                width: 42, height: 42, borderRadius: 12, background: card.bg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <i className={`fa-solid ${card.icon}`} style={{ color: card.color, fontSize: 16 }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filter Tabs */}
                <div style={{
                    display: 'inline-flex', gap: 4, padding: 4, background: '#f3f4f6',
                    borderRadius: 12, marginBottom: 20,
                }}>
                    {filterTabs.map(t => {
                        const count = t.key === 'all' ? admins.length : admins.filter(a => a.approval_status === t.key).length;
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
                            <i className="fa-solid fa-user-check" style={{ fontSize: 22, color: '#d1d5db' }} />
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '0 0 4px 0' }}>No requests found</h3>
                        <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>No admin accounts match the current filter.</p>
                    </div>
                ) : (
                    <div style={{
                        background: '#fff', borderRadius: 16, border: '1px solid #f3f4f6',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)', overflow: 'hidden',
                    }}>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 0.8fr 0.8fr 0.8fr 1fr',
                            padding: '14px 20px', background: '#fafbfc', borderBottom: '1px solid #f3f4f6',
                        }}>
                            {['ADMIN', 'EMAIL', 'ID', 'JOINED', 'STATUS', 'ACTIONS'].map(h => (
                                <span key={h} style={{
                                    fontSize: 10, fontWeight: 700, color: '#9ca3af', letterSpacing: 0.5,
                                    textAlign: h === 'ACTIONS' ? 'right' : 'left',
                                }}>{h}</span>
                            ))}
                        </div>

                        {/* Table Rows */}
                        {filtered.map((a, i) => {
                            const st = getStatus(a.approval_status);
                            return (
                                <div key={a.id}
                                    onMouseEnter={() => setHoveredRow(a.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    style={{
                                        display: 'grid', gridTemplateColumns: '1.5fr 1.5fr 0.8fr 0.8fr 0.8fr 1fr',
                                        padding: '14px 20px', alignItems: 'center',
                                        borderBottom: i < filtered.length - 1 ? '1px solid #f9fafb' : 'none',
                                        background: hoveredRow === a.id ? '#f9fafb' : '#fff',
                                        transition: 'background 0.15s',
                                    }}
                                >
                                    {/* Admin */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 10,
                                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
                                        }}>
                                            {a.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: 0 }}>{a.name}</p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <span style={{ fontSize: 13, color: '#6b7280' }}>{a.email}</span>

                                    {/* ID */}
                                    <span style={{
                                        fontSize: 11, fontFamily: 'monospace', color: '#9ca3af',
                                        background: '#f9fafb', padding: '2px 6px', borderRadius: 4,
                                        width: 'fit-content',
                                    }}>
                                        {a.generated_id}
                                    </span>

                                    {/* Joined */}
                                    <span style={{ fontSize: 12, color: '#6b7280' }}>
                                        {new Date(a.created_at).toLocaleDateString()}
                                    </span>

                                    {/* Status */}
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4, width: 'fit-content',
                                        padding: '3px 9px', borderRadius: 6, fontSize: 10,
                                        fontWeight: 700, color: st.color, background: st.bg,
                                        textTransform: 'uppercase', letterSpacing: 0.3,
                                    }}>
                                        <i className={`fa-solid ${st.icon}`} style={{ fontSize: 8 }} />
                                        {st.label}
                                    </span>

                                    {/* Actions */}
                                    <div style={{ textAlign: 'right' }}>
                                        {a.approval_status === 'pending' ? (
                                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                                                <button onClick={() => handleAction(a.id, 'approve')}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                                                        background: '#10b981', color: '#fff', fontSize: 11, fontWeight: 600,
                                                        display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                                    }}>
                                                    <i className="fa-solid fa-check" /> Approve
                                                </button>
                                                <button onClick={() => handleAction(a.id, 'reject')}
                                                    style={{
                                                        padding: '6px 12px', borderRadius: 8, border: '1px solid #e5e7eb', cursor: 'pointer',
                                                        background: '#fff', color: '#374151', fontSize: 11, fontWeight: 600,
                                                        display: 'flex', alignItems: 'center', gap: 4,
                                                    }}>
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span style={{ fontSize: 11, color: '#d1d5db', fontStyle: 'italic' }}>
                                                No actions
                                            </span>
                                        )}
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
                                Showing {filtered.length} records
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                                <span style={{ fontSize: 11, color: '#10b981', fontWeight: 600 }}>Live data</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

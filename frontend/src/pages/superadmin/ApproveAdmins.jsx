import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api';

export default function ApproveAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/admin/admins'); setAdmins(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async (id, action) => {
        try { await api.put(`/admin/${action}/${id}`); load(); }
        catch (err) { alert(err.response?.data?.detail || 'Failed'); }
    };

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-user-check text-xs mr-1.5" />
                        Verification
                    </p>
                    <h1>Admin Approval</h1>
                    <p>Review and approve admin account requests.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : admins.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-user-check" /></div>
                        <h3>No admin accounts</h3>
                        <p>Admin registration requests will appear here.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Admin</th>
                                        <th>Email</th>
                                        <th>ID</th>
                                        <th>Joined</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {admins.map((a, i) => (
                                        <tr key={a.id} className="animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {a.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm">{a.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-500">{a.email}</td>
                                            <td><span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{a.generated_id}</span></td>
                                            <td className="text-sm text-gray-500">{new Date(a.created_at).toLocaleDateString()}</td>
                                            <td><StatusBadge status={a.approval_status} /></td>
                                            <td className="text-right">
                                                {a.approval_status === 'pending' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => handleAction(a.id, 'approve')}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-all">
                                                            <i className="fa-solid fa-check mr-1" /> Approve
                                                        </button>
                                                        <button onClick={() => handleAction(a.id, 'reject')}
                                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-all">
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

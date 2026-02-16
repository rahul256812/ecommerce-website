import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api';

export default function SAManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

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

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-users text-xs mr-1.5" />
                        Platform Users
                    </p>
                    <h1>All Users</h1>
                    <p>View and manage all platform users.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>ID</th>
                                        <th>Status</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {u.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-500">{u.email}</td>
                                            <td><span className="badge bg-primary-50 text-primary-700 capitalize">{u.role}</span></td>
                                            <td><span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{u.generated_id}</span></td>
                                            <td><StatusBadge status={u.approval_status} /></td>
                                            <td className="text-right">
                                                <button onClick={() => setDeleteModal({ open: true, id: u.id, name: u.name })}
                                                    className="text-xs text-red-500 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, id: null, name: '' })} onConfirm={handleDelete}
                title="Delete User" message={`Delete ${deleteModal.name}? This cannot be undone.`} confirmText="Delete" danger />
        </Sidebar>
    );
}

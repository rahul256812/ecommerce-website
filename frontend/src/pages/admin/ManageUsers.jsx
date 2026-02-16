import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Modal from '../../components/Modal';
import api from '../../api';

export default function ManageUsers() {
    const [tab, setTab] = useState('vendors');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

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

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-users-gear text-xs mr-1.5" />
                        User Management
                    </p>
                    <h1>Manage Users</h1>
                    <p>View and manage platform users.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6">
                    {['vendors', 'buyers'].map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${tab === t
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {t}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : users.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-users" /></div>
                        <h3>No {tab} found</h3>
                        <p>There are currently no {tab} registered.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>ID</th>
                                        <th>Joined</th>
                                        <th className="text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((u, i) => (
                                        <tr key={u.id} className="animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
                                            <td>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-bold">
                                                        {u.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <span className="font-medium text-gray-900 text-sm">{u.name}</span>
                                                </div>
                                            </td>
                                            <td className="text-sm text-gray-500">{u.email}</td>
                                            <td><span className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded">{u.generated_id}</span></td>
                                            <td className="text-sm text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
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
                title="Remove User" message={`Remove ${deleteModal.name}? This will also delete all their associated data.`} confirmText="Remove" danger />
        </Sidebar>
    );
}

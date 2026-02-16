import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { useAuth } from '../../context/AuthContext';

export default function VendorProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.get('/users/me').then(res => { setProfile(res.data); setForm(res.data); }).catch(console.error);
    }, []);

    const handleSave = async () => {
        try {
            await api.put('/users/me', { name: form.name, address: form.address, date_of_birth: form.date_of_birth });
            setProfile({ ...profile, ...form });
            setEditing(false);
            setMsg('Profile updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); }
    };

    if (!profile) return <Sidebar><div className="flex justify-center py-24"><div className="spinner" /></div></Sidebar>;

    return (
        <Sidebar>
            <div className="max-w-2xl">
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-user-gear text-xs mr-1.5" />
                        Account
                    </p>
                    <h1>My Profile</h1>
                    <p>Manage your account information.</p>
                </div>

                {msg && (
                    <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 animate-scaleIn">
                        <i className="fa-solid fa-circle-check text-emerald-500 text-sm" />
                        <span className="text-sm text-emerald-700">{msg}</span>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
                    <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-xl">{profile.name?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{profile.name}</h2>
                            <p className="text-xs font-mono text-gray-400 bg-gray-50 px-2 py-0.5 rounded mt-1 inline-block">{profile.generated_id}</p>
                        </div>
                    </div>

                    {[
                        { label: 'Name', key: 'name', editable: true },
                        { label: 'Email', key: 'email', editable: false },
                        { label: 'Vendor ID', key: 'generated_id', editable: false },
                        { label: 'Address', key: 'address', editable: true },
                        { label: 'Date of Birth', key: 'date_of_birth', editable: true },
                    ].map(field => (
                        <div key={field.key}>
                            <label className="input-label">{field.label}</label>
                            {editing && field.editable ? (
                                <input value={form[field.key] || ''} onChange={(e) => setForm({ ...form, [field.key]: e.target.value })} className="input" />
                            ) : (
                                <p className="text-sm text-gray-900 font-medium py-2">{profile[field.key] || '—'}</p>
                            )}
                        </div>
                    ))}

                    {profile.id_proof_path && (
                        <div>
                            <label className="input-label">ID Proof</label>
                            <a href={profile.id_proof_path} target="_blank" className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center gap-1.5">
                                <i className="fa-solid fa-file text-xs" /> View uploaded document
                            </a>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        {editing ? (
                            <>
                                <button onClick={() => setEditing(false)} className="btn-secondary py-2.5 px-5">Cancel</button>
                                <button onClick={handleSave} className="btn-primary py-2.5 px-5">
                                    <i className="fa-solid fa-check text-xs" /> Save Changes
                                </button>
                            </>
                        ) : (
                            <button onClick={() => setEditing(true)} className="btn-secondary py-2.5 px-5">
                                <i className="fa-solid fa-pen text-xs" /> Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Sidebar>
    );
}

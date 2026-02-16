import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

export default function SASettings() {
    const [commission, setCommission] = useState('5');
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        api.get('/admin/commission').then(res => { setCommission(res.data.commission_percentage.toString()); setLoading(false); }).catch(console.error);
    }, []);

    const handleSave = async () => {
        try {
            await api.put('/admin/commission', { commission_percentage: parseFloat(commission) });
            setMsg('Commission updated!');
            setTimeout(() => setMsg(''), 3000);
        } catch (err) { console.error(err); }
    };

    return (
        <Sidebar>
            <div className="max-w-xl">
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-sliders text-xs mr-1.5" />
                        Configuration
                    </p>
                    <h1>Platform Settings</h1>
                    <p>Manage global platform configuration.</p>
                </div>

                {msg && (
                    <div className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 animate-scaleIn">
                        <i className="fa-solid fa-circle-check text-emerald-500 text-sm" />
                        <span className="text-sm text-emerald-700">{msg}</span>
                    </div>
                )}

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                            <i className="fa-solid fa-percent text-violet-600 text-sm" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-gray-900">Global Commission</h2>
                            <p className="text-xs text-gray-400">Commission charged on all orders</p>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-8"><div className="spinner" /></div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="input-label">Commission Percentage (%)</label>
                                <input type="number" step="0.1" min="0" max="100" value={commission} onChange={(e) => setCommission(e.target.value)} className="input" placeholder="5.0" />
                            </div>
                            <button onClick={handleSave} className="btn-primary py-2.5 px-5 text-sm">
                                <i className="fa-solid fa-check text-xs" /> Save Settings
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}

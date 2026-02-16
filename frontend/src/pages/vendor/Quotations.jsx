import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api';

export default function VendorQuotations() {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [respondForm, setRespondForm] = useState({ id: null, price: '', notes: '', action: '' });

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/rfq/vendor'); setRfqs(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleRespond = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/rfq/${respondForm.id}/respond`, {
                vendor_price: parseFloat(respondForm.price),
                vendor_notes: respondForm.notes,
                status: respondForm.action,
            });
            setRespondForm({ id: null, price: '', notes: '', action: '' });
            load();
        } catch (err) { console.error(err); }
    };

    const pending = rfqs.filter(r => r.status === 'pending');
    const past = rfqs.filter(r => r.status !== 'pending');

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-file-invoice text-xs mr-1.5" />
                        Quotations
                    </p>
                    <h1>Quotation Requests</h1>
                    <p>Review and respond to buyer quotation requests.</p>
                </div>

                {/* Pending */}
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-amber-400 rounded-full" />
                        Pending ({pending.length})
                    </h2>
                    {loading ? (
                        <div className="flex justify-center py-16"><div className="spinner" /></div>
                    ) : pending.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                            <p className="text-sm text-gray-400">No pending quotations</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {pending.map((r) => (
                                <div key={r.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fadeIn">
                                    <div className="px-5 py-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 text-sm">{r.product_name}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">From: {r.buyer_name} · Qty: {r.quantity} · Expected: ${r.expected_price.toFixed(2)}/unit</p>
                                        </div>
                                        <StatusBadge status={r.status} />
                                    </div>
                                    <div className="px-5 py-3 border-t border-gray-50">
                                        {respondForm.id === r.id ? (
                                            <form onSubmit={handleRespond} className="p-4 bg-gray-50 rounded-lg space-y-3">
                                                <div>
                                                    <label className="input-label">Your Price (per unit)</label>
                                                    <input type="number" step="0.01" value={respondForm.price} onChange={(e) => setRespondForm({ ...respondForm, price: e.target.value })} required className="input" />
                                                </div>
                                                <div>
                                                    <label className="input-label">Notes</label>
                                                    <textarea value={respondForm.notes} onChange={(e) => setRespondForm({ ...respondForm, notes: e.target.value })} rows={2} className="input resize-none" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button type="submit" onClick={() => setRespondForm({ ...respondForm, action: 'accepted' })}
                                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all">
                                                        <i className="fa-solid fa-check text-xs mr-1" /> Accept
                                                    </button>
                                                    <button type="submit" onClick={() => setRespondForm({ ...respondForm, action: 'revised' })}
                                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all">
                                                        <i className="fa-solid fa-pen text-xs mr-1" /> Revise
                                                    </button>
                                                    <button type="submit" onClick={() => setRespondForm({ ...respondForm, action: 'rejected' })}
                                                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all">
                                                        Reject
                                                    </button>
                                                    <button type="button" onClick={() => setRespondForm({ id: null, price: '', notes: '', action: '' })}
                                                        className="px-4 py-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-all ml-auto">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        ) : (
                                            <button onClick={() => setRespondForm({ id: r.id, price: r.expected_price.toString(), notes: '', action: '' })}
                                                className="btn-secondary text-sm py-2">
                                                <i className="fa-solid fa-reply text-xs" /> Respond
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Past */}
                <div>
                    <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-300 rounded-full" />
                        Past ({past.length})
                    </h2>
                    {past.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                            <p className="text-sm text-gray-400">No past quotations</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Buyer</th>
                                            <th>Qty</th>
                                            <th>Your Price</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {past.map((r, i) => (
                                            <tr key={r.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
                                                <td className="font-medium text-gray-900 text-sm">{r.product_name}</td>
                                                <td className="text-sm text-gray-600">{r.buyer_name}</td>
                                                <td className="text-sm">{r.quantity}</td>
                                                <td className="text-sm font-medium">{r.vendor_price ? `$${r.vendor_price.toFixed(2)}` : '—'}</td>
                                                <td><StatusBadge status={r.status} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}

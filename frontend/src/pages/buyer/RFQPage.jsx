import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api';
import { useNavigate } from 'react-router-dom';

export default function BuyerRFQ() {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => { load(); }, []);

    const load = async () => {
        try { const res = await api.get('/rfq/buyer'); setRfqs(res.data); }
        catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleAction = async (rfqId, action) => {
        try {
            await api.put(`/rfq/${rfqId}/buyer-action?action=${action}`);
            if (action === 'accept') navigate(`/buyer/checkout?rfq_id=${rfqId}`);
            else load();
        } catch (err) { console.error(err); }
    };

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-clipboard-list text-xs mr-1.5" />
                        Quotations
                    </p>
                    <h1>My RFQs</h1>
                    <p>Track your quotation requests and vendor responses.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : rfqs.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-clipboard-list" /></div>
                        <h3>No RFQs submitted yet</h3>
                        <p>Browse products and request quotes from vendors.</p>
                        <a href="/buyer/products" className="btn-primary mt-5 text-sm">
                            Browse Products <i className="fa-solid fa-arrow-right text-xs" />
                        </a>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {rfqs.map((r, i) => (
                            <div key={r.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-fadeIn" style={{ animationDelay: `${i * 40}ms` }}>
                                <div className="px-5 py-4 flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{r.product_name}</h3>
                                        <p className="text-xs text-gray-400 mt-0.5">Vendor: {r.vendor_name} · Qty: {r.quantity}</p>
                                    </div>
                                    <StatusBadge status={r.status} />
                                </div>
                                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50">
                                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                        <div>
                                            <span className="text-gray-400 text-xs">Your Price</span>
                                            <p className="font-semibold text-gray-900">${r.expected_price.toFixed(2)}/unit</p>
                                        </div>
                                        {r.vendor_price > 0 && (
                                            <div>
                                                <span className="text-gray-400 text-xs">Vendor Price</span>
                                                <p className="font-semibold text-gray-900">${r.vendor_price.toFixed(2)}/unit</p>
                                            </div>
                                        )}
                                    </div>
                                    {r.vendor_notes && (
                                        <div className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-100 mb-3">
                                            <i className="fa-solid fa-quote-left text-gray-300 text-xs mr-1.5" />{r.vendor_notes}
                                        </div>
                                    )}
                                    {(r.status === 'revised' || r.status === 'accepted') && r.status !== 'rejected' && (
                                        <div className="flex gap-2">
                                            <button onClick={() => handleAction(r.id, 'accept')}
                                                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-all">
                                                <i className="fa-solid fa-check text-xs mr-1" /> Accept & Proceed
                                            </button>
                                            <button onClick={() => handleAction(r.id, 'decline')}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-all">
                                                Decline
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Sidebar>
    );
}

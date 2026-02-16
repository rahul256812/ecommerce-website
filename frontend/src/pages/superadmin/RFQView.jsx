import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import api from '../../api';

export default function SARFQView() {
    const [rfqs, setRfqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        api.get('/rfq/all').then(res => setRfqs(res.data)).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? rfqs : rfqs.filter(r => r.status === filter);

    return (
        <Sidebar>
            <div>
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-clipboard-list text-xs mr-1.5" />
                        RFQ Overview
                    </p>
                    <h1>All RFQs</h1>
                    <p>Complete visibility into all quotation requests.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit mb-6 flex-wrap">
                    {['all', 'pending', 'accepted', 'rejected', 'revised'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200 ${filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}>
                            {f} ({f === 'all' ? rfqs.length : rfqs.filter(r => r.status === f).length})
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><div className="spinner" /></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon"><i className="fa-solid fa-clipboard-list" /></div>
                        <h3>No RFQs found</h3>
                        <p>No quotation requests match the current filter.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Buyer</th>
                                        <th>Vendor</th>
                                        <th>Qty</th>
                                        <th>Expected</th>
                                        <th>Vendor Price</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.map((r, i) => (
                                        <tr key={r.id} className="animate-fadeIn" style={{ animationDelay: `${i * 20}ms` }}>
                                            <td className="font-medium text-gray-900 text-sm">{r.product_name}</td>
                                            <td className="text-sm text-gray-600">{r.buyer_name}</td>
                                            <td className="text-sm text-gray-600">{r.vendor_name}</td>
                                            <td className="text-sm font-medium">{r.quantity}</td>
                                            <td className="text-sm font-medium">${r.expected_price?.toFixed(2)}</td>
                                            <td className="text-sm font-medium">{r.vendor_price > 0 ? `$${r.vendor_price?.toFixed(2)}` : '—'}</td>
                                            <td><StatusBadge status={r.status} /></td>
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

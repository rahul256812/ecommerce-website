import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import api from '../../api';

export default function Checkout() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const rfqId = searchParams.get('rfq_id');
    const [step, setStep] = useState(1);
    const [shipping, setShipping] = useState({ address: '', city: '', zip: '' });
    const [payment, setPayment] = useState('card');
    const [loading, setLoading] = useState(false);
    const [orderId, setOrderId] = useState(null);

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const endpoint = rfqId ? '/orders/from-rfq' : '/orders/from-cart';
            const res = await api.post(endpoint, {
                shipping_address: shipping.address, shipping_city: shipping.city, shipping_zip: shipping.zip,
                payment_method: payment, rfq_id: rfqId ? parseInt(rfqId) : null,
            });
            setOrderId(res.data.order_id);
            setStep(3);
        } catch (err) { alert(err.response?.data?.detail || 'Order failed'); }
        finally { setLoading(false); }
    };

    const paymentMethods = [
        { id: 'card', label: 'Credit / Debit Card', icon: 'fa-solid fa-credit-card', desc: 'Visa, Mastercard, AMEX' },
        { id: 'bank_transfer', label: 'Bank Transfer', icon: 'fa-solid fa-building-columns', desc: 'Direct bank payment' },
        { id: 'cod', label: 'Cash on Delivery', icon: 'fa-solid fa-money-bill-wave', desc: 'Pay when received' },
    ];

    return (
        <Sidebar>
            <div className="max-w-2xl mx-auto">
                <div className="page-header">
                    <p className="text-sm font-medium text-primary-600 mb-1">
                        <i className="fa-solid fa-bag-shopping text-xs mr-1.5" />
                        Checkout
                    </p>
                    <h1>Complete your order</h1>
                    <p>Review and confirm your purchase.</p>
                </div>

                {/* Steps */}
                <div className="flex items-center gap-0 mb-8">
                    {[
                        { num: 1, label: 'Shipping', icon: 'fa-solid fa-truck' },
                        { num: 2, label: 'Payment', icon: 'fa-solid fa-credit-card' },
                        { num: 3, label: 'Confirmation', icon: 'fa-solid fa-check' }
                    ].map((s, i) => (
                        <div key={s.num} className="flex items-center flex-1">
                            <div className="flex items-center gap-2.5 flex-shrink-0">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all ${step >= s.num ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-400'
                                    }`}>
                                    {step > s.num ? <i className="fa-solid fa-check text-xs" /> : <i className={`${s.icon} text-xs`} />}
                                </div>
                                <span className={`text-sm font-medium hidden sm:block ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>{s.label}</span>
                            </div>
                            {i < 2 && <div className={`flex-1 h-px mx-3 ${step > s.num ? 'bg-gray-900' : 'bg-gray-200'}`} />}
                        </div>
                    ))}
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    {step === 1 && (
                        <div className="space-y-5 animate-fadeIn">
                            <h2 className="font-semibold text-gray-900">Shipping Details</h2>
                            <div>
                                <label className="input-label">Address</label>
                                <textarea value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} rows={3} required className="input resize-none" placeholder="Enter your full shipping address" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">City</label>
                                    <input value={shipping.city} onChange={e => setShipping({ ...shipping, city: e.target.value })} className="input" placeholder="City" />
                                </div>
                                <div>
                                    <label className="input-label">ZIP Code</label>
                                    <input value={shipping.zip} onChange={e => setShipping({ ...shipping, zip: e.target.value })} className="input" placeholder="ZIP" />
                                </div>
                            </div>
                            <button onClick={() => { if (shipping.address) setStep(2); }} className="btn-primary w-full py-3 mt-2">
                                Continue to Payment <i className="fa-solid fa-arrow-right text-xs" />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5 animate-fadeIn">
                            <h2 className="font-semibold text-gray-900">Payment Method</h2>
                            <div className="space-y-3">
                                {paymentMethods.map(method => (
                                    <label key={method.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payment === method.id ? 'border-gray-900 bg-gray-50' : 'border-gray-100 hover:border-gray-200'
                                        }`}>
                                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${payment === method.id ? 'border-gray-900' : 'border-gray-300'
                                            }`}>
                                            {payment === method.id && <div className="w-2 h-2 rounded-full bg-gray-900" />}
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                                            <i className={`${method.icon} text-gray-600 text-sm`} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 text-sm">{method.label}</p>
                                            <p className="text-xs text-gray-400">{method.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button onClick={() => setStep(1)} className="btn-secondary py-2.5 px-5">
                                    <i className="fa-solid fa-arrow-left text-xs" /> Back
                                </button>
                                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 py-2.5 disabled:opacity-60">
                                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing Order...</> : <><i className="fa-solid fa-lock text-xs" /> Place Order</>}
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10 animate-scaleIn">
                            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <i className="fa-solid fa-circle-check text-emerald-500 text-2xl" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-1">Order Confirmed!</h2>
                            <p className="text-gray-500 text-sm mb-1">Your order #{orderId} has been placed successfully.</p>
                            <p className="text-xs text-gray-400 mb-6">You will receive a confirmation shortly.</p>
                            <div className="flex gap-3 justify-center">
                                <button onClick={() => navigate('/buyer/orders')} className="btn-primary py-2.5 px-5 text-sm">
                                    <i className="fa-solid fa-receipt text-xs" /> View Orders
                                </button>
                                <button onClick={() => navigate('/buyer/products')} className="btn-secondary py-2.5 px-5 text-sm">
                                    Continue Shopping
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Sidebar>
    );
}

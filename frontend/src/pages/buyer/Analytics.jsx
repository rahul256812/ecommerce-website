import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { convertAndFormatINR, formatINR, convertToINR } from '../../utils/currency';

export default function BuyerAnalytics() {
    const [activeTab, setActiveTab] = useState('purchase');
    const [loading, setLoading] = useState(true);
    const [purchaseData, setPurchaseData] = useState({});
    const [spendingData, setSpendingData] = useState({});
    const [budgetData, setBudgetData] = useState({});
    const [rfqData, setRfqData] = useState({});
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        if (activeTab === 'purchase') loadPurchaseReport();
        if (activeTab === 'spending') loadSpendingAnalytics();
        if (activeTab === 'budget') loadBudgetReport();
        if (activeTab === 'rfq') loadRfqReport();
    }, [activeTab]);

    const loadPurchaseReport = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/purchase-report', {
                params: dateRange
            });
            setPurchaseData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadSpendingAnalytics = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/spending-analytics');
            setSpendingData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadBudgetReport = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/budget-report');
            setBudgetData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadRfqReport = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/rfq-report');
            setRfqData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const tabs = [
        { key: 'purchase', label: 'Purchase Reports', icon: 'fa-shopping-cart', color: '#10b981' },
        { key: 'spending', label: 'Spending Analytics', icon: 'fa-chart-pie', color: '#f59e0b' },
        { key: 'budget', label: 'Budget Reports', icon: 'fa-wallet', color: '#6366f1' },
        { key: 'rfq', label: 'RFQ Analytics', icon: 'fa-file-invoice', color: '#8b5cf6' },
    ];

    const renderPurchaseReport = () => (
        <div>
            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-shopping-bag" style={{ color: '#10b981', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {purchaseData.total_purchases || 0}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Total Purchases</div>
                </div>
                
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-indian-rupee-sign" style={{ color: '#f59e0b', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {convertAndFormatINR(purchaseData.total_spent || 0)}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Total Spent</div>
                </div>
                
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-chart-line" style={{ color: '#6366f1', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {convertAndFormatINR(purchaseData.average_order_value || 0)}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Average Order Value</div>
                </div>
            </div>

            {/* Category-wise Spending */}
            {purchaseData.category_spending && (
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #f3f4f6' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
                        Category-wise Spending
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        {Object.entries(purchaseData.category_spending).map(([category, amount]) => (
                            <div key={category} style={{
                                padding: 16, borderRadius: 8, background: '#f9fafb',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
                                    {category}
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>
                                    {convertAndFormatINR(amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );

    const renderSpendingAnalytics = () => (
        <div>
            <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
                    Monthly Spending Trend ({spendingData.period_months} months)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                    {Object.entries(spendingData.monthly_spending || {}).map(([month, amount]) => (
                        <div key={month} style={{
                            padding: 16, borderRadius: 8, background: '#fff',
                            border: '1px solid #f3f4f6', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>
                                {new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </div>
                            <div style={{ fontSize: 20, fontWeight: 700, color: '#f59e0b' }}>
                                {convertAndFormatINR(amount)}
                            </div>
                            <div style={{
                                fontSize: 11, color: '#6b7280', marginTop: 4,
                                color: (spendingData.budget_utilization?.[month] || 0) > 90 ? '#ef4444' : 
                                      (spendingData.budget_utilization?.[month] || 0) > 80 ? '#f59e0b' : '#10b981'
                            }}>
                                {spendingData.budget_utilization?.[month]?.toFixed(1) || 0}% of budget
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-chart-pie" style={{ color: '#f59e0b', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {convertAndFormatINR(spendingData.total_spent || 0)}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Total Spent</div>
                </div>
                
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-calculator" style={{ color: '#6366f1', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {convertAndFormatINR(spendingData.average_monthly_spending || 0)}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Average Monthly</div>
                </div>
            </div>
        </div>
    );

    const renderBudgetReport = () => (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-wallet" style={{ color: '#6366f1', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {formatINR(budgetData.monthly_budget || 0)}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Monthly Budget</div>
                </div>
                
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-shopping-cart" style={{ color: '#10b981', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {formatINR(budgetData.actual_spent || 0)}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Actual Spent</div>
                </div>
                
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: budgetData.status === 'over_budget' ? '#fee2e2' : '#f0fdf4',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-chart-pie" style={{ 
                            color: budgetData.status === 'over_budget' ? '#ef4444' : '#10b981', 
                            fontSize: 20 
                        }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {formatINR(budgetData.remaining_budget || 0)}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Remaining Budget</div>
                </div>
            </div>

            {/* Budget Utilization */}
            <div style={{ marginTop: 24, background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #f3f4f6' }}>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 16 }}>
                    Budget Utilization
                </h3>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 14, color: '#6b7280' }}>Utilization</span>
                        <span style={{ 
                            fontSize: 16, fontWeight: 700,
                            color: budgetData.utilization_percentage > 90 ? '#ef4444' : 
                                  budgetData.utilization_percentage > 80 ? '#f59e0b' : '#10b981'
                        }}>
                            {budgetData.utilization_percentage?.toFixed(1) || 0}%
                        </span>
                    </div>
                    <div style={{
                        height: 8, borderRadius: 4, background: '#e5e7eb',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%', borderRadius: 4,
                            width: `${Math.min(100, budgetData.utilization_percentage || 0)}%`,
                            background: budgetData.utilization_percentage > 90 ? '#ef4444' : 
                                      budgetData.utilization_percentage > 80 ? '#f59e0b' : '#10b981',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>
                </div>
                <div style={{
                    padding: 12, borderRadius: 8,
                    background: budgetData.status === 'over_budget' ? '#fef2f2' : '#f0fdf4',
                    border: `1px solid ${budgetData.status === 'over_budget' ? '#fecaca' : '#bbf7d0'}`
                }}>
                    <span style={{
                        fontSize: 14, fontWeight: 600,
                        color: budgetData.status === 'over_budget' ? '#b91c1c' : '#166534'
                    }}>
                        {budgetData.status === 'over_budget' ? '⚠️ Over Budget' : '✅ On Track'}
                    </span>
                </div>
            </div>
        </div>
    );

    const renderRfqReport = () => (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 24 }}>
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-file-invoice" style={{ color: '#6366f1', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {rfqData.total_rfqs || 0}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Total RFQs</div>
                </div>
                
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-check-circle" style={{ color: '#10b981', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {rfqData.accepted_rfqs || 0}
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Accepted RFQs</div>
                </div>
                
                <div style={{
                    background: '#fff', borderRadius: 12, padding: 24,
                    border: '1px solid #f3f4f6', textAlign: 'center'
                }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 12,
                        background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <i className="fa-solid fa-percentage" style={{ color: '#f59e0b', fontSize: 20 }} />
                    </div>
                    <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                        {rfqData.success_rate || 0}%
                    </div>
                    <div style={{ fontSize: 14, color: '#6b7280' }}>Success Rate</div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <div style={{
                        width: 36, height: 36, border: '3px solid #e5e7eb',
                        borderTop: '3px solid #10b981', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            );
        }

        switch (activeTab) {
            case 'purchase': return renderPurchaseReport();
            case 'spending': return renderSpendingAnalytics();
            case 'budget': return renderBudgetReport();
            case 'rfq': return renderRfqReport();
            default: return null;
        }
    };

    return (
        <Sidebar>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 12px', borderRadius: 20, marginBottom: 12,
                        background: '#f0fdf4', color: '#10b981', fontSize: 12, fontWeight: 600
                    }}>
                        <i className="fa-solid fa-chart-pie" style={{ fontSize: 10 }} />
                        Analytics
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, margin: '0 0 4px 0' }}>
                        Buyer Analytics
                    </h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                        Track your purchases, spending patterns, and budget utilization.
                    </p>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            style={{
                                padding: '12px 20px', borderRadius: '8px 8px 0 0', border: 'none',
                                background: activeTab === tab.key ? tab.color : 'transparent',
                                color: activeTab === tab.key ? '#fff' : '#6b7280',
                                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                                transition: 'all 0.15s', borderBottom: activeTab === tab.key ? `3px solid ${tab.color}` : '3px solid transparent'
                            }}
                        >
                            <i className={`fa-solid ${tab.icon}`} style={{ marginRight: 6, fontSize: 12 }} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {renderContent()}
            </div>
        </Sidebar>
    );
}

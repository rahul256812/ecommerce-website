import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import api from '../../api';
import { formatINR } from '../../utils/currency';

export default function VendorAnalytics() {
    const [activeTab, setActiveTab] = useState('forecast');
    const [loading, setLoading] = useState(true);
    const [forecastData, setForecastData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [conversionData, setConversionData] = useState({});
    const [commissionData, setCommissionData] = useState([]);
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    useEffect(() => {
        if (activeTab === 'forecast') loadForecast();
        if (activeTab === 'performance') loadPerformance();
        if (activeTab === 'conversion') loadConversion();
        if (activeTab === 'commission') loadCommission();
    }, [activeTab]);

    const loadForecast = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/sales-forecast');
            setForecastData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadPerformance = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/product-performance');
            setPerformanceData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadConversion = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/conversion-rates');
            setConversionData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const loadCommission = async () => {
        try {
            setLoading(true);
            const res = await api.get('/analytics/commission-history');
            setCommissionData(res.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const tabs = [
        { key: 'forecast', label: 'Sales Forecast', icon: 'fa-chart-line', color: '#6366f1' },
        { key: 'performance', label: 'Product Performance', icon: 'fa-chart-bar', color: '#10b981' },
        { key: 'conversion', label: 'Conversion Rates', icon: 'fa-percentage', color: '#f59e0b' },
        { key: 'commission', label: 'Commission History', icon: 'fa-coins', color: '#8b5cf6' },
    ];

    const renderForecast = () => (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 24 }}>
                {forecastData.map((item, i) => (
                    <div key={i} style={{
                        background: '#fff', borderRadius: 12, padding: 20,
                        border: '1px solid #f3f4f6', boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 10,
                                background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <i className="fa-solid fa-box" style={{ color: '#6366f1', fontSize: 16 }} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: 0 }}>{item.product_name}</h3>
                                <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0 0' }}>{item.period} forecast</p>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            <div>
                                <span style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' }}>Historical Sales</span>
                                <p style={{ fontSize: 16, fontWeight: 700, color: '#374151', margin: '4px 0 0 0' }}>{item.historical_sales}</p>
                            </div>
                            <div>
                                <span style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase' }}>Forecasted Sales</span>
                                <p style={{ fontSize: 16, fontWeight: 700, color: '#6366f1', margin: '4px 0 0 0' }}>{item.forecasted_sales}</p>
                            </div>
                        </div>
                        <div style={{ marginTop: 12, padding: '12px 0', borderTop: '1px solid #f3f4f6' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: 12, color: '#6b7280' }}>Forecasted Revenue</span>
                                <span style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>
                                    {convertAndFonvertAndFormatINR(item.forecasted_revenue)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderPerformance = () => (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <span style={{ color: '#6b7280' }}>to</span>
                <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #e5e7eb' }}
                />
                <button
                    onClick={loadPerformance}
                    style={{
                        padding: '8px 16px', borderRadius: 8, border: 'none',
                        background: '#6366f1', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    Apply Filter
                </button>
            </div>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '16px 20px', background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                    {['Product', 'Category', 'Sales', 'Revenue', 'Score'].map(header => (
                        <span key={header} style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                            {header}
                        </span>
                    ))}
                </div>
                {performanceData.map((item, i) => (
                    <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                        padding: '16px 20px', borderBottom: i < performanceData.length - 1 ? '1px solid #f9fafb' : 'none',
                        alignItems: 'center', transition: 'background 0.15s'
                    }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <i className="fa-solid fa-box" style={{ color: '#6b7280', fontSize: 12 }} />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{item.product_name}</span>
                        </div>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>{item.category}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{item.total_sales}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#10b981' }}>
                            {formatINR(item.total_revenue)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: item.performance_score > 80 ? '#10b981' : item.performance_score > 50 ? '#f59e0b' : '#ef4444'
                            }} />
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>
                                {item.performance_score}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderConversion = () => (
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
                    <i className="fa-solid fa-users" style={{ color: '#f59e0b', fontSize: 20 }} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                    {conversionData.total_visitors || 0}
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Total Visitors</div>
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
                    {conversionData.conversions || 0}
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Conversions</div>
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
                    <i className="fa-solid fa-percentage" style={{ color: '#6366f1', fontSize: 20 }} />
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                    {conversionData.conversion_rate || 0}%
                </div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>Conversion Rate</div>
            </div>
        </div>
    );

    const renderCommission = () => (
        <div>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #f3f4f6' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '16px 20px', background: '#fafafa', borderBottom: '1px solid #f3f4f6' }}>
                    {['Order ID', 'Date', 'Amount', 'Commission'].map(header => (
                        <span key={header} style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase' }}>
                            {header}
                        </span>
                    ))}
                </div>
                {commissionData.map((item, i) => (
                    <div key={i} style={{
                        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr',
                        padding: '16px 20px', borderBottom: i < commissionData.length - 1 ? '1px solid #f9fafb' : 'none',
                        alignItems: 'center'
                    }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>#{item.order_id}</span>
                        <span style={{ fontSize: 13, color: '#6b7280' }}>
                            {new Date(item.order_date).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>
                            {formatINR(item.total_amount)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6' }}>
                                {formatINR(item.commission_amount)}
                            </span>
                            <span style={{
                                fontSize: 11, padding: '2px 6px', borderRadius: 4,
                                background: item.status === 'paid' ? '#d1fae5' : '#fef3c7',
                                color: item.status === 'paid' ? '#065f46' : '#92400e'
                            }}>
                                {item.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                    <div style={{
                        width: 36, height: 36, border: '3px solid #e5e7eb',
                        borderTop: '3px solid #6366f1', borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                    }} />
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
            );
        }

        switch (activeTab) {
            case 'forecast': return renderForecast();
            case 'performance': return renderPerformance();
            case 'conversion': return renderConversion();
            case 'commission': return renderCommission();
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
                        background: '#eef2ff', color: '#6366f1', fontSize: 12, fontWeight: 600
                    }}>
                        <i className="fa-solid fa-chart-line" style={{ fontSize: 10 }} />
                        Analytics
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', letterSpacing: -0.5, margin: '0 0 4px 0' }}>
                        Vendor Analytics
                    </h1>
                    <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>
                        Track your sales performance, forecasts, and business insights.
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

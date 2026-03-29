import { formatUSD, convertAndFormatINR, USD_TO_INR_RATE } from '../utils/currency';

export default function CurrencyBadge({ showUSD = false }) {
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 12px',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: 8,
            fontSize: 11,
            color: '#166534',
            fontWeight: 600,
        }}>
            <i className="fa-solid fa-indian-rupee-sign" style={{ fontSize: 10 }} />
            <span>All prices in INR</span>
            {showUSD && (
                <span style={{ color: '#64748b', fontSize: 10 }}>
                    (1 USD ≈ {USD_TO_INR_RATE})
                </span>
            )}
        </div>
    );
}

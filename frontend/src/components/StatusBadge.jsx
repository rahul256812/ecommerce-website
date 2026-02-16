export default function StatusBadge({ status }) {
    const config = {
        pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
        accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
        approved: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
        rejected: { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-400' },
        revised: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-400' },
        confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
        shipped: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
        delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
        cancelled: { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' },
    };

    const s = config[status] || { bg: 'bg-gray-50', text: 'text-gray-600', dot: 'bg-gray-400' };

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {status}
        </span>
    );
}

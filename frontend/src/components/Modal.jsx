export default function Modal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-scaleIn" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-start gap-4 mb-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? 'bg-red-50' : 'bg-primary-50'}`}>
                        <i className={`fa-solid ${danger ? 'fa-triangle-exclamation text-red-500' : 'fa-circle-question text-primary-600'}`} />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
                    </div>
                </div>
                <div className="flex gap-3 justify-end">
                    <button onClick={onClose} className="btn-secondary py-2 px-4 text-sm">Cancel</button>
                    <button onClick={onConfirm}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-xl transition-all ${danger
                                ? 'bg-red-500 hover:bg-red-600 shadow-sm shadow-red-500/20'
                                : 'bg-primary-600 hover:bg-primary-700 shadow-sm shadow-primary-600/20'
                            }`}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}

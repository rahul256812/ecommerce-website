import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-all duration-300">
                            <span className="text-white font-bold text-sm">B2B</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                            TradeHub
                        </span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/login/admin"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                        >
                            Admin
                        </Link>
                        <Link
                            to="/login/vendor"
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                        >
                            Vendor
                        </Link>
                        <Link
                            to="/login/buyer"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-lg shadow-primary-600/25 hover:shadow-primary-600/40 transition-all duration-200"
                        >
                            Buyer
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

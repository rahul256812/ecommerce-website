import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const menuItems = {
    vendor: [
        { label: 'Dashboard', path: '/vendor', icon: 'fa-solid fa-chart-pie' },
        { label: 'My Products', path: '/vendor/products', icon: 'fa-solid fa-boxes-stacked' },
        { label: 'Add Product', path: '/vendor/products/add', icon: 'fa-solid fa-circle-plus' },
        { label: 'Quotations', path: '/vendor/quotations', icon: 'fa-solid fa-file-invoice' },
        { label: 'Profile', path: '/vendor/profile', icon: 'fa-solid fa-user' },
    ],
    buyer: [
        { label: 'Dashboard', path: '/buyer', icon: 'fa-solid fa-chart-pie' },
        { label: 'Products', path: '/buyer/products', icon: 'fa-solid fa-bag-shopping' },
        { label: 'My RFQs', path: '/buyer/rfq', icon: 'fa-solid fa-clipboard-list' },
        { label: 'Cart', path: '/buyer/cart', icon: 'fa-solid fa-cart-shopping' },
        { label: 'Orders', path: '/buyer/orders', icon: 'fa-solid fa-truck-fast' },
        { label: 'Profile', path: '/buyer/profile', icon: 'fa-solid fa-user' },
    ],
    admin: [
        { label: 'Dashboard', path: '/admin', icon: 'fa-solid fa-chart-pie' },
        { label: 'Manage Users', path: '/admin/users', icon: 'fa-solid fa-users-gear' },
        { label: 'RFQ Monitoring', path: '/admin/rfq', icon: 'fa-solid fa-clipboard-check' },
        { label: 'Orders', path: '/admin/orders', icon: 'fa-solid fa-box' },
    ],
    super_admin: [
        { label: 'Dashboard', path: '/superadmin', icon: 'fa-solid fa-gauge-high' },
        { label: 'Approve Admins', path: '/superadmin/approve', icon: 'fa-solid fa-user-check' },
        { label: 'All Users', path: '/superadmin/users', icon: 'fa-solid fa-users' },
        { label: 'All Products', path: '/superadmin/products', icon: 'fa-solid fa-cubes' },
        { label: 'All RFQs', path: '/superadmin/rfq', icon: 'fa-solid fa-clipboard-list' },
        { label: 'Orders', path: '/superadmin/orders', icon: 'fa-solid fa-receipt' },
        { label: 'Settings', path: '/superadmin/settings', icon: 'fa-solid fa-gear' },
    ],
};

export default function Sidebar({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const items = menuItems[user?.role] || [];
    const [collapsed, setCollapsed] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const rolePath = user?.role?.replace('super_admin', 'superadmin');

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className="relative flex flex-col border-r border-gray-200/60 bg-white shadow-lg"
                style={{
                    width: collapsed ? '72px' : '260px',
                    minWidth: collapsed ? '72px' : '260px',
                    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
                }}
            >
                {/* Brand Header */}
                <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
                    <div
                        className="flex items-center justify-center rounded-xl shadow-lg"
                        style={{
                            width: '40px',
                            height: '40px',
                            minWidth: '40px',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
                        }}
                    >
                        <i className="fa-solid fa-store text-white text-base" />
                    </div>
                    {!collapsed && (
                        <div style={{ animation: 'fadeIn 0.25s ease-out' }}>
                            <h2 className="font-bold text-gray-900 text-sm tracking-tight leading-none">TradeHub</h2>
                            <p className="text-xs text-gray-400 mt-0.5 capitalize">{user?.role?.replace('_', ' ')}</p>
                        </div>
                    )}
                </div>

                {/* Toggle Button */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute z-10 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-md hover:shadow-lg hover:bg-primary-50 hover:border-primary-200 transition-all duration-200"
                    style={{
                        top: '72px',
                        right: '-14px',
                        width: '28px',
                        height: '28px',
                    }}
                    title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    <i className={`fa-solid fa-chevron-${collapsed ? 'right' : 'left'} text-gray-500 text-[10px]`} />
                </button>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {!collapsed && (
                        <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                            Menu
                        </p>
                    )}
                    {items.map((item, index) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === `/${rolePath}`}
                            title={collapsed ? item.label : undefined}
                            className={({ isActive }) =>
                                [
                                    'group flex items-center rounded-xl text-sm font-medium transition-all duration-200',
                                    collapsed ? 'justify-center px-0 py-3 mx-auto' : 'gap-3 px-3 py-2.5',
                                    isActive
                                        ? 'bg-gradient-to-r from-primary-50 to-primary-100/60 text-primary-700 shadow-sm border border-primary-100'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent',
                                ].join(' ')
                            }
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            {({ isActive }) => (
                                <>
                                    <i
                                        className={`${item.icon} text-[15px] ${isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'} transition-colors duration-200`}
                                        style={{ width: '20px', textAlign: 'center' }}
                                    />
                                    {!collapsed && (
                                        <span style={{ animation: 'fadeIn 0.2s ease-out' }}>{item.label}</span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Footer */}
                <div className="border-t border-gray-100 px-3 py-3">
                    {/* User Info */}
                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : 'px-2'} py-2 mb-1`}>
                        <div
                            className="flex items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600"
                            style={{ width: '34px', height: '34px', minWidth: '34px' }}
                        >
                            <span className="text-white font-semibold text-xs">
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0" style={{ animation: 'fadeIn 0.25s ease-out' }}>
                                <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{user?.name}</p>
                                <p className="text-[11px] text-gray-400 truncate">{user?.generated_id}</p>
                            </div>
                        )}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Logout' : undefined}
                        className={`w-full flex items-center rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 ${collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'}`}
                    >
                        <i className="fa-solid fa-right-from-bracket text-[14px]" style={{ width: '20px', textAlign: 'center' }} />
                        {!collapsed && <span style={{ animation: 'fadeIn 0.2s ease-out' }}>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-7xl mx-auto animate-fadeIn">{children}</div>
            </main>
        </div>
    );
}

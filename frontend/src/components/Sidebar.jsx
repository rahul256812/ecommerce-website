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
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const [logoutHover, setLogoutHover] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };
    const rolePath = user?.role?.replace('super_admin', 'superadmin');
    const sidebarW = collapsed ? 76 : 264;

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8f9fb' }}>

            {/* ──── Sidebar ──── */}
            <aside style={{
                width: sidebarW, minWidth: sidebarW,
                transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', flexDirection: 'column', position: 'relative',
                background: '#ffffff',
                borderRight: '1px solid #f0f0f5',
                boxShadow: '2px 0 20px rgba(0,0,0,0.03)',
            }}>

                {/* Brand */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: collapsed ? '20px 18px' : '20px 20px',
                    borderBottom: '1px solid #f3f4f6'
                }}>
                    <div style={{
                        width: 38, height: 38, minWidth: 38, borderRadius: 11,
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <i className="fa-solid fa-store" style={{ color: '#fff', fontSize: 14 }} />
                    </div>
                    {!collapsed && (
                        <div>
                            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#111827', letterSpacing: -0.3, lineHeight: 1, margin: 0 }}>
                                TradeHub
                            </h2>
                            <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 3, textTransform: 'capitalize' }}>
                                {user?.role?.replace('_', ' ')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Collapse toggle */}
                <button onClick={() => setCollapsed(!collapsed)} style={{
                    position: 'absolute', top: 68, right: -14, zIndex: 10,
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#fff', border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'box-shadow 0.2s',
                }}>
                    <i className={`fa-solid fa-chevron-${collapsed ? 'right' : 'left'}`}
                        style={{ fontSize: 9, color: '#6b7280' }} />
                </button>

                {/* Nav */}
                <nav style={{
                    flex: 1, overflowY: 'auto', padding: collapsed ? '16px 10px' : '16px 12px',
                }}>
                    {!collapsed && (
                        <p style={{
                            fontSize: 10, fontWeight: 600, textTransform: 'uppercase',
                            letterSpacing: 1.5, color: '#c4c8d0', padding: '0 10px',
                            marginBottom: 8,
                        }}>Navigation</p>
                    )}
                    {items.map((item, i) => {
                        const isHovered = hoveredIdx === i;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === `/${rolePath}`}
                                title={collapsed ? item.label : undefined}
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                style={({ isActive }) => ({
                                    display: 'flex', alignItems: 'center',
                                    gap: collapsed ? 0 : 12,
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    padding: collapsed ? '11px 0' : '9px 12px',
                                    borderRadius: 10, marginBottom: 2,
                                    fontSize: 13, fontWeight: isActive ? 600 : 500,
                                    textDecoration: 'none',
                                    transition: 'all 0.15s ease',
                                    background: isActive
                                        ? 'linear-gradient(135deg, #eef2ff, #e0e7ff)'
                                        : isHovered ? '#f9fafb' : 'transparent',
                                    color: isActive ? '#4338ca' : isHovered ? '#111827' : '#6b7280',
                                    border: isActive ? '1px solid #c7d2fe' : '1px solid transparent',
                                })}
                            >
                                {({ isActive }) => (
                                    <>
                                        <i className={item.icon} style={{
                                            fontSize: 14, width: 20, textAlign: 'center',
                                            color: isActive ? '#6366f1' : isHovered ? '#6366f1' : '#9ca3af',
                                            transition: 'color 0.15s ease',
                                        }} />
                                        {!collapsed && <span>{item.label}</span>}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User footer */}
                <div style={{ borderTop: '1px solid #f3f4f6', padding: collapsed ? '12px 10px' : '12px 14px' }}>
                    {/* Profile */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        justifyContent: collapsed ? 'center' : 'flex-start',
                        padding: collapsed ? '8px 0' : '8px 8px', marginBottom: 4,
                    }}>
                        <div style={{
                            width: 34, height: 34, minWidth: 34, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: 12 }}>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </span>
                        </div>
                        {!collapsed && (
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{
                                    fontSize: 13, fontWeight: 600, color: '#111827',
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0,
                                }}>{user?.name}</p>
                                <p style={{
                                    fontSize: 11, color: '#9ca3af', margin: 0,
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                }}>{user?.generated_id}</p>
                            </div>
                        )}
                    </div>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        onMouseEnter={() => setLogoutHover(true)}
                        onMouseLeave={() => setLogoutHover(false)}
                        style={{
                            width: '100%', display: 'flex', alignItems: 'center',
                            gap: collapsed ? 0 : 12,
                            justifyContent: collapsed ? 'center' : 'flex-start',
                            padding: collapsed ? '9px 0' : '9px 12px',
                            borderRadius: 10, border: 'none',
                            background: logoutHover ? '#fef2f2' : 'transparent',
                            color: '#ef4444', fontSize: 13, fontWeight: 500,
                            cursor: 'pointer', transition: 'background 0.15s ease',
                        }}
                    >
                        <i className="fa-solid fa-right-from-bracket" style={{ fontSize: 13, width: 20, textAlign: 'center' }} />
                        {!collapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* ──── Main Content ──── */}
            <main style={{ flex: 1, overflowY: 'auto' }}>
                <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}

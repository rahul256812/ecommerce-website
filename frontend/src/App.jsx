import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import AddProduct from './pages/vendor/AddProduct';
import VendorQuotations from './pages/vendor/Quotations';
import VendorAnalytics from './pages/vendor/Analytics';
import VendorProfile from './pages/vendor/Profile';

import BuyerDashboard from './pages/buyer/Dashboard';
import BuyerProducts from './pages/buyer/Products';
import BuyerRFQ from './pages/buyer/RFQPage';
import BuyerCart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import BuyerOrders from './pages/buyer/Orders';
import BuyerAnalytics from './pages/buyer/Analytics';
import BuyerProfile from './pages/buyer/Profile';

import AdminDashboard from './pages/admin/Dashboard';
import ManageUsers from './pages/admin/ManageUsers';
import RFQMonitoring from './pages/admin/RFQMonitoring';
import AdminOrders from './pages/admin/Orders';
import AdminProfile from './pages/admin/Profile';

import SADashboard from './pages/superadmin/Dashboard';
import ApproveAdmins from './pages/superadmin/ApproveAdmins';
import SAManageUsers from './pages/superadmin/ManageUsers';
import SAProducts from './pages/superadmin/Products';
import SARFQView from './pages/superadmin/RFQView';
import SAOrders from './pages/superadmin/Orders';
import SASettings from './pages/superadmin/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/signup/:role" element={<Signup />} />

          {/* Vendor */}
          <Route path="/vendor" element={<ProtectedRoute roles={['vendor']}><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/products" element={<ProtectedRoute roles={['vendor']}><VendorProducts /></ProtectedRoute>} />
          <Route path="/vendor/products/add" element={<ProtectedRoute roles={['vendor']}><AddProduct /></ProtectedRoute>} />
          <Route path="/vendor/quotations" element={<ProtectedRoute roles={['vendor']}><VendorQuotations /></ProtectedRoute>} />
          <Route path="/vendor/analytics" element={<ProtectedRoute roles={['vendor']}><VendorAnalytics /></ProtectedRoute>} />
          <Route path="/vendor/profile" element={<ProtectedRoute roles={['vendor']}><VendorProfile /></ProtectedRoute>} />

          {/* Buyer */}
          <Route path="/buyer" element={<ProtectedRoute roles={['buyer']}><BuyerDashboard /></ProtectedRoute>} />
          <Route path="/buyer/products" element={<ProtectedRoute roles={['buyer']}><BuyerProducts /></ProtectedRoute>} />
          <Route path="/buyer/rfq" element={<ProtectedRoute roles={['buyer']}><BuyerRFQ /></ProtectedRoute>} />
          <Route path="/buyer/cart" element={<ProtectedRoute roles={['buyer']}><BuyerCart /></ProtectedRoute>} />
          <Route path="/buyer/checkout" element={<ProtectedRoute roles={['buyer']}><Checkout /></ProtectedRoute>} />
          <Route path="/buyer/orders" element={<ProtectedRoute roles={['buyer']}><BuyerOrders /></ProtectedRoute>} />
          <Route path="/buyer/analytics" element={<ProtectedRoute roles={['buyer']}><BuyerAnalytics /></ProtectedRoute>} />
          <Route path="/buyer/profile" element={<ProtectedRoute roles={['buyer']}><BuyerProfile /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/rfq" element={<ProtectedRoute roles={['admin']}><RFQMonitoring /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/profile" element={<ProtectedRoute roles={['admin']}><AdminProfile /></ProtectedRoute>} />

          {/* Super Admin */}
          <Route path="/superadmin" element={<ProtectedRoute roles={['super_admin']}><SADashboard /></ProtectedRoute>} />
          <Route path="/superadmin/approve" element={<ProtectedRoute roles={['super_admin']}><ApproveAdmins /></ProtectedRoute>} />
          <Route path="/superadmin/users" element={<ProtectedRoute roles={['super_admin']}><SAManageUsers /></ProtectedRoute>} />
          <Route path="/superadmin/products" element={<ProtectedRoute roles={['super_admin']}><SAProducts /></ProtectedRoute>} />
          <Route path="/superadmin/rfq" element={<ProtectedRoute roles={['super_admin']}><SARFQView /></ProtectedRoute>} />
          <Route path="/superadmin/orders" element={<ProtectedRoute roles={['super_admin']}><SAOrders /></ProtectedRoute>} />
          <Route path="/superadmin/settings" element={<ProtectedRoute roles={['super_admin']}><SASettings /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

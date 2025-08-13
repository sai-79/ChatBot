import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { NhostClient, NhostProvider, useAuthenticationStatus } from '@nhost/react';
import Layout from './components/Layout';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';

import { NhostApolloProvider } from '@nhost/react-apollo';
const nhost = new NhostClient({
  subdomain: process.env.REACT_APP_NHOST_SUBDOMAIN || "",
  region: process.env.REACT_APP_NHOST_REGION || ""
});


function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();

  if (isLoading) return <div>Loading...</div>;

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
}

function App() {
  return (
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
      <BrowserRouter>
        <Routes>
          <Route path="sign-up" element={<SignUp />} />
          <Route path="sign-in" element={<SignIn />} />
          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
       </NhostApolloProvider>
    </NhostProvider>
  );
}

export default App;

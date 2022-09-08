import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom';
import Login from 'pages/login/login';
import Dashboard from 'pages/dashboard/dashboard';

const ProtectedRoute = ({ user, redirectPath = '/login' }) => {
  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

function App() {
  const [user, setUser] = React.useState(null);
  return (
    <>
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login handleLogin={setUser}/>} />
        <Route element={<ProtectedRoute user={user} />}>
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </>
  );
}

export default App;

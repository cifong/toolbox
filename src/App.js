import React from "react";
import {
  Routes,
  Route,
} from 'react-router-dom';
import 'assets/App.css';
import Header from "components/header";
import Login from 'pages/login/login';
import Dashboard from 'pages/dashboard/dashboard';
import HabitTrack from "pages/habittrack/habittrack";
import Meals from "pages/meals/meals";
import Worksignin from "pages/worksignin/worksignin";
import WorkoutTimerIndex from "pages/workouttimer/index";
import WorkoutTimer from "pages/workouttimer/timer";
import Settings from "pages/settings/settings";
import { AuthProvider, ProtectedRoute } from "components/authContextProvider";
import Navigation from "components/navigation";
function App() {
  return (
    <AuthProvider>
      <Navigation />
      <Header />
      <Routes>
        <Route index element={<Login />} />
        <Route path="login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="habittrack" element={<HabitTrack />} />
          <Route path="meals" element={<Meals />} />
          <Route path="worksignin" element={<Worksignin />} />
          <Route path="workouttimer" element={<WorkoutTimerIndex />} />
          <Route path="workouttimer/:tid" element={<WorkoutTimer />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<span>There's nothing here: 404!</span>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

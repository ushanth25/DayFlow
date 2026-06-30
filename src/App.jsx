import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';
import OnboardingSplash from './screens/OnboardingSplash';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import WeeklyCalendar from './screens/WeeklyCalendar';
import RemindersList from './screens/RemindersList';
import ProfileScreen from './screens/ProfileScreen';
import ReminderSetup from './screens/ReminderSetup';

// Protected Route — redirects to /auth if not logged in
const ProtectedRoute = ({ children }) => {
    const [session, setSession] = useState(undefined); // undefined = still loading

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    if (session === undefined) {
        return <div className="min-h-screen bg-surface flex items-center justify-center">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
        </div>;
    }

    return session ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OnboardingSplash />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/home" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><WeeklyCalendar /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><RemindersList /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/reminder-setup" element={<ProtectedRoute><ReminderSetup /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

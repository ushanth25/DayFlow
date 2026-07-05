import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
} from 'firebase/auth';
import DayFlowLogo from '../components/DayFlowLogo';

const AuthScreen = () => {
    const navigate = useNavigate();
    const [tab, setTab] = useState('signup'); // 'signup' or 'login'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // If already logged in, go to home
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) navigate('/home');
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will detect the new user and redirect to /home
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // onAuthStateChanged will detect sign-in and redirect to /home
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-lg py-xl">
            <div className="w-full max-w-[390px]">
                {/* Branding */}
                <div className="flex flex-col items-center mb-xl">
                    <DayFlowLogo size={64} />
                    <h1 className="font-display-lg text-display-lg text-primary mt-md">DayFlow</h1>
                    <p className="font-body-sm text-body-sm text-secondary mt-xs text-center">
                        Your daily rhythm, visualized and managed effortlessly.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-surface-container p-xs rounded-full mb-lg">
                    <button
                        onClick={() => { setTab('signup'); setError(''); setSuccess(''); }}
                        className={`flex-1 py-sm rounded-full font-label-md text-label-md transition-all duration-200 ${
                            tab === 'signup' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
                        }`}
                    >
                        Sign Up
                    </button>
                    <button
                        onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
                        className={`flex-1 py-sm rounded-full font-label-md text-label-md transition-all duration-200 ${
                            tab === 'login' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant'
                        }`}
                    >
                        Log In
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={tab === 'signup' ? handleSignUp : handleLogin} className="space-y-md">
                    {/* Email */}
                    <div>
                        <label className="font-label-md text-label-md text-secondary block mb-xs">Email</label>
                        <div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-xl px-md py-sm focus-within:border-primary transition-colors">
                            <span className="material-symbols-outlined text-secondary text-[20px]">mail</span>
                            <input
                                type="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="flex-1 bg-transparent outline-none font-body-lg text-body-lg text-primary placeholder:text-on-surface-variant"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="font-label-md text-label-md text-secondary block mb-xs">Password</label>
                        <div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-xl px-md py-sm focus-within:border-primary transition-colors">
                            <span className="material-symbols-outlined text-secondary text-[20px]">lock</span>
                            <input
                                type="password"
                                required
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="flex-1 bg-transparent outline-none font-body-lg text-body-lg text-primary placeholder:text-on-surface-variant"
                            />
                        </div>
                    </div>

                    {/* Confirm Password (Sign Up only) */}
                    {tab === 'signup' && (
                        <div>
                            <label className="font-label-md text-label-md text-secondary block mb-xs">Confirm Password</label>
                            <div className="flex items-center gap-sm bg-surface-container-lowest border border-outline-variant rounded-xl px-md py-sm focus-within:border-primary transition-colors">
                                <span className="material-symbols-outlined text-secondary text-[20px]">lock_reset</span>
                                <input
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="flex-1 bg-transparent outline-none font-body-lg text-body-lg text-primary placeholder:text-on-surface-variant"
                                />
                            </div>
                        </div>
                    )}

                    {/* Error / Success Messages */}
                    {error && (
                        <div className="bg-error-container text-on-error-container font-body-sm text-body-sm px-md py-sm rounded-xl flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[18px]">error</span>
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-surface-container-high text-primary font-body-sm text-body-sm px-md py-sm rounded-xl flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            {success}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-on-primary font-label-md text-label-md py-md rounded-full flex items-center justify-center gap-sm shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 mt-lg"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-xl">
                                    {tab === 'signup' ? 'person_add' : 'login'}
                                </span>
                                {tab === 'signup' ? 'Create Account' : 'Log In'}
                            </>
                        )}
                    </button>
                </form>

                {/* Switch hint */}
                <p className="text-center font-body-sm text-body-sm text-on-surface-variant mt-lg">
                    {tab === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
                    <button
                        onClick={() => { setTab(tab === 'signup' ? 'login' : 'signup'); setError(''); setSuccess(''); }}
                        className="text-primary underline hover:opacity-70 transition-opacity"
                    >
                        {tab === 'signup' ? 'Log In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthScreen;

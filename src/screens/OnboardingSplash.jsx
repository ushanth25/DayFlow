import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import DayFlowLogo from '../components/DayFlowLogo';

const OnboardingSplash = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGetStarted = () => {
        navigate('/auth');
    };

    return (
        <div className="flex flex-col min-h-screen text-on-background font-body-lg text-body-lg">
            {/* Main Content Area: Centered with max-width for desktop but fluid for mobile */}
            <main className="flex-grow flex flex-col items-center justify-between px-lg py-xl max-w-container-max mx-auto w-full">
                {/* Top Section: Branding */}
                <section className="w-full flex flex-col items-center mt-xl fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="mb-md flex justify-center">
                        <DayFlowLogo size={72} />
                    </div>
                    <h1 className="font-display-lg text-display-lg text-primary text-center mb-xs">DayFlow</h1>
                    <p className="font-body-lg text-on-surface-variant text-center px-lg">Your daily rhythm, visualized and managed effortlessly.</p>
                </section>
                
                {/* Middle Section: Illustration */}
                <section className="w-full flex justify-center fade-in my-xl flex-grow" style={{ animationDelay: '0.3s' }}>
                    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
                        <div className="absolute inset-0 bg-primary-container rounded-full opacity-10 animate-pulse"></div>
                        <div className="absolute inset-4 bg-secondary-container rounded-full opacity-20"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-8xl text-primary drop-shadow-md">
                                water_drop
                            </span>
                        </div>
                        {/* Decorative elements */}
                        <span className="material-symbols-outlined absolute top-4 right-8 text-3xl text-tertiary animate-bounce" style={{ animationDuration: '3s' }}>
                            wb_sunny
                        </span>
                        <span className="material-symbols-outlined absolute bottom-8 left-8 text-4xl text-on-tertiary-container animate-pulse">
                            schedule
                        </span>
                        <span className="material-symbols-outlined absolute top-1/2 -right-4 text-2xl text-secondary">
                            task_alt
                        </span>
                    </div>
                </section>
                
                {/* Bottom Section: Call to Action */}
                <section className="w-full flex flex-col gap-md pb-xl fade-in" style={{ animationDelay: '0.5s' }}>
                    <button 
                        onClick={handleGetStarted}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-on-surface-variant text-on-primary font-label-md text-label-md py-md px-lg rounded-full transition-colors duration-200 flex items-center justify-center shadow-sm disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                        ) : (
                            <>
                                Get Started
                                <span className="material-symbols-outlined ml-xs text-xl">arrow_forward</span>
                            </>
                        )}
                    </button>
                    <button 
                        onClick={handleGetStarted}
                        disabled={loading}
                        className="w-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-md px-lg rounded-full transition-colors duration-200 shadow-sm border border-outline-variant disabled:opacity-60"
                    >
                        Log In
                    </button>
                    <div className="text-center mt-sm">
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                            By continuing, you agree to our 
                            <a className="text-primary underline hover:text-on-surface-variant transition-colors" href="#">Terms of Service</a>
                        </p>
                    </div>
                    {error && (
                        <div className="bg-error-container text-on-error-container text-center font-body-sm text-body-sm px-md py-sm rounded-xl">
                            ⚠️ {error}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default OnboardingSplash;

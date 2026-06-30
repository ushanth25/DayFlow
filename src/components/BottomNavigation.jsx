import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: '/home', icon: 'home', label: 'Home' },
        { path: '/calendar', icon: 'calendar_today', label: 'Calendar' },
        { path: '/reminders', icon: 'notifications', label: 'Alerts' },
        { path: '/profile', icon: 'person', label: 'Profile' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 w-full z-50 bg-surface border-t border-outline-variant">
            <div className="flex justify-around items-center py-sm px-xl max-w-[390px] mx-auto">
                {tabs.map(tab => {
                    const isActive = location.pathname === tab.path;
                    return (
                        <div 
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all cursor-pointer active:scale-95 ${isActive ? 'bg-primary-container text-on-primary-container' : 'text-secondary hover:bg-surface-container-low'}`}
                        >
                            <span className={`material-symbols-outlined ${isActive ? 'filled-icon' : ''}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                {tab.icon}
                            </span>
                            <span className="font-label-sm text-label-sm mt-1">{tab.label}</span>
                        </div>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;

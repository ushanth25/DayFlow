import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const ReminderSetup = () => {
    const navigate = useNavigate();
    const [repeat, setRepeat] = useState('None');
    const [alertType, setAlertType] = useState('Notification');

    const handleSave = async () => {
        // Hardcoded title and time for demo since there's no title input in this screen design
        const newReminder = {
            title: 'New Custom Reminder',
            time: 'Today at 8:30 AM'
        };
        
        await supabase
            .from('reminders')
            .insert([newReminder]);
            
        navigate(-1); // Go back
    };

    return (
        <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center">
            {/* TopAppBar */}
            <header className="fixed top-0 w-full bg-surface border-b border-outline-variant z-50">
                <div className="flex justify-between items-center h-16 px-lg max-w-[390px] mx-auto">
                    <button className="p-2 -ml-2 transition-colors duration-200 hover:bg-surface-variant/50 rounded-full" onClick={() => navigate(-1)}>
                        <span className="material-symbols-outlined text-primary">arrow_back</span>
                    </button>
                    <h1 className="font-headline-md text-headline-md font-bold text-primary">Set reminder</h1>
                    <div className="w-10"></div> {/* Spacer for balance */}
                </div>
            </header>

            {/* Main Content Canvas */}
            <main className="flex-1 w-full max-w-[390px] px-lg pt-24 pb-32">
                {/* Time Picker Section - Simplified mockup */}
                <section className="flex flex-col items-center justify-center py-xl">
                    <div className="relative w-full max-w-[320px] h-48 flex justify-center items-center bg-white border border-outline-variant rounded-xl overflow-hidden">
                        <div className="absolute inset-x-0 h-12 bg-surface-container-high/30 border-y border-primary/10 z-0 pointer-events-none"></div>
                        <div className="flex items-center space-x-4 z-10 picker-mask h-full w-full justify-center">
                            {/* Hours */}
                            <div className="flex flex-col items-center h-full overflow-y-auto no-scrollbar py-20 snap-y snap-mandatory">
                                <div className="h-12 flex items-center justify-center font-headline-lg text-headline-lg text-primary snap-center font-bold">08</div>
                            </div>
                            <span className="font-headline-lg text-headline-lg text-primary pb-1">:</span>
                            {/* Minutes */}
                            <div className="flex flex-col items-center h-full overflow-y-auto no-scrollbar py-20 snap-y snap-mandatory">
                                <div className="h-12 flex items-center justify-center font-headline-lg text-headline-lg text-primary snap-center font-bold">30</div>
                            </div>
                            {/* AM/PM */}
                            <div className="flex flex-col items-center h-full overflow-y-auto no-scrollbar py-20 snap-y snap-mandatory ml-2">
                                <div className="h-12 flex items-center justify-center font-headline-md text-headline-md text-primary snap-center font-bold">AM</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Repeat Section */}
                <section className="mb-xl">
                    <h2 className="font-label-md text-label-md text-on-surface-variant mb-md tracking-wider">REPEAT</h2>
                    <div className="flex space-x-sm overflow-x-auto no-scrollbar pb-xs">
                        {['None', 'Daily', 'Weekdays', 'Weekly', 'Custom'].map(option => (
                            <button 
                                key={option}
                                onClick={() => setRepeat(option)}
                                className={`flex-shrink-0 px-lg py-sm rounded-full font-label-md text-label-md transition-colors ${
                                    repeat === option 
                                        ? 'bg-primary text-on-primary border border-primary font-bold' 
                                        : 'bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-variant'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Alert Type Section */}
                <section>
                    <h2 className="font-label-md text-label-md text-on-surface-variant mb-md tracking-wider">ALERT TYPE</h2>
                    <div className="grid grid-cols-2 gap-md">
                        <button 
                            onClick={() => setAlertType('Notification')}
                            className={`flex flex-col items-start p-lg bg-white rounded-xl transition-all duration-200 ${alertType === 'Notification' ? 'border-2 border-primary' : 'border border-outline-variant'}`}
                        >
                            <span className={`material-symbols-outlined mb-md ${alertType === 'Notification' ? 'text-primary' : 'text-on-surface-variant'}`} style={alertType === 'Notification' ? { fontVariationSettings: "'FILL' 1" } : {}}>notifications</span>
                            <span className={`font-headline-md text-headline-md ${alertType === 'Notification' ? 'text-primary' : 'text-on-surface'}`}>Notification</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Discreet banner</span>
                        </button>
                        <button 
                            onClick={() => setAlertType('Alarm')}
                            className={`flex flex-col items-start p-lg bg-white rounded-xl transition-all duration-200 ${alertType === 'Alarm' ? 'border-2 border-primary' : 'border border-outline-variant'}`}
                        >
                            <span className={`material-symbols-outlined mb-md ${alertType === 'Alarm' ? 'text-primary' : 'text-on-surface-variant'}`} style={alertType === 'Alarm' ? { fontVariationSettings: "'FILL' 1" } : {}}>alarm</span>
                            <span className={`font-headline-md text-headline-md ${alertType === 'Alarm' ? 'text-primary' : 'text-on-surface'}`}>Alarm</span>
                            <span className="font-body-sm text-body-sm text-on-surface-variant mt-xs">Sound and vibration</span>
                        </button>
                    </div>
                </section>
            </main>

            {/* Footer Action */}
            <footer className="fixed bottom-0 w-full max-w-[390px] bg-surface/80 backdrop-blur-md z-50">
                <div className="p-lg">
                    <button 
                        onClick={handleSave}
                        className="w-full bg-primary text-on-primary py-md rounded-xl font-headline-md text-headline-md font-bold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                        Save reminder
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default ReminderSetup;

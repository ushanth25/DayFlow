import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
} from 'firebase/firestore';
import BottomNavigation from '../components/BottomNavigation';
import DayFlowLogo from '../components/DayFlowLogo';

const RemindersList = () => {
    const navigate = useNavigate();
    const [reminders, setReminders] = useState([]);
    const [tab, setTab] = useState('upcoming');
    const [uid, setUid] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
            Notification.requestPermission();
        }

        let unsubscribeSnapshot = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);

                // Real-time listener — updates instantly when reminders are added/removed
                const q = query(
                    collection(db, 'users', user.uid, 'reminders'),
                    orderBy('createdAt', 'desc')
                );

                unsubscribeSnapshot = onSnapshot(q,
                    (snapshot) => {
                        setReminders(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
                        setError('');
                    },
                    (err) => {
                        console.error('Firestore error:', err);
                        setError('Could not load reminders. Check Firestore rules.');
                    }
                );
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) unsubscribeSnapshot();
        };
    }, []);


    const dismissReminder = async (id) => {
        setReminders(reminders.filter(r => r.id !== id));
        await deleteDoc(doc(db, 'users', uid, 'reminders', id));
    };

    const triggerNotification = (title) => {
        if (Notification.permission === 'granted') {
            new Notification('DayFlow Reminder', {
                body: title,
                icon: '/favicon.svg'
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-body-lg text-body-lg bg-surface text-on-surface">
            {/* TopAppBar */}
            <header className="fixed top-0 w-full bg-surface border-b border-outline-variant z-40">
                <div className="flex justify-between items-center h-16 px-lg max-w-[390px] mx-auto">
                    <div className="flex items-center gap-sm">
                        <DayFlowLogo size={28} />
                        <h1 className="font-headline-md text-headline-md font-bold text-primary">DayFlow</h1>
                    </div>
                </div>
            </header>

            {/* Main Canvas */}
            <main className="flex-grow pt-24 pb-32 px-gutter max-w-[390px] mx-auto w-full">
                {/* Header Section */}
                <section className="mb-lg flex justify-between items-center">
                    <h2 className="font-headline-lg text-headline-lg font-bold text-primary">Reminders</h2>
                    <button
                        className="bg-primary text-white p-2 rounded-full font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center"
                        onClick={() => navigate('/reminder-setup')}
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                </section>

                <div className="mb-lg">
                    {/* Tabs */}
                    <div className="flex bg-secondary-container/30 p-xs rounded-full w-fit">
                        <button
                            className={`px-lg py-sm rounded-full font-label-md text-label-md transition-all duration-200 ${tab === 'upcoming' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                            onClick={() => setTab('upcoming')}
                        >
                            Upcoming
                        </button>
                        <button
                            className={`px-lg py-sm rounded-full font-label-md text-label-md transition-all duration-200 ${tab === 'past' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'}`}
                            onClick={() => setTab('past')}
                        >
                            Past
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-md bg-error-container text-on-error-container font-body-sm text-body-sm px-md py-sm rounded-xl flex items-center gap-sm">
                        <span className="material-symbols-outlined text-[18px]">error</span>
                        {error}
                    </div>
                )}

                {/* List Section */}
                {reminders.length > 0 ? (
                    <div className="space-y-md">
                        {reminders.map(reminder => (
                            <div key={reminder.id} className="flex items-center bg-white border border-outline-variant rounded-xl p-md border-l-[3px] border-l-primary">
                                <div className="mr-md text-on-surface-variant">
                                    <span className="material-symbols-outlined cursor-pointer" onClick={() => triggerNotification(reminder.title)}>notifications</span>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-label-md text-label-md text-primary truncate">{reminder.title}</p>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">{reminder.time}</p>
                                </div>
                                <div className="flex items-center gap-xs ml-sm">
                                    <button className="p-xs hover:bg-surface-variant rounded-lg transition-colors text-on-surface-variant" title="Snooze" onClick={() => triggerNotification(reminder.title)}>
                                        <span className="material-symbols-outlined text-[20px]">snooze</span>
                                    </button>
                                    <button className="p-xs hover:bg-error-container/20 hover:text-error rounded-lg transition-colors text-on-surface-variant" onClick={() => dismissReminder(reminder.id)} title="Dismiss">
                                        <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="flex flex-col items-center justify-center py-xl text-center">
                        <p className="font-headline-md text-headline-md text-primary mb-sm">No upcoming reminders</p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg max-w-xs">You're all caught up! Take a moment to breathe or plan your next focus session.</p>
                        <button
                            className="bg-primary text-white px-xl py-md rounded-xl font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-sm"
                            onClick={() => navigate('/reminder-setup')}
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Add reminder
                        </button>
                    </div>
                )}
            </main>

            <BottomNavigation />
        </div>
    );
};

export default RemindersList;

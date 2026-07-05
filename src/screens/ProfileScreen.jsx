import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query } from 'firebase/firestore';
import DayFlowLogo from '../components/DayFlowLogo';

const ProfileScreen = () => {
    const [tasks, setTasks] = useState([]);
    const [completedTasksCount, setCompletedTasksCount] = useState(0);
    const [remindersCount, setRemindersCount] = useState(0);
    const [user, setUser] = useState(null);
    const [themeDark, setThemeDark] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);

                // Fetch tasks
                const taskSnap = await getDocs(query(collection(db, 'users', firebaseUser.uid, 'tasks')));
                const taskList = taskSnap.docs.map(d => d.data());
                setTasks(taskList);
                setCompletedTasksCount(taskList.filter(t => t.completed).length);

                // Fetch reminders count
                const reminderSnap = await getDocs(query(collection(db, 'users', firebaseUser.uid, 'reminders')));
                setRemindersCount(reminderSnap.size);
            }
        });
        return () => unsubscribe();
    }, []);

    const handleSignOut = async () => {
        await signOut(auth);
        navigate('/');
    };

    const initials = user?.email
        ? user.email.slice(0, 2).toUpperCase()
        : 'U';

    return (
        <div className="text-on-surface bg-surface min-h-screen pb-32">
            {/* TopAppBar */}
            <header className="w-full top-0 sticky bg-surface border-b border-outline-variant z-40">
                <div className="max-w-[390px] mx-auto px-md h-16 flex items-center justify-between">
                    <div className="flex items-center gap-md">
                        <DayFlowLogo size={28} />
                        <h1 className="font-headline-md text-headline-md text-primary font-extrabold tracking-tight">DayFlow</h1>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-label-sm">
                        {initials}
                    </div>
                </div>
            </header>

            <main className="max-w-[390px] mx-auto px-gutter py-xl">
                {/* Profile Header */}
                <section className="flex flex-col items-center justify-center text-center mb-xl">
                    <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-on-primary font-display-lg mb-md">
                        {initials}
                    </div>
                    <h2 className="font-headline-md text-headline-md mb-xs">{user?.displayName || 'My Account'}</h2>
                    <p className="font-body-sm text-body-sm text-secondary">{user?.email}</p>
                </section>

                {/* Stats Row */}
                <section className="grid grid-cols-3 gap-md mb-xl">
                    <div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col items-center justify-center rounded-lg">
                        <span className="font-headline-md text-headline-md text-primary">{completedTasksCount}</span>
                        <span className="font-label-sm text-label-sm text-secondary">Tasks done</span>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col items-center justify-center rounded-lg">
                        <span className="font-headline-md text-headline-md text-primary">{tasks.length}</span>
                        <span className="font-label-sm text-label-sm text-secondary">Total tasks</span>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col items-center justify-center rounded-lg">
                        <span className="font-headline-md text-headline-md text-primary">{remindersCount}</span>
                        <span className="font-label-sm text-label-sm text-secondary">Reminders</span>
                    </div>
                </section>

                {/* Settings List */}
                <div className="space-y-xl">
                    {/* Section 1: Preferences */}
                    <section>
                        <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-md">Preferences</h3>
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg divide-y divide-surface-container-low">
                            {/* Theme Toggle */}
                            <div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors group">
                                <div className="flex items-center gap-md">
                                    <span className="material-symbols-outlined text-secondary">contrast</span>
                                    <span className="font-body-lg text-body-lg">Theme</span>
                                </div>
                                <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id="toggle-theme"
                                        checked={themeDark}
                                        onChange={() => setThemeDark(!themeDark)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline-variant checked:bg-primary checked:right-0 right-4 duration-200"
                                    />
                                    <label htmlFor="toggle-theme" className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-container-high cursor-pointer"></label>
                                </div>
                            </div>

                            {/* Notifications Toggle */}
                            <div className="flex items-center justify-between p-md hover:bg-surface-container-low transition-colors group">
                                <div className="flex items-center gap-md">
                                    <span className="material-symbols-outlined text-secondary">notifications</span>
                                    <span className="font-body-lg text-body-lg">Notifications</span>
                                </div>
                                <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id="toggle-notif"
                                        checked={notificationsEnabled}
                                        onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-outline-variant checked:bg-primary checked:right-0 right-4 duration-200"
                                    />
                                    <label htmlFor="toggle-notif" className="toggle-label block overflow-hidden h-6 rounded-full bg-surface-container-high cursor-pointer"></label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Account */}
                    <section>
                        <h3 className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-md">Account</h3>
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg divide-y divide-surface-container-low">
                            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors text-left group">
                                <div className="flex items-center gap-md">
                                    <span className="material-symbols-outlined text-secondary">person_edit</span>
                                    <span className="font-body-lg text-body-lg">Edit profile</span>
                                </div>
                                <span className="material-symbols-outlined text-secondary">chevron_right</span>
                            </button>
                            <button className="w-full flex items-center justify-between p-md hover:bg-surface-container-low transition-colors text-left group">
                                <div className="flex items-center gap-md">
                                    <span className="material-symbols-outlined text-secondary">lock</span>
                                    <span className="font-body-lg text-body-lg">Change password</span>
                                </div>
                                <span className="material-symbols-outlined text-secondary">chevron_right</span>
                            </button>
                        </div>
                    </section>

                    {/* Bottom Action */}
                    <section className="flex justify-center pt-md">
                        <button onClick={handleSignOut} className="text-error font-body-lg text-body-lg hover:underline transition-all py-md px-lg active:opacity-70">
                            Sign out
                        </button>
                    </section>
                </div>
            </main>

            <BottomNavigation />
        </div>
    );
};

export default ProfileScreen;

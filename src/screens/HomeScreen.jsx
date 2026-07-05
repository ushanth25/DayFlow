import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    doc,
    query,
    orderBy,
} from 'firebase/firestore';
import BottomNavigation from '../components/BottomNavigation';
import AddTaskModal from '../components/AddTaskModal';
import DayFlowLogo from '../components/DayFlowLogo';

const HomeScreen = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [uid, setUid] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
                fetchTasks(user.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchTasks = async (userId) => {
        const q = query(
            collection(db, 'users', userId, 'tasks'),
            orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        setTasks(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    const toggleTask = async (id, currentStatus) => {
        // Optimistic update
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !currentStatus } : task
        ));
        await updateDoc(doc(db, 'users', uid, 'tasks', id), {
            completed: !currentStatus,
        });
    };

    const handleAddTask = async (newTask) => {
        const taskData = {
            title: newTask.title,
            category: newTask.category,
            completed: false,
            createdAt: new Date().toISOString(),
        };
        const docRef = await addDoc(collection(db, 'users', uid, 'tasks'), taskData);
        setTasks([{ id: docRef.id, ...taskData }, ...tasks]);
        setIsAddModalOpen(false);
    };

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen">
            {/* Top AppBar */}
            <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant">
                <div className="max-w-[390px] mx-auto px-md h-16 flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                        <DayFlowLogo size={32} />
                        <span className="font-headline-md text-headline-md text-primary font-bold">DayFlow</span>
                    </div>
                    <div
                        className="h-8 w-8 rounded-full bg-secondary-container overflow-hidden border border-outline-variant cursor-pointer flex items-center justify-center"
                        onClick={() => navigate('/profile')}
                    >
                        <span className="material-symbols-outlined text-secondary text-[20px]">person</span>
                    </div>
                </div>
            </header>

            <main className="max-w-[390px] mx-auto px-md pt-xl pb-32">
                {/* Hero Header */}
                <section className="mb-xl">
                    <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">{today}</h1>
                    <p className="font-body-lg text-body-lg text-secondary mt-xs">You have {tasks.length} tasks today</p>
                </section>

                {/* Progress Section */}
                <section className="mb-xl">
                    <div className="flex justify-between items-end mb-sm">
                        <span className="font-label-md text-label-md text-primary">Daily Progress</span>
                        <span className="font-label-md text-label-md text-secondary">{progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </section>

                {/* Task List Section */}
                <section className="space-y-sm">
                    {tasks.length === 0 && (
                        <div className="py-xl text-center">
                            <p className="font-body-lg text-on-surface-variant">No tasks yet — add one below!</p>
                        </div>
                    )}
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="flex items-center gap-md p-md bg-surface-container-lowest border border-outline-variant rounded-xl group hover:bg-surface-container-low transition-colors cursor-pointer"
                            onClick={() => toggleTask(task.id, task.completed)}
                        >
                            <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                                {task.completed && (
                                    <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <span className={`font-body-lg text-body-lg ${task.completed ? 'text-secondary line-through' : 'text-primary'}`}>
                                    {task.title}
                                </span>
                            </div>
                            <span className="px-sm py-xs bg-surface-container-high text-on-secondary-container font-label-sm text-label-sm rounded-lg">{task.category || 'Task'}</span>
                        </div>
                    ))}
                </section>
            </main>

            {/* FAB */}
            <div className="fixed bottom-24 w-full max-w-[390px] left-1/2 -translate-x-1/2 pointer-events-none">
                <button
                    className="absolute right-4 w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform z-50 pointer-events-auto"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <span className="material-symbols-outlined text-[28px]">add</span>
                </button>
            </div>

            <BottomNavigation />

            {isAddModalOpen && (
                <AddTaskModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAdd={handleAddTask}
                />
            )}
        </div>
    );
};

export default HomeScreen;

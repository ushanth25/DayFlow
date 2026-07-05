import React, { useState, useEffect } from 'react';
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

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WeeklyCalendar = () => {
    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [uid, setUid] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    // Build current week strip
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday start

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return d;
    });

    const selectedLabel = selectedDate.toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
    });

    const monthLabel = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="text-on-surface antialiased min-h-screen bg-surface-container-lowest">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 w-full bg-surface border-b border-outline-variant z-40">
                <div className="flex justify-between items-center h-16 px-lg max-w-[390px] mx-auto">
                    <div className="flex items-center gap-sm">
                        <DayFlowLogo size={28} />
                        <span className="font-headline-md text-headline-md font-bold text-primary">DayFlow</span>
                    </div>
                </div>
            </header>

            <main className="pt-16 pb-24 px-md max-w-[390px] mx-auto min-h-screen">
                {/* Month Label */}
                <section className="mt-lg mb-md flex items-center justify-between">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">{monthLabel}</h1>
                </section>

                {/* Week Strip */}
                <section className="mb-xl bg-white border border-outline-variant rounded-xl p-md overflow-x-auto">
                    <div className="flex justify-between">
                        {weekDays.map((day) => {
                            const isToday = day.toDateString() === today.toDateString();
                            const isSelected = day.toDateString() === selectedDate.toDateString();
                            return (
                                <div
                                    key={day.toDateString()}
                                    className="flex flex-col items-center gap-xs cursor-pointer"
                                    onClick={() => setSelectedDate(day)}
                                >
                                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                                        {DAYS[day.getDay()]}
                                    </span>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                                        isSelected ? 'bg-primary text-white' :
                                        isToday ? 'bg-surface-container-high text-primary' :
                                        'hover:bg-surface-variant/30'
                                    }`}>
                                        {day.getDate()}
                                    </div>
                                    <div className={`w-1 h-1 rounded-full mt-1 ${isToday ? 'bg-primary' : 'bg-outline-variant'}`}></div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Tasks Content */}
                <section className="space-y-lg">
                    <header className="flex items-center justify-between">
                        <h2 className="font-headline-md text-headline-md">Tasks for {selectedLabel}</h2>
                        <button
                            className="flex items-center gap-xs text-primary font-label-md hover:opacity-80"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            New Task
                        </button>
                    </header>

                    <div className="space-y-xs">
                        {tasks.length > 0 ? (
                            tasks.map(task => (
                                <div
                                    key={task.id}
                                    className="flex items-center gap-md p-md bg-white border border-outline-variant rounded-xl hover:border-primary/20 transition-all cursor-pointer"
                                    onClick={() => toggleTask(task.id, task.completed)}
                                >
                                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${task.completed ? 'bg-primary border-primary' : 'border-outline-variant'}`}>
                                        {task.completed && (
                                            <span className="material-symbols-outlined text-white text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-body-lg text-body-lg ${task.completed ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{task.title}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-xl text-center">
                                <p className="font-body-lg text-on-surface-variant font-medium">No tasks for this day</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

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

export default WeeklyCalendar;

import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import BottomNavigation from '../components/BottomNavigation';
import AddTaskModal from '../components/AddTaskModal';
import DayFlowLogo from '../components/DayFlowLogo';

const WeeklyCalendar = () => {
    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) {
            setTasks(data);
        }
    };
    
    // Get only today's tasks or some subset for demo
    const todayTasks = tasks.slice(0, 5); // Just a mock for now

    const toggleTask = async (id, currentStatus) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !currentStatus } : task
        ));
        
        await supabase
            .from('tasks')
            .update({ completed: !currentStatus })
            .eq('id', id);
    };

    const handleAddTask = async (newTask) => {
        const { data, error } = await supabase
            .from('tasks')
            .insert([{ title: newTask.title, category: newTask.category }])
            .select();

        if (!error && data) {
            setTasks([data[0], ...tasks]);
        }
        setIsAddModalOpen(false);
    };

    return (
        <div className="text-on-surface antialiased min-h-screen bg-surface-container-lowest">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 w-full bg-surface border-b border-outline-variant z-40">
                <div className="flex justify-between items-center h-16 px-lg max-w-[390px] mx-auto">
                    <div className="flex items-center gap-sm">
                        <DayFlowLogo size={28} />
                        <span className="font-headline-md text-headline-md font-bold text-primary">DayFlow</span>
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface-variant/50 transition-colors duration-200">
                        <span className="material-symbols-outlined">settings</span>
                    </button>
                </div>
            </header>

            <main className="pt-16 pb-24 px-md max-w-[390px] mx-auto min-h-screen">
                {/* Month Navigation */}
                <section className="mt-lg mb-md flex items-center justify-between">
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">June 2026</h1>
                    <div className="flex gap-sm">
                        <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant/30 transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-variant/30 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </section>

                {/* Week Strip */}
                <section className="mb-xl bg-white border border-outline-variant rounded-xl p-md overflow-x-auto no-scrollbar">
                    <div className="flex justify-between">
                        {/* Mon 28 (Active) */}
                        <div className="flex flex-col items-center gap-xs cursor-pointer group">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Mon</span>
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">28</div>
                            <div className="w-1 h-1 rounded-full bg-primary mt-1"></div>
                        </div>
                        {/* Tue 29 */}
                        <div className="flex flex-col items-center gap-xs cursor-pointer group">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Tue</span>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-surface-variant/30 transition-colors">29</div>
                            <div className="w-1 h-1 rounded-full bg-outline-variant mt-1"></div>
                        </div>
                        {/* Wed 30 */}
                        <div className="flex flex-col items-center gap-xs cursor-pointer group">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Wed</span>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-surface-variant/30 transition-colors">30</div>
                            <div className="w-1 h-1 rounded-full bg-outline-variant mt-1"></div>
                        </div>
                        {/* Thu 1 */}
                        <div className="flex flex-col items-center gap-xs cursor-pointer group">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Thu</span>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-surface-variant/30 transition-colors">1</div>
                            <div className="opacity-0 w-1 h-1 rounded-full bg-outline-variant mt-1"></div>
                        </div>
                        {/* Fri 2 */}
                        <div className="flex flex-col items-center gap-xs cursor-pointer group">
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Fri</span>
                            <div className="w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-surface-variant/30 transition-colors">2</div>
                            <div className="w-1 h-1 rounded-full bg-outline-variant mt-1"></div>
                        </div>
                    </div>
                </section>

                {/* Tasks Content */}
                <section className="space-y-lg">
                    <header className="flex items-center justify-between">
                        <h2 className="font-headline-md text-headline-md">Tasks for Monday, June 28</h2>
                        <button 
                            className="flex items-center gap-xs text-primary font-label-md hover:opacity-80"
                            onClick={() => setIsAddModalOpen(true)}
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            New Task
                        </button>
                    </header>

                    {/* Task List */}
                    <div className="space-y-xs">
                        {todayTasks.length > 0 ? (
                            todayTasks.map(task => (
                                <div key={task.id} className="flex items-center gap-md p-md bg-white border border-outline-variant rounded-xl hover:border-primary/20 transition-all cursor-pointer" onClick={() => toggleTask(task.id, task.completed)}>
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

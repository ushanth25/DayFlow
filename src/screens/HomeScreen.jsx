import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import BottomNavigation from '../components/BottomNavigation';
import AddTaskModal from '../components/AddTaskModal';
import DayFlowLogo from '../components/DayFlowLogo';

const HomeScreen = () => {
    const navigate = useNavigate();
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

    const toggleTask = async (id, currentStatus) => {
        // Optimistic update
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !currentStatus } : task
        ));
        
        // Supabase update
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

    const completedCount = tasks.filter(t => t.completed).length;
    const progress = tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

    return (
        <div className="bg-surface text-on-surface antialiased min-h-screen">
            {/* Top AppBar */}
            <header className="w-full top-0 sticky z-40 bg-surface border-b border-outline-variant">
                <div className="max-w-[390px] mx-auto px-md h-16 flex items-center justify-between">
                    <div className="flex items-center gap-sm">
                        <button className="material-symbols-outlined text-primary hover:bg-surface-container-low p-2 transition-colors rounded-lg active:opacity-80">menu</button>
                        <DayFlowLogo size={32} />
                        <span className="font-headline-md text-headline-md text-primary font-bold">DayFlow</span>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-secondary-container overflow-hidden border border-outline-variant cursor-pointer" onClick={() => navigate('/profile')}>
                        <img className="w-full h-full object-cover" alt="Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSJY6tntNxIMNHKiv0dZPEAdBxN-1zONkKPNNgnwhPUvrJAkgwo8-ckGPyr0oJqx0rBIL_4w8ifT7tBo-UDByhhAOiXu4xLN_6h8y8p1n4rfpe39jILpzKSU56itXOU_wPGb4isnjo6X4k8OtwjMD_u5xVwH9Mz7FmEuop8c2B0bmf5CW4DjMkj8CwmGMB62ufuaqxs5yxxj9qb43WhBQFeZYc24tRmAFrDxy80xG-Ju6zv7TEDOtHop9P6x8XEPugW9uX6iwtlcp-"/>
                    </div>
                </div>
            </header>

            <main className="max-w-[390px] mx-auto px-md pt-xl pb-32">
                {/* Hero Header */}
                <section className="mb-xl">
                    <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-primary tracking-tight">Monday, June 28</h1>
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
                    {tasks.map(task => (
                        <div key={task.id} className="flex items-center gap-md p-md bg-surface-container-lowest border border-outline-variant rounded-xl group hover:bg-surface-container-low transition-colors cursor-pointer" onClick={() => toggleTask(task.id, task.completed)}>
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

import React, { useState } from 'react';

const AddTaskModal = ({ isOpen, onClose, onAdd }) => {
    const [title, setTitle] = useState('');
    const [notes, setNotes] = useState('');
    const [priority, setPriority] = useState('Medium');

    if (!isOpen) return null;

    const handleSave = () => {
        if (title.trim() === '') return;
        
        onAdd({
            title,
            category: priority === 'High' ? 'Work' : 'Personal', // mockup mapping
        });
        
        setTitle('');
        setNotes('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 backdrop-blur-[2px]">
            {/* Bottom Sheet Wrapper */}
            <div className="w-full max-w-[390px] bg-surface-container-lowest rounded-t-[32px] border-t border-x border-outline-variant h-[618px] flex flex-col shadow-2xl transform translate-y-0 relative overflow-hidden">
                {/* Drag Handle Area */}
                <div 
                    className="w-full py-4 flex justify-center cursor-pointer active:opacity-60 transition-opacity" 
                    onClick={onClose}
                >
                    <div className="w-10 h-1 bg-outline-variant rounded-full"></div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-lg pb-xl flex flex-col">
                    {/* Title Input */}
                    <div className="mt-base">
                        <input 
                            autoFocus 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 font-headline-lg-mobile text-headline-lg-mobile text-on-surface placeholder:text-outline-variant outline-none" 
                            placeholder="Task title" 
                            type="text"
                        />
                    </div>

                    {/* Notes Textarea */}
                    <div className="mt-sm">
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 font-body-lg text-body-lg text-secondary placeholder:text-outline-variant outline-none resize-none" 
                            placeholder="Notes (optional)" 
                            rows="3"
                        />
                    </div>

                    {/* Horizontal Metadata Row */}
                    <div className="flex flex-wrap gap-sm mt-lg">
                        <button className="flex items-center gap-xs px-md py-sm bg-surface-container-low border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                            Date
                        </button>
                        <button className="flex items-center gap-xs px-md py-sm bg-surface-container-low border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[18px]">notifications</span>
                            Reminder
                        </button>
                        <button className="flex items-center gap-xs px-md py-sm bg-surface-container-low border border-outline-variant rounded-full font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[18px]">flag</span>
                            Priority
                        </button>
                    </div>

                    {/* Priority Selection Section */}
                    <div className="mt-xl space-y-md">
                        <h3 className="font-label-md text-label-md text-secondary uppercase tracking-wider">Priority</h3>
                        <div className="flex gap-sm">
                            <button 
                                onClick={() => setPriority('High')}
                                className={`flex-1 flex items-center justify-center gap-sm py-sm px-md rounded-xl border transition-all active:scale-95 ${priority === 'High' ? 'bg-surface-container-high border-primary ring-2 ring-primary/10' : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low'}`}
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-error"></div>
                                <span className="font-body-sm text-body-sm text-on-surface">High</span>
                            </button>
                            <button 
                                onClick={() => setPriority('Medium')}
                                className={`flex-1 flex items-center justify-center gap-sm py-sm px-md rounded-xl border transition-all active:scale-95 ${priority === 'Medium' ? 'bg-surface-container-high border-primary ring-2 ring-primary/10' : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low'}`}
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container"></div>
                                <span className="font-body-sm text-body-sm text-on-surface">Medium</span>
                            </button>
                            <button 
                                onClick={() => setPriority('Low')}
                                className={`flex-1 flex items-center justify-center gap-sm py-sm px-md rounded-xl border transition-all active:scale-95 ${priority === 'Low' ? 'bg-surface-container-high border-primary ring-2 ring-primary/10' : 'bg-surface-container-lowest border-outline-variant hover:bg-surface-container-low'}`}
                            >
                                <div className="w-2.5 h-2.5 rounded-full bg-secondary"></div>
                                <span className="font-body-sm text-body-sm text-on-surface">Low</span>
                            </button>
                        </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1 min-h-[40px]"></div>

                    {/* Primary Action Button */}
                    <div className="sticky bottom-0 bg-surface-container-lowest pt-md pb-md">
                        <button 
                            onClick={handleSave}
                            className="w-full py-md bg-primary text-on-primary rounded-xl font-headline-md text-headline-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
                            disabled={!title.trim()}
                        >
                            Save task
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTaskModal;

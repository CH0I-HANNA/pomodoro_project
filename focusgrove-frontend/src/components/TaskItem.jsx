import React from "react";

const TaskItem = ({ task, onToggleComplete, onStartPomodoro, onDelete }) => {
    const handleStartClick = () => {
        onStartPomodoro(task.id, task.content);
    };

    return (
        <div
            className={`
                group
                flex items-center justify-between
                p-4 mb-3 rounded-2xl
                backdrop-blur-xl
                border border-white/10
                shadow-lg
                transition-all duration-300
                hover:bg-white/5 hover:shadow-xl hover:scale-[1.01]
                ${task.completed ? "opacity-60 bg-gray-700/30" : "bg-white/5"}
            `}
        >
            {/* LEFT SECTION */}
            <div className="flex items-center gap-4">
                {/* CHECKBOX */}
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => onToggleComplete(task.id)}
                    className="
                        w-6 h-6 cursor-pointer rounded-md appearance-none
                        border-2 border-white/20 bg-white/10
                        transition-all duration-300
                        checked:bg-teal-300 checked:border-teal-300
                        hover:border-teal-200
                        focus:ring-2 focus:ring-teal-300/60 focus:ring-offset-2 focus:ring-offset-gray-900
                    "
                />

                <div className="flex flex-col">
                    {/* TASK CONTENT */}
                    <p
                        className={`
                            text-lg font-medium transition-all duration-300
                            ${task.completed ? "line-through text-gray-500" : "text-white"}
                        `}
                    >
                        {task.content}
                    </p>

                    {/* POMODORO COUNT */}
                    <span className="text-xs text-white/50 mt-1">
                        Pomodoros: {task.pomodoroCount}
                    </span>
                </div>
            </div>

            {/* RIGHT BUTTON GROUP */}
            <div className="flex items-center gap-3">
                {!task.completed && (
                    <button
                        onClick={handleStartClick}
                        className="
                            px-4 py-1.5 rounded-lg text-sm font-semibold text-white
                            bg-teal-400/20 border border-teal-300/40
                            hover:bg-teal-300/30 hover:border-teal-200
                            transition-all duration-300
                            shadow-[0_0_8px_rgba(34,211,238,0.3)]
                        "
                    >
                        Start
                    </button>
                )}

                {/* DELETE BUTTON */}
                <button
                    onClick={() => onDelete(task.id)}
                    className="
                        px-3 py-1.5 rounded-lg text-sm font-semibold text-red-300
                        bg-red-500/10 border border-red-300/20
                        hover:bg-red-500/20 hover:border-red-300
                        transition-all duration-300
                        shadow-[0_0_6px_rgba(248,113,113,0.3)]
                    "
                >
                    X
                </button>
            </div>
        </div>
    );
};

export default TaskItem;

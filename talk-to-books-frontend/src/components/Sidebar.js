import React from "react";

const Sidebar = ({ history, onSelect, onClearHistory }) => {
    return (
        <div className="w-1/5 bg-indigo-700 text-white h-screen p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Search History</h2>
            {history.length === 0 ? (
                <p className="text-gray-300">No history yet.</p>
            ) : (
                <>
                    <button
                        onClick={onClearHistory}
                        className="mb-4 bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                    >
                        Clear History
                    </button>
                    <ul className="space-y-2">
                        {history.slice().reverse().map((item, index) => (
                            <li
                                key={index}
                                className="cursor-pointer hover:bg-indigo-600 p-2 rounded"
                                onClick={() => onSelect(item.query)}
                            >
                                {item.query.length > 30 ? item.query.substring(0, 30) + "..." : item.query}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default Sidebar;

import React, { useState } from 'react';

const QueryForm = ({ onSubmit }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(query);
        setQuery('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg">
            <label className="block text-xl mb-2">Enter your query:</label>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question..."
                className="w-full p-2 mb-2 border rounded"
            />
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                Ask
            </button>
        </form>
    );
};

export default QueryForm;

import React from 'react';

const ResponseDisplay = ({ response }) => {
    return (
        <div className="p-4 bg-white rounded-lg shadow mt-4">
            <h2 className="text-lg font-bold">Response:</h2>

            {response.books && response.books.length > 0 && (
                <div className="mt-2">
                    <h3 className="text-md font-semibold">Books:</h3>
                    <ul className="list-disc pl-6">
                        {response.books.map((book, index) => (
                            <li key={index} className="mb-2">
                                <p className="font-semibold">{book.title} by {book.author}</p>
                                <p className="text-gray-700 whitespace-pre-line">{book.excerpt}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {response.llm_response && (
                <div className="mt-4">
                    <h3 className="text-md font-semibold">LLM Response:</h3>
                    
                </div>
            )}
        </div>
    );
};

export default ResponseDisplay;

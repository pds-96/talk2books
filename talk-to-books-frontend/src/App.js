import React, { useState } from "react";
import Sidebar from "./components/Sidebar";

function App() {
    const [query, setQuery] = useState("");
    const [preference, setPreference] = useState("both");
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("https://talk2books.onrender.com/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ query, preference }),
            });
            const data = await res.json();
            setResponse(data);
            setSearchHistory((prev) => [...prev, { query }]);
        } catch (error) {
            setResponse({ error: "Error fetching response. Please try again." });
        }
        setLoading(false);
    };

    const handleClearHistory = () => {
        setSearchHistory([]);
    };

    const handleSelectHistory = (selectedQuery) => {
        setQuery(selectedQuery);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar
                history={searchHistory}
                onSelect={handleSelectHistory}
                onClearHistory={handleClearHistory}
            />

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                <div className="space-y-6">
                    {/* Description Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Talk to Books</h1>
                        <p className="text-lg text-gray-600 mb-4">
                            Welcome to Talk to Books! This interactive platform combines the power of AI and real book content to provide you with comprehensive answers to your questions.
                        </p>
                        <div className="space-y-3">
                            <p className="text-gray-600">
                                <span className="font-medium">How it works:</span>
                                <ul className="list-disc list-inside">
                                    <li>Enter your question in the text box below</li>
                                    <li>Choose whether you want responses from books, AI, or both</li>
                                    <li>Get instant answers with relevant book excerpts and AI insights</li>
                                </ul>
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Features:</span>
                                <ul className="list-disc list-inside">
                                    <li>Search through millions of books</li>
                                    <li>Get AI-powered insights</li>
                                    <li>View previous searches</li>
                                    <li>Clear search history</li>
                                </ul>
                            </p>
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <textarea
                                className="w-full p-3 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                                placeholder="Ask a question..."
                                rows={3}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="space-y-2">
                                <label className="block text-gray-600 font-medium">Select Response Type:</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={preference}
                                    onChange={(e) => setPreference(e.target.value)}
                                >
                                    <option value="books">Books Only</option>
                                    <option value="llm">LLM Only</option>
                                    <option value="both">Both</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className={`w-full py-2 px-4 text-white rounded-md ${
                                    loading ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Submit"}
                            </button>
                        </form>
                        {response && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-md shadow-inner text-gray-700">
                                {response.books?.length > 0 && (
                                    <>
                                        <strong>Response from Books:</strong>
                                        <ul className="list-disc pl-5 space-y-2">
                                            {response.books.map((book) => (
                                                <li key={book.index}>
                                                    <strong>{book.title}</strong> - {book.author}
                                                    <p className="pl-4 text-gray-600">"{book.excerpt}"</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                                {response.llm_response && (
                                    <div className="mt-4">
                                        <strong>LLM Response:</strong>
                                        <div className="llm-response">{response.llm_response}</div>
                                    </div>
                                )}
                                {response.error && <p className="text-red-500">{response.error}</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

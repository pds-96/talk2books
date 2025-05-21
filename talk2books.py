import os
import requests
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
import google.generativeai as genai
from flask_cors import CORS
import textwrap  # Add this import at the top of your file

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='../talk-to-books-frontend/build', static_url_path='')
CORS(app)

# Configure the generative AI with the API key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Initialize the generative model
model = genai.GenerativeModel('gemini-1.5-flash')
# Google Books API key
books_api_key = os.getenv("GOOGLE_BOOKS_API_KEY")

# Fetch book excerpts related to the query
def fetch_books(query):
    try:
        url = f"https://www.googleapis.com/books/v1/volumes?q={query}&maxResults=5&key={books_api_key}"
        response = requests.get(url)
        
        # Check if the response is successful
        if response.status_code != 200:
            return [f"Error fetching books: {response.status_code} - {response.text}"]
        
        data = response.json()
        
        # Check for errors in the response data
        if "error" in data:
            return [f"Error from API: {data['error'].get('message', 'Unknown error')}"]
        
        books = []
        for item in data.get("items", []):
            title = item["volumeInfo"].get("title", "Unknown Title")
            author = ", ".join(item["volumeInfo"].get("authors", ["Unknown Author"]))
            description = item["volumeInfo"].get("description", "No description available")
            books.append(f"Title: {title}\nAuthor: {author}\nExcerpt: {description}\n")
        
        if not books:
            return ["No books found for the given query."]
        
        return books
    
    except Exception as e:
        return [f"Exception occurred: {str(e)}"]


@app.route('/ask', methods=['POST'])
def ask():
    try:
        data = request.get_json()
        query = data.get("query", "")
        preference = data.get("preference", "both")  # Default to "both" if no preference is provided

        # Initialize response components
        book_excerpts = []
        llm_response = ""

        # Step 1: Fetch book excerpts if the user wants "books" or "both"
        if preference in ["books", "both"]:
            book_excerpts = fetch_books(query)

        # Step 2: Format the book excerpts
        formatted_books = []
        if book_excerpts:
            for idx, excerpt in enumerate(book_excerpts, start=1):
                title, author, description = excerpt.split("\n", 2)  # Split the excerpt into parts
                formatted_books.append({
                    "index": idx,
                    "title": title.replace("Title: ", ""),
                    "author": author.replace("Author: ", ""),
                    "excerpt": description.replace("Excerpt: ", "").strip()
                })

        # Step 3: Fetch LLM response if the user wants "llm" or "both"
        if preference in ["llm", "both"]:
            model_response = model.generate_content(
                query,
                )
            raw_text = model_response.text.strip()
             # Enhance formatting: break long lines, add line breaks for bullet points and headings
            formatted_text = []
            for line in raw_text.split("\n"):
                line = line.strip()

                # Format heading or subheading (usually bold or numbered)
                if line.startswith(("1.", "2.", "3.", "*", "-")):
                    formatted_text.append(f"\n{line}")  # Add a newline before bullet points or numbered lists
                elif any(keyword in line for keyword in [":", "?"]):  # Treat questions or headers as important
                    formatted_text.append(f"\n{line}\n")
                elif len(line) > 80:  # Wrap long lines for better readability
                    wrapped_lines = textwrap.wrap(line, width=80)
                    formatted_text.extend(wrapped_lines)
                else:
                    formatted_text.append(line)

            # Join the formatted lines with newlines
            llm_response = "\n".join(formatted_text)

        # Combine the responses
        response = {
            "books": formatted_books if preference in ["books", "both"] else [],
            "llm_response": llm_response if preference in ["llm", "both"] else ""
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(port=5000, debug=True)

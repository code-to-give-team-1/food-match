
from flask import Flask, request, jsonify
import psycopg2
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import TruncatedSVD

app = Flask(__name__)

# Connect to PostgreSQL directly if not using Node.js for data fetching


def get_db_connection():
    conn = psycopg2.connect(
        host="localhost",  # Adjust as per your Docker setup
        database="food-match",
        user="root",
        password="root"
    )
    return conn


@app.route('/search', methods=['POST'])
def search():
    data = request.json
    query = data.get('query')

    # Fetch the name and description from the Donation table
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        'SELECT id, name, description FROM public."Donation" WHERE "deletedAt" IS NULL')
    rows = cursor.fetchall()
    print(rows)
    # Combine name and description for each row
    ids = [row[0] for row in rows]
    combined_texts = [f"{row[1]}, {row[2]}" for row in rows]

    # Perform the cosine similarity search
    similarities = lsi_cosine_similarity_search(query, combined_texts)

    # Combine the results with their corresponding IDs
    results = [{'id': id, 'similarity': similarity}
               for id, similarity in zip(ids, similarities)]

    # Sort results by similarity in descending order
    results = sorted(results, key=lambda x: x['similarity'], reverse=True)

    cursor.close()
    conn.close()

    return jsonify(results)


def lsi_cosine_similarity_search(query, documents, n_components=2):
    """
    Perform LSI (Latent Semantic Indexing) using SVD and calculate cosine similarity.

    :param query: The query string.
    :param documents: A list of combined name and description texts from the database.
    :param n_components: Number of dimensions to reduce to using SVD.
    :return: List of cosine similarity scores.
    """
    # Vectorize the documents using TF-IDF
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(documents)

    # Perform SVD to reduce dimensions
    svd = TruncatedSVD(n_components=n_components)
    lsi_matrix = svd.fit_transform(tfidf_matrix)

    # Vectorize the query in the same LSI space
    query_vec = vectorizer.transform([query])
    query_lsi = svd.transform(query_vec)

    # Calculate cosine similarity between the query and all documents
    similarities = cosine_similarity(query_lsi, lsi_matrix).flatten()

    return similarities


if __name__ == '__main__':
    app.run(debug=True)

from flask import Flask, request, jsonify
from scipy.spatial.distance import cosine
import numpy as np
import requests
import psycopg2
import os
import logging

app = Flask(__name__)

# Database connection details
DATABASE = {
    'dbname': os.getenv('DATABASE_NAME', 'food-match'),
    'user': os.getenv('DATABASE_USER', 'root'),
    'password': os.getenv('DATABASE_PASSWORD', 'root'),
    'host': os.getenv('DATABASE_HOST', 'postgres')
}

def get_db_connection():
    conn = psycopg2.connect(
        dbname=DATABASE['dbname'],
        user=DATABASE['user'],
        password=DATABASE['password'],
        host=DATABASE['host']
    )
    return conn

def vectorize_query(query):
    url = 'https://sentence-transformer-server-ohgaalojiq-de.a.run.app/embed/'
    response = requests.post(url, json={'query': query})
    return response.json()

def save_vector_to_db(donation_id, vector):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''UPDATE "Donation" SET "vector" = %s WHERE "id" = %s''', (vector, str(donation_id)))
    conn.commit()
    cursor.close()
    conn.close()

#Vectorize Donations - donationId
@app.route('/vectorize_donation', methods=['POST'])
def vectorize_donation():
    data = request.json
    donation_id = data.get('donationId')

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''SELECT "name" FROM "Donation" WHERE "id"::text = %s''', (str(donation_id),))
    result = cursor.fetchone()
    cursor.close()
    conn.close()

    if not result:
        return jsonify({"error": "Donation not found"}), 404

    name = result[0]
    vector = vectorize_query(name)
    save_vector_to_db(donation_id, vector)

    return jsonify({"status": "success"}), 200

#Search Donations - query
@app.route('/search_donations', methods=['POST'])
def search_donations():
    data = request.json
    query = data.get('query')
    query_vector = vectorize_query(query)

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''SELECT "id", "vector" FROM "Donation" WHERE "vector" IS NOT NULL''')
    all_donations = cursor.fetchall()
    cursor.close()
    conn.close()

    # Prepare donation data
    all_donations = [{'id': donation[0], 'vector': np.array(donation[1])} for donation in all_donations]
    # Find similar donations
    top_donations = find_similar_donations(query_vector, all_donations)

    return jsonify({"top_donations": top_donations}), 200

def find_similar_donations(query_vector, all_donations):
    similarities = []
    for donation in all_donations:
        vector = np.array(donation['vector'])
        similarity = 1 - cosine(query_vector, vector)
        similarities.append((donation['id'], similarity))
    return sorted(similarities, key=lambda x: x[1], reverse=True)[:10]

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)

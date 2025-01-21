
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
import numpy as np







def store_embedding(email_id, embedding):
    query = {"_id": email_id}

    update = {"$set": {"vectorEmbeddings": embedding}}

    result = collection.update_one(query, update)

    if result.matched_count > 0:
        print("Embedding successfully updated.")
    else:
        print("Email ID not found. No document was updated.")


def get_random_documents(n=5):
    try:

        random_docs = list(collection.aggregate([{"$sample": {"size": n}}]))

        # Print each document
        for doc in random_docs:
            print(doc)

    except Exception as e:
        print("An error occurred:", e)

def get_embeddings(text):
    try:
        load_dotenv()
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004" ,  task_type="semantic_similarity")
        vector = embeddings.embed_query(text)
        print(type(vector))
        # embeddings_str = json.dumps(vector)
        return True , vector
    except Exception as e:
        logger.error("Error getting embeddings: %s", e)
        return False , ''


# print(get_random_documents(5))
email_id = "192d5225a467fe4b"
success , embedding = get_embeddings("HELLO THERE HOW ARE YOU")
query_embedding = embedding  # replace with your actual query embedding

# Find and print top 5 similar documents
find_similar_documents(embedding, top_n=5)

# store_embedding(email_id, embedding)

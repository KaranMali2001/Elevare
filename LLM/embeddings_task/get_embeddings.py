from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os
from .logger import get_logger
import json


logger = get_logger()


def get_embeddings(text):
    try:
        load_dotenv()
        embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004" ,  task_type="semantic_similarity")
        vector = embeddings.embed_query(text)
        # embeddings_str = json.dumps(vector)
        return True , vector
    except Exception as e:
        logger.error("Error getting embeddings: %s", e)
        return False , ''


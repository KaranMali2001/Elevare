# # import requests
# # import os
# # from PyPDF2 import PdfReader
# # from io import BytesIO


# # # current_directory = os.path.dirname(os.path.realpath(__file__))
# # # file_path = os.path.join(current_directory, 'tmp', 'metadata.pdf')
# # # os.makedirs(os.path.dirname(file_path), exist_ok=True)


# # url = "https://firebasestorage.googleapis.com/v0/b/quicksend-f6763.appspot.com/o/CustomKnowledgeFiles%2Fkaransignup5599%40gmail.com%2FAttention%20is%20All%20you%20Need.pdf?alt=media&token=2de9a0ff-2247-4cbf-a600-9bad85a3d31f"


# # response = requests.get(url=url)
# # # print(  response.encoding , response.status_code , response.apparent_encoding)


# # # with open(file_path, 'wb') as f:
# # #     f.write(response.content)


# # if response.status_code == 200:
# #     file_stream = BytesIO(response.content) # KEEPS Content In Memory
# #     # Read the byte content and decode to string (Assuming it is a text-based file like HTML or plain text)
# #     byte_data = file_stream.getvalue()  # Get the bytes data from the BytesIO object

# #     # try:
# #     #     pdf_reader = PdfReader(file_stream)
# #     #     print(pdf_reader.metadata)
# #     #     first_page = pdf_reader.pages
# #     #     extracted_text = first_page.extract_text()
# #     #     print(f"Extracted text from first page: {extracted_text}")
# #     #     print(f"first page: {first_page}")
# #     # except Exception as e:
# #     #     print("Error : " ,e)
# #     #     pass


# from langchain_community.document_loaders import TextLoader
# import requests
# from io import BytesIO
# from PyPDF2 import PdfReader
# from langchain.docstore.document import Document
# from langchain.text_splitter import CharacterTextSplitter

# url = "https://firebasestorage.googleapis.com/v0/b/quicksend-f6763.appspot.com/o/CustomKnowledgeFiles%2Ftechkaran5599%40gmail.com%2FAttention%20is%20All%20you%20Need.pdf?alt=media&token=d75c246f-3bcc-4c06-b530-40a249fd0f3a"

# response = requests.get(url=url)
# all_text = ""
# if response.status_code == 200:
#     # Store response content in memory as a BytesIO object
#     file_stream = BytesIO(response.content)

#     # Initialize PdfReader with the BytesIO stream
#     pdf_reader = PdfReader(file_stream)

#     # Extract the number of pages in the PDF
#     num_pages = len(pdf_reader.pages)
#     print(f"Number of pages: {num_pages}")

#     # Extract text from each page and print it
#     for page_num in range(num_pages):
#         page = pdf_reader.pages[page_num]
#         extracted_text = page.extract_text()
#         all_text += str(extracted_text)  # Extract text from the page
#     documents = TextLoader(all_text)
#     dovs = documents.load()
#     print(type(dovs))
#     print(dovs)
#     # doc =  Document(page_content=all_text, metadata={"source": "local"})
#     # print(type(doc))  <class 'langchain_core.documents.base.Document'>
#     # print(type([doc])) <class 'list'>
#     # docs.append([doc])
#     text_splitter = CharacterTextSplitter(chunk_size=100, chunk_overlap=50)
#     splits = text_splitter.split_documents(dovs)
#     # print(splits)
#     # for i in splits:
#     #     print(i)
#     #     print("---------------------------------------------------------------")


# else:
#     print(f"Failed to fetch the PDF. Status code: {response.status_code}")

from langchain_google_genai import GoogleGenerativeAIEmbeddings
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
import numpy as np




client = MongoClient(
    "mongodb+srv://karan:GFGDATABASE@gen-email.6dybx.mongodb.net/GenEmailDB")
db = client["GenEmailDB"]  # replace with your database name
collection = db["Emails"]  # replace with your collection name


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

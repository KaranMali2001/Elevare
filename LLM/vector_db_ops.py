from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from qdrant_client.models import Distance, VectorParams
from qdrant_client.models import PointStruct
from qdrant_client.http import models
from langchain_qdrant import QdrantVectorStore
from docs_loader import load_docs
from langchain_core.embeddings import FakeEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os
from PyPDF2 import PdfReader
import logging
from langchain_qdrant import RetrievalMode
from langchain_community.vectorstores import Qdrant

log_folder = "logs"

if not os.path.exists(log_folder):
    os.makedirs(log_folder)

log_file = os.path.join(log_folder, "vector_db.log")
logging.basicConfig(
    filename=log_file,
    # Set log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s',
    filemode='a'
)

logger = logging.getLogger(__name__)

load_dotenv()

# TODO : Add Update Collection Logic


class Vector_DB(object):
    def __init__(self, collection_name=None, force_create=True):
        super(Vector_DB, self).__init__()
        print(collection_name)
        self.key = os.getenv("GOOGLE_API_KEY")
        self.embeddings = GoogleGenerativeAIEmbeddings(
            model="models/text-embedding-004")
        self.collection_name = collection_name
        self.client = self.get_client(collection_name)
        if self.collection_exists(self.collection_name):
            self.vector_store = self.get_vector_store(self.collection_name)
        else:
            if force_create:
                self.create_collection(self.collection_name, 768)
                self.vector_store = self.get_vector_store(self.collection_name)
            else:
                self.vector_store = None

    def check_connection(self , collection_name):
        if self.collection_exists(collection_name) and self.client:
            return True
        else:
            return False
    
    
    def get_client(self, collection_name):
        if collection_name:
            return QdrantClient(url="http://localhost:6333")
        else:
            return None

    def get_retriver(self):
        try:
            doc_store = Qdrant(
                client=self.client,
                collection_name=self.collection_name,
                embeddings=self.embeddings)
            return doc_store, True
        except Exception as e:
            print(e)
            logger.error(e)
            return None, False

    def get_vector_store(self, collection_name):
        try:
            self.vector_store = QdrantVectorStore(
                client=self.client,
                collection_name=self.collection_name,
                embedding=self.embeddings,
            )
            return self.vector_store
        except Exception as e:
            print(e)
            logger.error(e)
            return e

    def create_collection(self, collection_name, dimention):
        try:
            self.client.create_collection(
                collection_name=collection_name,
                vectors_config=VectorParams(
                    size=dimention, distance=Distance.COSINE),
            )
            logger.info(f"Collection - {collection_name} created.")
        except Exception as e:
            logger.error(e)
            print(e)

    # TODO : Add Detailed Response Here {"Added" : True } Like This
    def add_documents(self, docs):
        try:
            self.vector_store.add_documents(docs)
            logger.info(
                f"Documents added to collection - {self.collection_name}.")
            return True
        except Exception as e:
            logger.error(e)
            print(e)
            return False

    def add_embeddings(self , embedding , metadata):
        self.vector_store.add_documents()
        
    
    
    def update_collection(self, collection_name):
        pass

    def similarity_search(self, query, k):
        try:
            # if filter:
            #     result = self.vector_store.similarity_search(
            #         query,
            #         k=k,
            #         filter=models.Filter(
            #             should=[
            #                 models.FieldCondition(
            #                     key="source",
            #                     match=models.MatchValue(
            #                         value=filter_file
            #                     ),
            #                 ),
            #             ]
            #         ),
            #     )
            # else:
            result = self.vector_store.similarity_search(query, k=k)
            return result
        except Exception as e:
            logger.error(e)
            print(e)
            return []

    def delete_collection(self, collection_name):
        try:
            client.delete_collection(collection_name="{collection_name}")
            logger.info(f"Collection - {collection_name} deleted.")
            return True
        except Exception as e:
            print(e)
            logger.error(e)
            return e, False

    def collection_exists(self, collection_name):
        try:
            return self.client.collection_exists(collection_name=collection_name)
        except Exception as e:
            logger.error(e)
            print(e)
            return None

    def collection_info(collection_name):
        if self.collection_exists(collection_name):
            try:
                info = client.get_collection(
                    collection_name="{collection_name}")
                logger.info(f"Collection Details Send for - {collection_name}")
                return {'Collection_exists': True, 'info': info}

            except Exception as e:
                logger.error(e)
                print(e)
                return {'Collection_exists': True, 'error': e}
        else:
            return {'Collection_exists': False}


# try:
#     docs = load_docs(file_path_or_url='paper.pdf',
#                      user_name="chinmaypisal452gmail.com", type='pdf')
#     vd = Vector_DB(collection_name="ChinmayPisal452gmail.com")
#     print(vd.similarity_search("Encoder and Decoder Stacks", k=2 ))
# except Exception as e:
#     logger.error(e)
#     print(e)

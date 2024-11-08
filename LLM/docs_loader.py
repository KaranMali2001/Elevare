from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_community.document_loaders import TextLoader, WebBaseLoader
from urllib.parse import urlparse
import mimetypes
import os , requests
from io import BytesIO


class VersatileDocumentLoader:
    def __init__(self, file_url, chunk_size=500, chunk_overlap=50, file_type=None, file_name=None, user_name=None):
        self.file_url = file_url
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.user_name = user_name
        self.file_type = file_type
        success, self.file_path = self.get_file_data_from_url(
            file_url, file_type, file_name)
        if not success:
            raise Exception(f"Failed to get file from URL: {self.file_path}")
        self.pdf_loader = PyMuPDFLoader(self.file_path)
        self.text_loader = TextLoader(self.file_path)
        self.web_loader = WebBaseLoader(self.file_path)

        self.text_splitter = CharacterTextSplitter(
            chunk_size=self.chunk_size, chunk_overlap=self.chunk_overlap)

    def get_file_data_from_url(self, file_url, file_type, file_name):
        try:
            tmp_dir = '/tmp'
            if not os.path.exists(tmp_dir):
                os.makedirs(tmp_dir)
            response = requests.get(url=file_url)
            if response.status_code == 200:
                file_stream = BytesIO(response.content)

                self.file_path = os.path.join(tmp_dir, file_name)

                if file_type == 'application/pdf':
                    with open(self.file_path, 'wb') as f:
                        f.write(file_stream.getbuffer())
                    print(f"PDF file saved at {self.file_path}")

                else:
                    with open(self.file_path, 'wb') as f:
                        f.write(file_stream.getbuffer())
                    print(f"File saved at {self.file_path}")

                return True, self.file_path

            else:
                return False, response.status_code
        except Exception as e:
            print(f"ERROR: During Getting File From URL: {e}")
            return False, str(e)

    def load(self):
        if self.file_type == 'application/pdf':
            return self._load_pdf()
        elif self.file_type == 'application/text':
            return self._load_text()
        elif self.file_type == 'application/url':
            return self._load_webpage()
        else:
            raise ValueError(f"Unsupported file type: {loader_type}")

    def _load_text(self):
        try:
            documents = self.text_loader.load()
            documents = self.add_custom_metadata(documents)
            return self.text_splitter.split_documents(documents)
        except Exception as e:
            print(f'Error Loading Text \nReason: {e}')
            return []

    
    def _load_pdf(self):
        try:
            documents = self.pdf_loader.load()
            documents = self.add_custom_metadata(documents)
             # Remove the file after processing
            if os.path.exists(self.file_path) and documents:
                os.remove(self.file_path)  # Deletes the file
            print(f"Removed temporary file: {self.file_path}")
            return True , self.text_splitter.split_documents(documents)
        except Exception as e:
            print(f'Error Loading PDF \nReason: {e}')
            return False , e 
    
    
    def _load_webpage(self):
        try:
            documents = self.web_loader.load()
            documents = self.add_custom_metadata(documents)
            return self.text_splitter.split_documents(documents)
        except Exception as e:
            print(f'Error Loading Web Page \nReason: {e}')
            return False , e

    def add_custom_metadata(self, documents):
        for d in documents:
            d.metadata['user_name'] = self.user_name
        return documents


def load_docs(file_url, chunk_size=500, chunk_overlap=50, user_name=None, file_type=None, file_name=None):
    loader = VersatileDocumentLoader(file_url, chunk_size=chunk_size,
                                     chunk_overlap=chunk_overlap, user_name=user_name, file_type=file_type, file_name=file_name)
    try:
        success ,x = loader.load()
        # x = []
        return x, success
    except Exception as e:
        return [], str(e)

# # Usage example
# documents, error = load_docs("https://stackoverflow.com/questions/36075525/how-do-i-run-a-docker-instance-from-a-dockerfile", type='web', chunk_size=500, user_name="John Doe")
# if error:
#     print(f"An error occurred: {error}")

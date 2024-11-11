import faiss
import numpy as np
import pickle
import os

class FaissManager:
    def __init__(self, dimension, index_path="faiss_index.bin", use_gpu=False):
        self.dimension = dimension  # Dimensionality of the embeddings
        self.index_path = index_path
        self.use_gpu = use_gpu
        self.index = self._initialize_index()
        self.embeddings_map = {}  # Store ID to embedding mapping for reference

    def _initialize_index(self):
        # Create a Faiss index based on dimension
        index = faiss.IndexFlatL2(self.dimension)  # L2 (Euclidean) distance
        if self.use_gpu:
            res = faiss.StandardGpuResources()
            index = faiss.index_cpu_to_gpu(res, 0, index)
        # Load index if it exists
        if os.path.exists(self.index_path):
            self._load_index()
        return index

    def add_into_queue(self, item_id, embedding):
        """Add an embedding and its corresponding ID to the index."""
        if item_id in self.embeddings_map:
            print(f"Item with ID {item_id} already exists.")
            return
        embedding = np.array(embedding).astype("float32")
        self.index.add(embedding.reshape(1, -1))
        self.embeddings_map[item_id] = embedding  

    def search_embeddings(self, query_embedding, top_k=5):
        """Search for the most similar embeddings to the query_embedding."""
        query_embedding = np.array(query_embedding).astype("float32").reshape(1, -1)
        distances, indices = self.index.search(query_embedding, top_k)
        results = [(list(self.embeddings_map.keys())[i], distances[0][idx]) 
                   for idx, i in enumerate(indices[0]) if i != -1]
        return results

    def _save_index(self):
        """Save the Faiss index and ID map."""
        faiss.write_index(self.index, self.index_path)
        with open(self.index_path + "_map.pkl", "wb") as f:
            pickle.dump(self.embeddings_map, f)

    def _load_index(self):
        """Load the Faiss index and ID map if they exist."""
        if os.path.exists(self.index_path):
            self.index = faiss.read_index(self.index_path)
        with open(self.index_path + "_map.pkl", "rb") as f:
            self.embeddings_map = pickle.load(f)

    def save(self):
        """Save both the index and the mappings."""
        self._save_index()
        print("Index and mappings saved successfully.")

    def close(self):
        """Save and close index (optional in Faiss but useful for cleanup)."""
        self.save()

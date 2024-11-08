import sqlite3
import os
from abc import ABC, abstractmethod
from db_interface import DatabaseInterface
from logger import get_logger
import numpy as np  # Import numpy to handle embeddings

logger = get_logger()


class SQLiteManager(DatabaseInterface):
    def __init__(self, db_name="embeddings_queue.db"):
        self.db_name = db_name
        self.conn = None
        self.cursor = None
        self.connect()
        self.create_table()

    def connect(self):
        try:
            self.conn = sqlite3.connect(self.db_name)
            self.cursor = self.conn.cursor()
            logger.info("Connected to SQLite database")
        except Exception as e:
            logger.error("Error connecting to database: %s", e)
            raise

    def create_table(self):
        try:
            sql_command = """CREATE TABLE IF NOT EXISTS embeddings_queue ( 
                mail_id VARCHAR(30) PRIMARY KEY, 
                embeddings BLOB
            );"""
            self.cursor.execute(sql_command)
            self.conn.commit()
            logger.info("Table created successfully")
        except Exception as e:
            logger.error("Error creating table: %s", e)
            raise

    def add_into_queue(self, mail_id, embeddings):
        """Add an embedding into the queue."""
        try:
            embeddings_bytes = embeddings.tobytes() if isinstance(
                embeddings, np.ndarray) else embeddings

            sql_command = """INSERT INTO embeddings_queue (mail_id, embeddings) 
                             VALUES (?, ?);"""
            self.cursor.execute(sql_command, (mail_id, embeddings_bytes))
            self.conn.commit()
            logger.info(f"Added embedding for task: {mail_id}")
        except sqlite3.IntegrityError:
            logger.error(f"Task with mail_id '{mail_id}' already exists.")
            print(f"Task with mail_id '{mail_id}' already exists.")
        except Exception as e:
            logger.error("Error adding task: %s", e)
            raise

    def delete_from_queue(self, mail_id):
        """Delete an embedding from the queue by mail_id."""
        try:
            sql_command = """DELETE FROM embeddings_queue WHERE mail_id = ?;"""
            cursor = self.cursor.execute(sql_command, (mail_id,))
            self.conn.commit()
            if cursor.rowcount > 0:
                logger.info(f"Deleted embedding with mail_id: {mail_id}")
            else:
                logger.warning(f"No embedding found with mail_id: {mail_id}")
        except Exception as e:
            logger.error("Error deleting task: %s", e)
            raise

    def close(self):
        """Close the SQLite database connection."""
        if self.conn:
            self.conn.close()
            logger.info("Closed SQLite database connection")

    def get_embedding(self, mail_id):
        """Retrieve an embedding from the queue by mail_id."""
        try:
            sql_command = """SELECT embeddings FROM embeddings_queue WHERE mail_id = ?;"""
            self.cursor.execute(sql_command, (mail_id,))
            result = self.cursor.fetchone()
            if result:
                # Convert bytes back to numpy array
                return np.frombuffer(result[0], dtype=np.float32)
            else:
                logger.warning(f"No embedding found with mail_id: {mail_id}")
                return None
        except Exception as e:
            logger.error("Error retrieving embedding: %s", e)
            raise

    def fetch_top_n(self, n):
        """Retrieve the top n embeddings from the queue."""
        try:
            sql_command = """SELECT mail_id, embeddings FROM embeddings_queue LIMIT ?;"""
            self.cursor.execute(sql_command, (n,))
            results = self.cursor.fetchall()

            top_n_records = []
            for row in results:
                mail_id = row[0]
                embeddings = row[1]

                # Ensure embeddings are treated as bytes before converting to numpy array
                # Sometimes SQLite can return as a string if misinterpreted
                if isinstance(embeddings, str):
                    embeddings = embeddings.encode('utf-8')

                embeddings_array = np.frombuffer(embeddings, dtype=np.float32)
                top_n_records.append((mail_id, embeddings_array))

            return top_n_records
        except Exception as e:
            logger.error("Error fetching top n records: %s", e)
            raise

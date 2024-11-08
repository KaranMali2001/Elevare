import sqlite3
import logging
import os
from abc import ABC, abstractmethod
from sql_lite_manager import SQLiteManager
from db_interface import DatabaseInterface
from logger import get_logger
from get_embeddings import get_embeddings
from fiass_manager import FaissManager


logger = get_logger()


class Manager():
    def __init__(self, db_manager: DatabaseInterface):
        self.db_manager = db_manager
        try:
            self.db_manager.create_table()
            logger.info("Database table setup complete.")
        except Exception as e:
            logger.error("Error setting up database table: %s", e)

    def get_embeddings(self, text):
        success, embeddings = get_embeddings(text)
        if success:
            return embeddings
        else:
            return None

    def add_to_queue(self, mail_id, summury):
        try:
            embeddings = self.get_embeddings(summury)
            self.db_manager.add_into_queue(mail_id, embeddings)
            logger.info(f"Added task with mail_id: {mail_id}")

        except Exception as e:
            logger.error("Error adding to queue: %s", e)
            raise

    def retrieve_top_n(self, n=5):
        try:
            top_n_records = self.db_manager.fetch_top_n(n)
            return top_n_records

        except Exception as e:
            logger.error("Error retrieving top n items: %s", e)
            return None

    def remove_from_queue(self, mail_id):
        try:
            self.db_manager.delete_from_queue(mail_id)
        except Exception as e:
            logger.error("Error removing from queue: %s", e)
            raise


    def close(self):
        self.db_manager.close()


fm = FaissManager(dimension=768)
manager = Manager(fm)
# s = manager.remove_from_queue("test")
s = manager.add_to_queue("test" , "test")
print(s)

data = manager.retrieve_top_n()
print(data)
manager.close()

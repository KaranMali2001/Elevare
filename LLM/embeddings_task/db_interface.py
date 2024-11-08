import logging
import os
from abc import ABC, abstractmethod

class DatabaseInterface(ABC):
    @abstractmethod
    def connect(self):
        pass

    @abstractmethod
    def create_table(self):
        pass

    @abstractmethod
    def close(self):
        pass

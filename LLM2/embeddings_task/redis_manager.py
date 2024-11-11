

import redis
from db_interface import DatabaseInterface
from logger import get_logger

logger = get_logger()


class RedisManager(DatabaseInterface):
    def __init__(self, host='localhost', port=6379, db=0):
        self.host = host
        self.port = port
        self.db = db
        self.redis_conn = None
        self.connect()

    def connect(self):
        try:
            self.redis_conn = redis.Redis(
                host=self.host, port=self.port, db=self.db)
            logger.info("Connected to Redis")
        except Exception as e:
            logger.error("Error connecting to Redis: %s", e)
            raise

    def initialize(self):
        # Redis does not require explicit table/collection creation, so initialize may not be needed
        logger.info("Redis initialized (no action needed)")

    def close(self):
        if self.redis_conn:
            self.redis_conn.close()
            logger.info("Closed Redis connection")

    def add_task(self, task):
        """Adds a task to the Redis list (acting as a queue)."""
        self.redis_conn.lpush("task_queue", task)
        logger.info(f"Added task to Redis: {task}")

    def get_task(self):
        """Gets and removes a task from the Redis list (acting as a queue)."""
        task = self.redis_conn.rpop("task_queue")
        if task:
            task = task.decode("utf-8")
            logger.info(f"Retrieved task from Redis: {task}")
            return task
        logger.info("No tasks in Redis queue.")
        return None

import logging , os


log_folder = "logs"

if not os.path.exists(log_folder):
    os.makedirs(log_folder)
    
log_file = os.path.join(log_folder, "app.log")

logging.basicConfig(
    filename='app.log', 
    level=logging.INFO, 
    format='%(asctime)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s',
    filemode='a'  
)

logger = logging.getLogger("fastapi_project_logger")

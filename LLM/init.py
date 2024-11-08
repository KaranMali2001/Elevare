import nltk
from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
import nltk


def init_llm():
    load_dotenv()
    try:
        api_key = os.getenv('GROQ_API_KEY')
        api_key2 = os.getenv('GROQ_API_KEY_1')
    except Exception as e:
        return {"API Key Not In .env": e}
    try:
        llm = ChatGroq(
            model="llama3-70b-8192",
            api_key=api_key,
            temperature=0.5,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )
        return llm
    except Exception as e:
        print("LLM init Failed \n", e)
        return {"LLM init Failed": e}



def genrate_init_llm():
    load_dotenv()
    try:
        api_key = os.getenv('GROQ_API_KEY')
        api_key2 = os.getenv('GROQ_API_KEY_1')
    except Exception as e:
        return {"API Key Not In .env": e}
    try:
        llm = ChatGroq(
            model="llama3-70b-8192",
            api_key=api_key,
            temperature=1.3,
            max_tokens=None,
            timeout=None,
            max_retries=2,
        )
        return llm
    except Exception as e:
        print("LLM init Failed \n", e)
        return {"LLM init Failed": e}


def init_nltk():
    try:
        nltk.download('punkt_tab')
        return {"Success": True}
    except Exception as e:
        return {"Error": e}

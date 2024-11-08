
from langchain_groq import ChatGroq
import os
from langchain import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
import yaml
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from vector_db_ops import Vector_DB
from langchain.schema.runnable import RunnablePassthrough


from vector_db_ops import Vector_DB
load_dotenv()


def load_prompts(yaml_file):
    try:
        with open(yaml_file, 'r') as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(e)
        return None


prompts = load_prompts('prompts.yaml')


def get_llm():
    api_key2 = os.getenv('GROQ_API_KEY_1')
    llm = ChatGroq(
        model="llama3-70b-8192",
        api_key=api_key2,
        temperature=0.9,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )
    return llm


def get_custom_knowledge(retriver,user_name, querry):
    collection_name = user_name
    collection = Vector_DB(collection_name=user_name, force_create=False)
    if collection.collection_exists:
        data = collection.similarity_search(querry, k=2)
        return data 
    else:
        return None


def chat_bot():
    try:
        llm = get_llm()
        template = prompts['only_chat_with_custom_knowledge']
        if template and llm:
            prompt = PromptTemplate(
                template=template,
                input_variables=["custom_knowledge", "querry"],
                # partial_variables={
                #     "querry": parser.get_format_instructions(),
                #     "category_list" : categories
                #     },
            )
            chain = prompt | llm
            return chain
        else:
            return None
    except Exception as e:
        print(e)
        return None


def chat_bot_get(chain,  custom_knowledge,  querry):
    try:
        x = chain.invoke(
            {"custom_knowledge": custom_knowledge, "querry": querry})
        return True, x
    except Exception as e:
        return False, str(e)

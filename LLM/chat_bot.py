
from langchain_groq import ChatGroq
import os
from langchain import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
import yaml
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from vector_db_ops import Vector_DB
from langchain.schema.runnable import RunnablePassthrough
from langchain.memory import ConversationSummaryMemory
from langchain_community.chat_message_histories import ChatMessageHistory
from vector_db_ops import Vector_DB
load_dotenv()
chat_history = ChatMessageHistory()

def load_prompts(yaml_file):
    try:
        with open(yaml_file, 'r') as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(e)
        return None


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








prompts = load_prompts('prompts.yaml')



def get_custom_knowledge(retriver, user_name, querry):
    try:
        collection_name = user_name
        collection = Vector_DB(collection_name=user_name, force_create=False)
        if collection.collection_exists:
            data = collection.similarity_search(querry, k=2)
            return data
        else:
            return None
    except Exception as e:
        print(e)
        return None


def chat_bot():
    try:
        llm = get_llm()
        template = prompts['only_chat_with_custom_knowledge']
        if template and llm:
            prompt = PromptTemplate(
                template=template,
                input_variables=["custom_knowledge", "querry" , "history"],
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



def summarize_messages(chain_input):
    try:
        stored_messages = chat_history.messages
        if len(stored_messages) == 0:
            return False
        summarization_prompt = ChatPromptTemplate.from_messages(
            [
                MessagesPlaceholder(variable_name="chat_history"),
                (
                    "user",
                    "Distill the above chat messages into a single summary message. Include as many specific details as you can.",
                ),
            ]
        )
        summarization_chain = summarization_prompt | chat
        summary_message = summarization_chain.invoke({"chat_history": stored_messages})
        chat_history.clear()
        chat_history.add_message(summary_message)
        return True
    except Exception as e:
        print(f"Error summarizing messages: {e} ")
        return False




def chat_bot_get(chain,  custom_knowledge,  querry):
    try:
        chat_history.add_user_message(querry)
        x = chain.invoke(
            {"custom_knowledge": custom_knowledge, "querry": querry , "history": chat_history.messages})
        ai_response = [{"role": "assistant", "content": x.content}]
        chat_history.add_ai_message(x.content)
        summarize_messages(chat_history)
        return True, x 
    except Exception as e:
        return False, str(e)

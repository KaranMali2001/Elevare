from langchain_groq import ChatGroq
import os
from langchain import PromptTemplate
from langchain.schema.output_parser import StrOutputParser
import yaml
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from vector_db_ops import Vector_DB
from langchain.schema.runnable import RunnablePassthrough
from langchain.memory import ConversationSummaryMemory, ChatMessageHistory
import uuid

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
                input_variables=["custom_knowledge", "querry", "chat_summary"],
            )
            chain = prompt | llm
            return chain
        else:
            return None
    except Exception as e:
        print(e)
        return None

def chat_bot_get(chain, custom_knowledge, querry, memory=None):
    try:
        if memory is None:
            memory = ConversationSummaryMemory(llm=get_llm(), return_messages=True)
        
        user_message = {"role": "user", "content": querry}
        memory.chat_memory.add_user_message(user_message)

        result = chain.invoke(
            {"custom_knowledge": custom_knowledge, "querry": querry, "chat_summary": memory.buffer})
        
        ai_response = {"role": "assistant", "content": str(result)}
        memory.chat_memory.add_ai_message(ai_response)

        # Limit the summary length
        max_summary_length = 1000
        if len(memory.buffer) > max_summary_length:
            memory.buffer = memory.buffer[-max_summary_length:]

        return True, result, memory
    except Exception as e:
        return False, str(e), None

# Example usage
chain = chat_bot()

conversation_id = str(uuid.uuid4())  # Generate a unique ID for the conversation
memory = ConversationSummaryMemory(llm=get_llm(), return_messages=True)

while True:
    user_input = input("User: ")
    
    custom_knowledge = get_custom_knowledge(None, conversation_id, user_input)
    
    success, response, updated_memory = chat_bot_get(chain, custom_knowledge, user_input, memory)
    
    if success:
        print("AI:", response)
        memory = updated_memory
    else:
        print("Error:", response)

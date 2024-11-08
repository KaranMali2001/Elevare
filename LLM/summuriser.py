from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
import os ,re , json
import yaml
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_core.pydantic_v1 import BaseModel, Field
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field, validator
from typing import List, Optional



class Single_mail(BaseModel):
    mail_id: str
    # sender_name : str = "None"
    short_summary: str = "None"
    summary: str = "None"
    tone: str = "None"
    category: str = "None"
    sentiment : str = "None"


class Batch_Mails(BaseModel):
    batch: List[Single_mail]


class Single_Summury_Response_format(BaseModel):
    sender: str = Field(description="Sender Name")
    role: str = Field(description="Role Of sender")
    tone: str = Field(description=" overall tone of speech")
    short_summury: str = Field(description="30 words summury")
    summary: str = Field(description="atleast 50 words summury")
    spam: str = Field(description="mail is spam or not")
    reguards_from: str = Field(description=" Who is sending this ")

class Thread_Summury_Response_format(BaseModel):
    thread_summary : str = Field(description="")







def load_prompts(yaml_file):
    try:
        with open(yaml_file, 'r') as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(e)
        return None

prompts = load_prompts('prompts.yaml')





# BATCH MAIL SUMMURY START




# ==== EXTRACTION OPS =====

def response_check_func(response):
    # print("INSIDE RESPONSE CHECK")
    # success , response = extract_json(response)
    if True : 
        if not isinstance(response, list):
            return False
        else:
            return True
    else : 
        return False



def extract_json(response):
    # print("INSIDE EXTRACT JSON")
    json_match = re.search(r'\[.*\]', response)
    # print("JSON RESPONSE")
    # print(json_match)
    print(isinstance(json_match, str))
    if json_match and isinstance(json_match, str):
        response = json_match.group()  
        try:
            response = json.loads(json_str)  
            return True , response
        except json.JSONDecodeError:
            print("Invalid JSON data")
            return False , response
    elif json_match and isinstance(json_match, list):
        print(json_match)
        return True , response 
    
    else:
        print("No JSON found in the string")
        return False , response

# ==== EXTRACTION OPS END ======




# ===== BATCH MAIL SUMMURY =====

def batch_mail_wrapper_func(list_of_mails,categories,username, llm):
    # print(list_of_mails)
    template = prompts['summury_batch_mail_prompt']
    if template:
        parser = JsonOutputParser(pydantic_object = Batch_Mails)
        prompt = PromptTemplate(
            template=template,
            input_variables=["list_of_mails"],
            partial_variables={
                "format_instructions": parser.get_format_instructions(),
                "category_list" : categories
                },
        )
        chain = prompt | llm | parser
        return batch_mail_summarizer_chain_executer(list_of_mails,username, chain, llm)
    else:
        return {"error": "YAML Read Error"}


def batch_mail_summarizer_chain_executer(list_of_mails,username, chain, llm):
    print("INSIDE batch_mail_summarizer_chain_executer ")
    try:
        x = chain.invoke({"list_of_mails": list_of_mails})
        # print(x['batch'])
        if response_check_func(x['batch']):
            genrate_embeddings_and_store(x['batch'] , username)
            return True, x['batch']
        # print(x)
    except Exception as e:
        return False, {"error": str(e)}


# ===== BATCH MAIL SUMMURY END  =====



# ===== THREAD MAIL SUMMURY =====
def thread_wrapper_func(thread_id, previous_conversation_summury,latest_mail, llm):
    template = prompts['summury_thread_prompt']
    if template:
        parser = JsonOutputParser(pydantic_object = Thread_Summury_Response_format)
        prompt = PromptTemplate(
            template=template,
            input_variables=["previous_conversation_summury", "latest_mail"],
            partial_variables={
                "format_instructions": parser.get_format_instructions()},
        )
        chain = prompt | llm | parser
        return thread_summarizer_chain_executer(thread_id, previous_conversation_summury,latest_mail , chain)
    else:
        return {"error": "YAML Read Error"}


def thread_summarizer_chain_executer(thread_id, previous_conversation_summury,latest_mail , chain):
    try:
        x = chain.invoke({"previous_conversation_summury": previous_conversation_summury, "latest_mail": latest_mail})
        return x
    except Exception as e:
        return {"error": str(e)}


# ===== THREAD MAIL SUMMURY END  =====


# SINGLE MAIL SUMMURY START

def single_mail_summury_wrapper_func(mail_id, subject, email, sender, llm):
    template = prompts['summury_single_mail_prompt']
    if template:
        parser = JsonOutputParser(pydantic_object = Single_mail)
        prompt = PromptTemplate(
            template=template,
            input_variables=["mail", "subject"],
            partial_variables={
                "format_instructions": parser.get_format_instructions()},
        )
        chain = prompt | llm | parser
        return email_summarizer_chain_executer(chain, email, subject, sender, llm)
    else:
        return {"error": "YAML Read Error"}


def email_summarizer_chain_executer(chain, email, subject, sender, llm):
    try:
        x = chain.invoke({"mail": email, "subject": subject, "sender": sender})
        return x
    except Exception as e:
        return {"error": str(e)}

# SINGLE MAIL SUMMURY END



def genrate_embeddings_and_store(mails , username):
    print(mails)
    username = str(username)+"_mail_embeddings"
    print(str(username) )
    
    
    
    
    
    


# def is_valid_mail_entry(mail):
#     """Checks if a single mail entry has the required structure and types."""
#     required_fields = {"mail_id": str, "short_summary": str, "summary": str, "tone": str}
#     if not isinstance(mail, dict):
#         return False

#     for field, field_type in required_fields.items():
#         if field not in mail or not isinstance(mail[field], field_type):
#             return False
#     return True

# def validate_mail_list(response):
#     """Validates the entire mail response structure."""
#     if not isinstance(response, list):
#         return False

#     for mail in response:
#         if not is_valid_mail_entry(mail):
#             return False

#     return True


# def response_check_func(response):
#     print("INSIDE RESPONSE CHECK")
#     success , response = extract_json(response)
#     if success : 
#         if not isinstance(response, list):
#             return False
#         else:
#             return True
#     else : 
#         return False

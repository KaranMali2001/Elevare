from dotenv import load_dotenv
from langchain.prompts import PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import LLMChain
import os
import yaml
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_core.pydantic_v1 import BaseModel, Field
from tokens_operations import count_tokens
from fastapi import HTTPException
from vector_db_ops import Vector_DB

def load_prompts(yaml_file):
    try:
        with open(yaml_file, 'r') as file:
            return yaml.safe_load(file)
    except Exception as e:
        print(e)
        return None


class Genrate_Without_Thread_Response_format(BaseModel):
    subject: str = Field(description="Subject of genrated  mail")
    body: str = Field(description="Body of genrated  mail")


prompts = load_prompts('prompts.yaml')

# # TODO :Remove Min Max and keep lengh
# def extract_data_from_mail_request(response):
#     # Directly access attributes of the Pydantic model
#     try:
#         extracted_info = {
#             'receiver': response.receiver,  # Note the correct spelling here
#             'previous_subject': response.previous_subject,
#             'previous_body': response.previous_body,
#             'sender': response.sender,
#             'response': response.response,
#             'response_tone': response.response_tone,
#             'response_writing_style': response.response_writing_style,
#             'compose_language': response.compose_language,  
#             'length': response.length,
#             # 'mail_id': response.mail_id,
#             # 'organization': responsef.organization,   
#             # 'response_subject': response.response_subject,
#             # Note the correct spelling here
#             # 'special_characters': response.special_characters,
#             # 'max_words': response.max_words,
#             # 'min_words': response.min_/words,
#             # 'format': response.format,
#             # 'input_data': response.input_data,
#             # 'details': response.details
#         }
#         # print(type(extracted_info))
#         print(extracted_info.keys())
#         return extracted_info
#     except Exception as e:
#         print(f"Error extracting data: {e}")
#         return e



def extract_data_from_mail_request(response):
    try:
        extracted_info = {}
        if hasattr(response, 'receiver'):
            extracted_info['receiver'] = response.receiver
        
        if hasattr(response, 'previous_subject'):
            extracted_info['previous_subject'] = response.previous_subject
        
        if hasattr(response, 'previous_body'):
            extracted_info['previous_body'] = response.previous_body
        
        if hasattr(response, 'sender'):
            extracted_info['sender'] = response.sender
        
        if hasattr(response, 'response'):
            extracted_info['response'] = response.response
        
        if hasattr(response, 'response_tone'):
            extracted_info['response_tone'] = response.response_tone
        
        if hasattr(response, 'response_writing_style'):
            extracted_info['response_writing_style'] = response.response_writing_style
        
        if hasattr(response, 'compose_language'):
            extracted_info['compose_language'] = response.compose_language
        
        if hasattr(response, 'length'):
            length = ""
            if response.length == "Short" : length = "20 to 30 words"
            elif response.length == "Medium" : length = "40 to 60 words"
            elif response.length == "Long" : length = "80 to 100 words"
            elif response.length == "Best Fit" : length = "Choose Best you want which best suites."
            extracted_info['length'] =   length      
        print(extracted_info.keys())
        return extracted_info

    except Exception as e:
        print(f"Error extracting data: {e}")
        return e


# SINGLE MAIL SUMMURY START

def genrate_without_thread(response, llm, use_custom_knowledge = False , user_name = None):
    print(response)
    if use_custom_knowledge:
        # print("in customs")
        template = prompts['genrate_mail_with_custom_knowledge_prompt']
        extracted_info = extract_data_from_mail_request(response) 
        collection_name = user_name
        collection = Vector_DB(collection_name=user_name)
        if collection.collection_exists:
            data = collection.similarity_search(extracted_info["response"] , k=2)
            page_contents = [doc.page_content for doc in data]
            if data:
                extracted_info.update({'custom_knowledge': data})
            else:
                extracted_info.update({'custom_knowledge': "There Is No Data Avilable in Collection"})
        else:
            pass
        if extracted_info:
            if template:
                parser = JsonOutputParser(
                pydantic_object=Genrate_Without_Thread_Response_format)
                prompt = PromptTemplate(
                    template=template,
                    input_variables=extracted_info.keys(),
                    partial_variables={
                        "format_instructions": parser.get_format_instructions()},
                )
                print(prompt)
                # tokens = count_tokens(prompt)
                # print(tokens)
                chain = prompt | llm | parser
                return genrate_without_thread_chain_executer(chain, extracted_info)
            else:
                raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
        else : 
            raise HTTPException(status_code=500, detail=f": {str(e)}")
    else:
        template = prompts['genrate_mail_prompt']
        extracted_info = extract_data_from_mail_request(response)
        print(extracted_info)   
        if extracted_info:
            if template:
                parser = JsonOutputParser(
                pydantic_object=Genrate_Without_Thread_Response_format)
                prompt = PromptTemplate(
                    template=template,
                    input_variables=extracted_info.keys(),
                    partial_variables={
                        "format_instructions": parser.get_format_instructions()},
                )
                # print(prompt)
                # tokens = count_tokens(prompt)
                # print(tokens)
                chain = prompt | llm | parser
                return genrate_without_thread_chain_executer(chain, extracted_info)
            else:
                raise HTTPException(status_code=500, detail=f"  Internal server error: {str(e)}")
        else : 
            raise HTTPException(status_code=500, detail=f": {str(e)}")



def genrate_without_thread_with_custom_knowledge(response, llm , user_name ):
    print(response)
    template = prompts['genrate_mail_with_custom_knowledge_prompt']
    extracted_info = extract_data_from_mail_request(response)
    print(extracted_info)   
    if extracted_info:
        if template:
            parser = JsonOutputParser(
            pydantic_object=Genrate_Without_Thread_Response_format)
            prompt = PromptTemplate(
                template=template,
                input_variables=extracted_info.keys(),
                partial_variables={
                    "format_instructions": parser.get_format_instructions()},
            )
            # print(prompt)
            # tokens = count_tokens(prompt)
            # print(tokens)
            chain = prompt | llm | parser
            return genrate_without_thread_chain_executer(chain, extracted_info)
        else:
            raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    else : 
        raise HTTPException(status_code=500, detail=f": {str(e)}")


# def genrate_without_thread_chain_executer(chain, extracted_info):

#     try:
#         x = chain.invoke({"previous_subject": extracted_info.previous_subject, "subject": subject, "sender": sender})
#         return x
#     except Exception as e:
#         return {"error": str(e)}


def genrate_without_thread_chain_executer(chain, extracted_info):
    try:
        x = chain.invoke(extracted_info)
        print(x)
        return x
    except Exception as e:
        raise HTTPException(status_code=500, detail=f": {str(e)}")



def genrate(response, llm, use_custom_knowledge = False , user_name = None):
    print(response)
    if use_custom_knowledge:
        # print("in customs")
        template = prompts['compose_mail_prompt']
        extracted_info = extract_data_from_mail_request(response) 
        collection_name = user_name
        collection = Vector_DB(collection_name=user_name)
        if collection.collection_exists:
            data = collection.similarity_search(extracted_info["response"] , k=2)
            page_contents = [doc.page_content for doc in data]
            if data:
                extracted_info.update({'custom_knowledge': data})
            else:
                extracted_info.update({'custom_knowledge': "There Is No Data Avilable in Collection"})
        else:
            pass
        if extracted_info:
            if template:
                parser = JsonOutputParser(
                pydantic_object=Genrate_Without_Thread_Response_format)
                prompt = PromptTemplate(
                    template=template,
                    input_variables=extracted_info.keys(),
                    partial_variables={
                        "format_instructions": parser.get_format_instructions()},
                )
                # tokens = count_tokens(prompt)
                # print(tokens)
                chain = prompt | llm | parser
                return genrate_without_thread_chain_executer(chain, extracted_info)
            else:
                raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
        else : 
            raise HTTPException(status_code=500, detail=f": {str(e)}")
    else:
        template = prompts['compose_mail_prompt']
        extracted_info = extract_data_from_mail_request(response)
        print(extracted_info)   
        if extracted_info:
            if template:
                parser = JsonOutputParser(
                pydantic_object=Genrate_Without_Thread_Response_format)
                prompt = PromptTemplate(
                    template=template,
                    input_variables=extracted_info.keys(),
                    partial_variables={
                        "format_instructions": parser.get_format_instructions()},
                )
                # print(prompt)
                # tokens = count_tokens(prompt)
                # print(tokens)
                chain = prompt | llm | parser
                return genrate_without_thread_chain_executer(chain, extracted_info)
            else:
                raise HTTPException(status_code=500, detail=f"  Internal server error: {str(e)}")
        else : 
            raise HTTPException(status_code=500, detail=f": {str(e)}")
    
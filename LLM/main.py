from typing import Union, List
from fastapi import FastAPI, Request
from pydantic import BaseModel
from summuriser import single_mail_summury_wrapper_func, batch_mail_wrapper_func, thread_wrapper_func
from langchain_groq import ChatGroq
import os , asyncio
from fastapi.responses import JSONResponse
from qdrant_client.http import models
from dotenv import load_dotenv
from init import init_llm, genrate_init_llm
# import nltk
from genrate import genrate_without_thread,  genrate
from tokens_operations import count_tokens
# from vector_db_ops import __init__quadrant_client
from qdrant_client import QdrantClient
from vector_db_ops import Vector_DB
from fastapi import HTTPException
from docs_loader import load_docs
from logger import logger
# import asyncio
# import pandas as pd
from embeddings_task.get_embeddings import get_embeddings
from chat_test import get_graph  , inv 
from mail_summury_embeddings import add_mail_embeddings


try:
    app = FastAPI()
    llm = init_llm()
    graph = get_graph()
    # graph = get_react_graph()
    print(graph)
    genrate_llm = genrate_init_llm()
    q_client = QdrantClient(url="http://localhost:6333")
except Exception as e:
    print(f'Critical Error AT Init : {e}')


class Mail_Object(BaseModel):
    mail_id: str
    subject: str
    sender: str | None = None
    body: str


class MailBatchRequest(BaseModel):
    username: str
    emails: List[Mail_Object]
    categories: List[str] | None = None


class Token_Count_TextRequest(BaseModel):
    text: str


class Mail_Genrate_Object(BaseModel):
    sender: str
    receiver: str
    response: str
    response_tone: str = "Official"
    response_writing_style: str = "Formal"
    compose_language: str = "English"
    length: str = "Medium"


class Mail_Genrate_Object_Without_Thread(BaseModel):
    previous_subject: str
    previous_body: str
    sender: str
    receiver: str
    response: str
    response_tone: str = "Official"
    response_writing_style: str = "Formal"
    compose_language: str = "English"
    length: str = "Medium"
    # max_words: int = 50
    # min_words: int = 10
    # special_characters: list = ["NONE"]
    # organization: str | None = None
    # mail_id: str
    # response_subject: str | None = None

    # format: str = "text"
    # input_data: str | None = None
    # details: str | None = None


class Mail_Genrate_Object_Without_Thread_Request(BaseModel):
    username: str
    custom_knowledge: bool = False
    data: Mail_Genrate_Object_Without_Thread


class Mail_Genrate_Object_Request(BaseModel):
    username: str
    custom_knowledge: bool = False
    data: Mail_Genrate_Object


class Add_Custom_Knowledge_Request(BaseModel):
    file_url: str
    file_name: str
    type: str
    user_name: str


class latest_thread_conversation(BaseModel):
    latest_sender_name: str
    latest_body: str


class thread_mail_body(BaseModel):
    thread_id: str
    previous_conversation_summary: str
    latest_thread_conversation: latest_thread_conversation


class Chat_Query(BaseModel):
    id: str
    query: str
    user_name: str



@app.get("/")
async def started():
    return JSONResponse({"message": "ok"},status_code=200)
@app.post("/api/post/summury/batch_of_mails")  # -- After
async def mail_batch(mail_batch_request: MailBatchRequest):
    try:
        email_list = []
        user_name = mail_batch_request.username
        maps = {}
        for email in mail_batch_request.emails:
            try:
                mail_id = email.mail_id
                subject = email.subject
                body = email.body
                maps[mail_id] = {
                    "sender": email.sender
                }
            except Exception as e:
                logger.error(e)
                raise HTTPException(
                    status_code=400, detail=f"Badly formatted request: {str(e)}")
            email_list.append({
                "mail_id": email.mail_id,
                "subject": email.subject,
                "body": email.body,
                "sender": email.sender
            })
        try:
            complete, responses = batch_mail_wrapper_func(
                email_list, mail_batch_request.categories, mail_batch_request.username, llm)
            # print(responses, complete)
            if complete:
                # asyncio.create_task(create_embeddings(responses, maps , user_name))
                return responses
            else:
                raise HTTPException(
                    status_code=500, detail=f"Error At Summuriser Inner : {responses}")
        except Exception as e:
            logger.error(e)
            raise HTTPException(
                status_code=500, detail=f"Error At Summuriser: {str(e)}")
    except Exception as e:
        logger.error(f"Not Vlaid Format : {e}")
        raise HTTPException(status_code=500, detail=f"Invalid Req: {e}")
    # return {"summaries": responses}


# @app.post("/api/post/mail")  -- Before
@app.post("/api/post/summury/mail")  # -- After
async def single_mail(email_body: Mail_Object):
    try:
        response = single_mail_summury_wrapper_func(
            email_body.mail_id, email_body.subject, email_body.body, email_body.sender, llm)
        response['mail_id'] = email_body.mail_id
        return response
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=500, detail=f"Internal server error: {str(e)}")
    # return {"summary": response}


@app.post("/api/post/summury/thread")
async def thread_mail_summury(request: thread_mail_body):
    try:
        response = thread_wrapper_func(thread_id=request.thread_id, previous_conversation_summury=request.previous_conversation_summary,
                                       latest_mail=request.latest_thread_conversation, llm=llm)
        if isinstance(response, dict):
            response['thread_id'] = request.thread_id
            return response
        else:
            t = type(response)
            raise HTTPException(
                status_code=500, detail=f"Error At Thread Summuriser : Wrong Response Type : {t}")
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=500, detail=f"Error At Thread Summuriser  : {str(e)}")


@app.post("/api/count_tokens")
async def tokens_counter(request: Token_Count_TextRequest):
    try:
        return count_tokens(request.text)
    except Exception as e:
        logger.error(e)
        return {"error": str(e)}


@app.post("/api/post/genrate/without_thread/")
async def mail_genrate_without_thread(response: Mail_Genrate_Object_Without_Thread_Request):
    try:
        data = response.data
        user_name = response.username
        use_custom_knowledge = response.custom_knowledge
        if response.custom_knowledge:
            result = genrate_without_thread(
                data, genrate_llm, use_custom_knowledge=True, user_name=user_name)
            return {
                "response": result
            }
        else:
            result = genrate_without_thread(data, genrate_llm)
            return {
                "response": result
            }
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=500, detail=f"Error At Genarte : {str(e)}")


@app.post("/api/post/info/collection/")
async def collection_info(user_name: str):
    if q_client.collection_exists(collection_name=user_name):
        return q_client.get_collection(collection_name=user_name)
    else:
        return {'Collection_exists': False}


@app.post("/api/post/add_custom_knowledge/")
async def add_custom_knowledge(response: Add_Custom_Knowledge_Request):
    file_url = response.file_url
    file_name = response.file_name
    file_type = response.type
    user_name = response.user_name
    errors = []
    if file_url and file_name and file_type and user_name:
        try:
            try:
                connected = False
                user_collection = Vector_DB(collection_name=user_name)
                if user_collection.check_connection(user_name):
                    connected = True
                    print(user_collection)
                    if user_collection:
                        docs, error = load_docs(
                            file_url, file_type=file_type, file_name=file_name, user_name=user_name)
                        if not error:
                            return JSONResponse(status_code=400, content={'Error': error})

                else:
                    return JSONResponse(status_code=500, content={"Couldnt Connect To Vector Db Check Connection : Connected status : False"})

            except Exception as x:
                logger.error(x)
                errors.append(str(x))
                return JSONResponse(status_code=500, content={"Error": str(x)})

            try:
                if user_collection.add_documents(docs=docs):
                    return JSONResponse(status_code=200, content={'success': True})
                else:
                    return JSONResponse(status_code=400, content={})
            except Exception as e:
                logger.error(e)
                errors.append(str(e))
                return JSONResponse(status_code=400, content={"Error": error})

        except Exception as e:
            logger.error(e)
            errors.append(str(e))
            return JSONResponse(status_code=400, content={"Error add_custom_knowledge : main": error})
    else:
        raise HTTPException(
            status_code=400, detail=f"Request Body Error / Some Fields Are Missing ")


@app.post("/api/post/compose/")
async def genrate_mail(response: Mail_Genrate_Object_Request):
    try:
        data = response.data
        user_name = response.username
        use_custom_knowledge = response.custom_knowledge
        if response.custom_knowledge:
            result = genrate(
                data, genrate_llm, use_custom_knowledge=True, user_name=user_name)
            return {
                "response": result
            }
        else:
            result = genrate(data, genrate_llm, user_name=user_name)
            return {
                "response": result
            }
    except Exception as e:
        logger.error(e)
        raise HTTPException(
            status_code=500, detail=f"Error At Genarte : {str(e)}")


async def create_embeddings(response, maps, user_name):
    try:
        add_mail_embeddings(response, maps, user_name)
    except Exception as e:
        print(e)
        




@app.post("/api/chat/")
async def chat(response: Chat_Query):
    if graph:
        try:
            query = response.query
            id = response.id
            user_name = response.user_name
            unmae = "NONE"
            # custom_knowledge = get_custom_knowledge(retriver,unmae,  query)
            custom_knowledge = "None"
            ai_response = inv(graph=graph, custom_knowledge=custom_knowledge, querry=query , id=id)
            print(ai_response)
            return ai_response
        except Exception as e:
            logger.error(e)
            raise HTTPException(
                status_code=500, detail=f"Error At Chat : {str(e)}")
    else:
        raise HTTPException(status_code=500, detail="Chat Chain Is None")

from langchain_groq import ChatGroq
import os
from langchain.schema.output_parser import StrOutputParser
import yaml
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.prompts import PromptTemplate
from vector_db_ops import Vector_DB
from langchain.schema.runnable import RunnablePassthrough
import uuid
from langgraph.graph import StateGraph, START, END
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.tools import WikipediaQueryRun
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition
from typing import Annotated
from typing_extensions import TypedDict
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent
memory = MemorySaver()

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
    api_key2 = os.getenv('GROQ_API_KEY_CHAT_BOT')
    llm = ChatGroq(
        model="llama3-70b-8192",
        api_key=api_key2,
        temperature=0.9,
        max_tokens=None,
        timeout=None,
        max_retries=2,
    )
    return llm


api_wrapper = WikipediaAPIWrapper(top_k_results=1, doc_content_chars_max=300)
wiki_tool = WikipediaQueryRun(api_wrapper=api_wrapper)
tools = [wiki_tool]
llm = get_llm()


class State(TypedDict):
    messages: Annotated[list, add_messages]


def get_graph():
    def chatbot(state: State):
        return {"messages": [llm_with_tools.invoke(state["messages"])]}

    graph_builder = StateGraph(State)
    # llm_with_tools = llm.bind_tools(tools=tools)
    llm_with_tools = llm

    graph_builder.add_node("chatbot", chatbot)
    # tool_node = ToolNode(tools=tools)
    # graph_builder.add_node("tools", tool_node)

    # graph_builder.add_conditional_edges(
    #     "chatbot",
    #      tools_condition,
    # )

    # graph_builder.add_edge("chatbot")
    graph_builder.add_edge(START, "chatbot")
    graph_builder.add_edge("chatbot", END)

    graph = graph_builder.compile(
        checkpointer=memory,
    )
    return graph


# prompt = ChatPromptTemplate.from_messages(
#     [
#         ("system", "Your Name Is Elevare. You Are a Helpful bot for Email assistance"),
#         ("placeholder", "{messages}"),
#     ]
# )


# class CustomState(TypedDict):
#     # today: str
#     messages: Annotated[list[BaseMessage], add_messages]
#     is_last_step: str

# def get_react_graph():
#     llm = get_llm()
#     graph = create_react_agent(llm, tools=tools , state_schema=CustomState, state_modifier=prompt)
#     return graph


# graph = get_graph()


def inv(graph, custom_knowledge, querry, id):
    config = {"configurable": {"thread_id": id}}
    events = graph.stream(
        {"messages": [("user", querry)]}, stream_mode="values", config=config
    )

    ai_response = None

    for event in events:
        if isinstance(event, dict) and "messages" in event:
            last_message = event["messages"][-1]
    return last_message

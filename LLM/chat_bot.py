from langgraph.prebuilt import create_react_agent
from langchain.schema.messages import BaseMessage
from typing import Annotated, List, Sequence
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# ... (previous imports and setup)

class CustomState(TypedDict):
    messages: Annotated[List[BaseMessage], add_messages]
    is_last_step: str
    knowledge: dict  # Add this line to include custom knowledge

# Define your custom knowledge
custom_knowledge = {
    "company_name": "Elevare",
    "industry": "Technology",
    "mission_statement": "To provide innovative solutions for email assistance"
}

# Create a custom prompt template
custom_prompt_template = ChatPromptTemplate.from_messages([
    ("system", "You are Elevare, a helpful bot for email assistance. You have access to the following information:"),
    ("tool", custom_knowledge),
    ("placeholder", "{messages}")
])

# Create the React agent with custom knowledge and prompt
llm = get_llm()
tools = [wiki_tool]
graph = create_react_agent(
    llm,
    tools=tools,
    state_schema=CustomState,
    state_modifier=custom_prompt_template
)

# Now you can use the graph to generate responses
def invoke(graph, message_history, knowledge=None):
    config = {"configurable": {"thread_id": uuid.uuid4().hex}}
    events = graph.stream(
        {"messages": [("user", message_history)]},
        stream_mode="values",
        config=config
    )
    
    ai_response = None
    for event in events:
        if isinstance(event, dict) and "messages" in event:
            ai_response = event["messages"][-1][1]  # Get the AI's response
            
            # If we provided custom knowledge, update it
            if knowledge:
                ai_response.update(knowledge)
            
            return ai_response
    
    raise ValueError("No valid response found")

# Example usage
message_history = [
    "Hello, I need help with my email.",
    "I'm having trouble sending emails."
]

knowledge = custom_knowledge.copy()  # Create a copy of the knowledge dictionary
knowledge["user_context"] = "This user has been experiencing issues with their email."

response = invoke(graph, message_history, knowledge)
print(response)

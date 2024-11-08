
import tiktoken

def count_tokens(text):
    enc = tiktoken.get_encoding("o200k_base")
    try:
        tokens =  len(enc.encode(text))
        return {
            "tokens": tokens
        }
    except Exception as e:
        return {"Error": e}

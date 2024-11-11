from qdrant_client import QdrantClient
from vector_db_ops import Vector_DB
from embeddings_task.get_embeddings import get_embeddings


def add_mail_embeddings(response, maps, user_name):
    unmae = str(user_name)+"_mail_embeddings"
    if response and isinstance(response, list):
        for r in response:
            mail_id = r['mail_id']
            sender = maps[mail_id]['sender']
            short_summary = r['short_summary']
            summary = r['summary']
            tone = r['tone']
            category = r['category']
            # print(mail_id, sender, short_summary, summary, tone, category)
            try:
                success, vector = get_embeddings(summary)
                pass
                # print(vector)
                try:
                    connected = False
                    user_collection = Vector_DB(collection_name=unmae)
                    print(user_collection)
                    print(user_collection.check_connection(user_name))
                    if True:
                        connected = True
                        print(user_collection)
                        dataframe = pd.DataFrame({
                            mail_id: [mail_id],
                            sender: [sender],
                            tone: [tone],
                            category: [category],
                            embeddings: [vector]
                        })
                        print(dataframe)
                        user_collection.add_documents(dataframe)
                except Exception as e:
                    logger.error(e)
                    pass
            except Exception as e:
                logger.error(e)
                pass
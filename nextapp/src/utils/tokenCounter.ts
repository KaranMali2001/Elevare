export default async function tokenCounter(text: string) {
  // const encoder = encoding_for_model("gpt-3.5-turbo");
  // const token = encoder.encode(text);
  const res = await fetch(`${process.env.LLM_URL}api/count_tokens`, {
    method: "POST",
    body: JSON.stringify({ text }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  return data.tokens;
}

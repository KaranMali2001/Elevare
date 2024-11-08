export function decodeHTMLEntities(str: string) {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  };

  return str.replace(/&[a-z]+;|&#\d+;/g, (match: string) => {
    //@ts-ignore
    return entities[match] || match;
  });
}

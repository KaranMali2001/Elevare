import { MAIL_COUNT } from "@/constants";
import { randomUUID } from "crypto";

export function createBatchs(ids: string[]) {
  const batchs = [];
  let i = 0;
  while (i < ids.length) {
    let cnt = 0;
    let temp = [];
    while (cnt < MAIL_COUNT && cnt < ids.length && i < ids.length) {
      temp.push(JSON.stringify(ids[i]));
      cnt++;

      i++;
    }
    const batchId = randomUUID();
    batchs.push({
      id: batchId,
      emailID: temp,
    });
  }
  return batchs;
}

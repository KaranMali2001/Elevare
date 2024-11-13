import "server-only";
import kmsClient from "@/lib/kms";

export default async function decrypt(cipherText: string) {
  console.log("cipher text", cipherText);
  if (cipherText.length === 0) return cipherText;
  const [result] = await kmsClient.decrypt({
    name: process.env.GOOGLE_FULL_KEY_PATH!,
    ciphertext: Buffer.from(cipherText, "base64"),
  });
  return result.plaintext!.toString();
  // return cipherText;
}

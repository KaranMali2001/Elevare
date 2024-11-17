import { s3 } from "@/lib/awsSDK";
import { ObjectCannedACL, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadFile(
  file: any,
  emailAddress: string | undefined | null,
  url: string,
) {
  if (file.type !== "application/pdf") {
    throw new Error("Please upload .pdf files");
  }
  const params = {
    Bucket: "custom-knowledge", // Replace with your Vultr bucket name
    Key: `${emailAddress}/${file.name}`, // The key (or name) of the file in the bucket
    Body: file, // The file content
    ContentType: file.type, // Set the content type
    ACL: ObjectCannedACL.public_read, // Make the file publicly accessible
  };

  try {
    console.log("file url is ", url);
    const command = new PutObjectCommand(params);
    const data = await s3.send(command);
    console.log("File uploaded successfully:", data);
    const res = await fetch("/api/uploadCustomKnowledge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        file_name: file.name,
        type: file.type,
        file_url: url,
        user_name: emailAddress,
      }),
    });
    console.log("beforeeeeeeeeeeeeeee");
    console.log("res", await res.json());
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

import { s3 } from "@/lib/awsSDK";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function deleteFile(fileKey: string) {
  const params = {
    Bucket: "custom-knowledge", // Replace with your bucket name
    Key: fileKey, // The path or name of the file to delete
  };

  try {
    const command = new DeleteObjectCommand(params);
    const data = await s3.send(command);
    console.log("File deleted successfully:", data);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}

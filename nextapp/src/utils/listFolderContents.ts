import { s3 } from "@/lib/awsSDK";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export async function listFolderContents(
  emailAddress: string | null | undefined
) {
  const params = {
    Bucket: "custom-knowledge", // Replace with your bucket name
    Prefix: `${emailAddress}/`, // Specify the folder path
  };

  try {
    const command = new ListObjectsV2Command(params);
    const data = await s3.send(command);

    // Check if the folder contains any files
    if (data.Contents) {
      console.log(
        "Files in folder:",
        data.Contents.map((item) => item.Key)
      );
      return data.Contents.map((item) => item.Key); // Return list of file keys
    } else {
      console.log("Folder is empty or does not exist.");
      return [];
    }
  } catch (error) {
    console.error("Error listing folder contents:", error);
    return [];
  }
}

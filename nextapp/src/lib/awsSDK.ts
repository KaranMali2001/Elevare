import { S3Client } from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "auto", // Vultr uses 'auto' for region by default
  endpoint: "https://blr1.vultrobjects.com", // Replace with your Vultr endpoint
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!, // Store these securely
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!, // Store these securely
  },
});

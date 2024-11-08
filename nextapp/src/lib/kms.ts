import { GoogleAuth } from "google-auth-library";
import { KeyManagementServiceClient } from "@google-cloud/kms";

const auth = new GoogleAuth({
  projectId: process.env.GOOGLE_PROJECT_ID, // Your Google Cloud Project ID
  scopes: "https://www.googleapis.com/auth/cloud-platform", // Scope for KMS
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,

    universe_domain: "googleapis.com",
  },
});
const kmsClient = new KeyManagementServiceClient({ auth });

export default kmsClient;

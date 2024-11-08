# NextApp

NextApp is a Next.js-based application designed to streamline and enhance your workflow by integrating a range of tools and services, including Prisma, Google authentication, MongoDB, and an LLM (Large Language Model) for advanced processing.

## Getting Started

Follow these instructions to set up and run the Next.js and Python servers for NextApp.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or later recommended)
- **pnpm** package manager
- **Docker** (for running the Python server)
- **MongoDB** (for database connectivity)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository_url>
cd nextapp
```

### 2. Install Dependencies

Install the necessary packages using pnpm:

```bash
npm install -g pnpm
pnpm install
```

### 3. Generate Prisma Client

Use Prisma to generate the client:

```bash
npx prisma generate
```

### 4. Set Up Environment Variables

Create a `.env` file in the project root and set up the following environment variables. These are required for database connectivity, Google OAuth, AWS, Razorpay, and other integrations.

```env
# MongoDB
DATABASE_URL=<your_mongo_db_url>

# Google OAuth
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_PRIVATE_KEY=<your_google_private_key>
GOOGLE_PRIVATE_KEY_ID=<your_google_private_key_id>
GOOGLE_PROJECT_ID=<your_google_project_id>
GOOGLE_LOCATION_ID=<your_google_location_id>
GOOGLE_KEY_RING_ID=<your_google_key_ring_id>
GOOGLE_CRYPTO_KEY_ID=<your_google_crypto_key_id>
GOOGLE_FULL_KEY_PATH=<your_google_full_key_path>

# LLM Processing Server
LLM_URL=<your_llm_server_url>

# NextAuth
AUTH_GOOGLE_ID=<your_auth_google_id>
AUTH_GOOGLE_SECRET=<your_auth_google_secret>
NEXTAUTH_URL=<your_nextauth_url>
AUTH_TRUST_HOST=<your_auth_trust_host>

# AWS S3 Object Storage
NEXT_PUBLIC_OBJECT_STORAGE_BASE_URL=<your_object_storage_base_url>
NEXT_PUBLIC_AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>

# Razorpay
RAZORPAY_KEY_ID=<your_razorpay_key_id>
RAZORPAY_KEY_SECRET=<your_razorpay_key_secret>
NEXT_PUBLIC_RAZORPAY_KEY_ID=<your_next_public_razorpay_key_id>
```

### 5. Start the Next.js Server

Start the development server with the following command:

```bash
pnpm run dev
```

The application will be available at http://localhost:3000.

## Python Server Setup

The Python server is used for LLM processing and is managed through Docker.

### 1. Configure Environment Variables for LLM Server

In the LLM server's directory, create an `.env` file and add the following environment variables:

```env
# GROQ API Key
GROQ_API_KEY=<your_groq_api_key>

# Google API Key
GOOGLE_API_KEY=<your_google_api_key>
```

These keys are required to authenticate and interact with external services used by the LLM server.

### 2. Build and Run the Python Server

To start the LLM server, navigate to the LLM directory and use Docker Compose to build and run it:

```bash
docker-compose up --build
```

The server will be ready to process LLM requests once the containers are up and running.

## Additional Notes

- Ensure that all environment variables are correctly set, as missing or incorrect values can cause issues with database connections, authentication, and other integrations.
- If you need to reset or modify the Prisma client, run `npx prisma generate` again to update the client.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

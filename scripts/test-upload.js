import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const testUpload = async () => {
    try {
        console.log("Endpoint:", process.env.VITE_MINIO_ENDPOINT);
        console.log("Bucket:", process.env.VITE_MINIO_BUCKET);

        const client = new S3Client({
            region: process.env.VITE_MINIO_REGION || "us-east-1",
            endpoint: process.env.VITE_MINIO_ENDPOINT,
            credentials: {
                accessKeyId: process.env.VITE_MINIO_ACCESS_KEY,
                secretAccessKey: process.env.VITE_MINIO_SECRET_KEY,
            },
            forcePathStyle: true,
        });

        const bucketName = process.env.VITE_MINIO_BUCKET;
        const key = "test-upload.txt";
        const content = "Hello MinIO via Cloudflare Tunnel! " + new Date().toISOString();

        console.log(`Uploading ${key} to ${bucketName}...`);

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: Buffer.from(content),
            ContentType: "text/plain",
            // ACL: "public-read", // MinIO doesn't always support ACLs if policy is set, but let's try
        });

        await client.send(command);
        console.log("✅ Upload success!");
        const url = `${process.env.VITE_MINIO_ENDPOINT}/${bucketName}/${key}`;
        console.log(`URL: ${url}`);

    } catch (error) {
        console.error("❌ Upload failed:", error);
    }
};

testUpload();

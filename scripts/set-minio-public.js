import { S3Client, PutBucketPolicyCommand } from "@aws-sdk/client-s3";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env.local manually
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const setPublicPolicy = async () => {
    const endpoint = process.env.VITE_MINIO_ENDPOINT;
    const accessKeyId = process.env.VITE_MINIO_ACCESS_KEY;
    const secretAccessKey = process.env.VITE_MINIO_SECRET_KEY;
    const bucketName = process.env.VITE_MINIO_BUCKET;
    const region = process.env.VITE_MINIO_REGION || "us-east-1";

    if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
        console.error("❌ Error: Missing configuration in .env.local");
        console.error("Required: VITE_MINIO_ENDPOINT, VITE_MINIO_ACCESS_KEY, VITE_MINIO_SECRET_KEY, VITE_MINIO_BUCKET");
        process.exit(1);
    }

    const client = new S3Client({
        region,
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        forcePathStyle: true,
    });

    const policy = {
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "PublicReadGetObject",
                Effect: "Allow",
                Principal: "*",
                Action: ["s3:GetObject"],
                Resource: [`arn:aws:s3:::${bucketName}/*`],
            },
        ],
    };

    try {
        console.log(`Setting public policy for bucket: ${bucketName}...`);
        const command = new PutBucketPolicyCommand({
            Bucket: bucketName,
            Policy: JSON.stringify(policy)
        });

        await client.send(command);
        console.log("✅ Success! Bucket is now public.");
        console.log(`Verify here: ${endpoint}/${bucketName}/your-image.jpg`);
    } catch (error) {
        console.error("❌ Error setting policy:", error);
    }
};

setPublicPolicy();

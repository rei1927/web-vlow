import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client
const startMinioClient = () => {
    const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
    const accessKeyId = import.meta.env.VITE_MINIO_ACCESS_KEY;
    const secretAccessKey = import.meta.env.VITE_MINIO_SECRET_KEY;
    const region = import.meta.env.VITE_MINIO_REGION || "us-east-1";

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        console.warn("MinIO credentials are missing. Check your .env.local file.");
        return null;
    }

    return new S3Client({
        region,
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        },
        forcePathStyle: true, // Needed for MinIO
    });
};

export const minioClient = startMinioClient();

/**
 * Uploads a file to MinIO bucket
 * @param {File} file - The file object to upload
 * @param {string} fileName - Destination file name (e.g., 'images/banner.jpg')
 * @returns {Promise<string>} - Public URL of the uploaded file
 */
export const uploadFileToMinio = async (file, fileName) => {
    if (!minioClient) {
        throw new Error("MinIO client is not initialized. Check credentials.");
    }

    const bucketName = import.meta.env.VITE_MINIO_BUCKET;

    if (!bucketName) {
        throw new Error("MinIO bucket name is not configured.");
    }

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: file.type,
        ACL: "public-read", // Ensure the object is public
    });

    try {
        await minioClient.send(command);

        // Construct public URL
        // Format: https://endpoint/bucket/filename
        const endpoint = import.meta.env.VITE_MINIO_ENDPOINT;
        // Remove trailing slash if present
        const cleanEndpoint = endpoint.replace(/\/$/, "");
        return `${cleanEndpoint}/${bucketName}/${fileName}`;
    } catch (error) {
        console.error("Error uploading to MinIO:", error);
        throw error;
    }
};

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 Client
const startMinioClient = () => {
    // Fallback values for production (bypassing build-time env var issues)
    const endpoint = import.meta.env.VITE_MINIO_ENDPOINT || "https://minio-api.dayamedialangit.co.id";
    const accessKeyId = import.meta.env.VITE_MINIO_ACCESS_KEY || "admin";
    const secretAccessKey = import.meta.env.VITE_MINIO_SECRET_KEY || "rahasia123";
    const region = import.meta.env.VITE_MINIO_REGION || "us-east-1";

    if (!endpoint || !accessKeyId || !secretAccessKey) {
        console.warn("MinIO credentials are missing.");
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

    const bucketName = import.meta.env.VITE_MINIO_BUCKET || "web-vlow";

    if (!bucketName) {
        throw new Error("MinIO bucket name is not configured.");
    }

    // Convert file to ArrayBuffer/Uint8Array to avoid readableStream errors in some browsers
    const fileBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBuffer);

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileData,
        ContentType: file.type,
        ACL: "public-read", // Ensure the object is public
    });

    try {
        await minioClient.send(command);

        // Construct public URL
        // Format: https://endpoint/bucket/filename
        const endpoint = import.meta.env.VITE_MINIO_ENDPOINT || "https://minio-api.dayamedialangit.co.id";
        // Remove trailing slash if present
        const cleanEndpoint = endpoint.replace(/\/$/, "");
        return `${cleanEndpoint}/${bucketName}/${fileName}`;
    } catch (error) {
        console.error("Error uploading to MinIO:", error);
        throw error;
    }
};

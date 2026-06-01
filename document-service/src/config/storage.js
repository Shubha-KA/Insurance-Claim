const { BlobServiceClient } = require('@azure/storage-blob');

const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = 'documents';

let containerClient;

async function getContainerClient() {
  if (!containerClient) {
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

    // Create the container if it doesn't exist
    await containerClient.createIfNotExists({
      access: 'blob', // Public read access for blobs
    });

    console.log(`✅ Connected to Azure Blob Storage — container: "${CONTAINER_NAME}"`);
  }
  return containerClient;
}

/**
 * Build the blob path: claims/{claimId}/{filename}
 */
function buildBlobPath(claimId, filename) {
  return `claims/${claimId}/${filename}`;
}

module.exports = { getContainerClient, buildBlobPath, CONTAINER_NAME };

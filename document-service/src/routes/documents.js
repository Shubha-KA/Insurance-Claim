const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { getPool, sql } = require('../config/db');
const { getContainerClient, buildBlobPath } = require('../config/storage');

const router = express.Router();

// Configure multer — store in memory for streaming to Blob Storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, PNG, and JPG are allowed.'));
    }
  },
});

// ─── POST /documents/upload ─────────────────────────────────
// Upload a document to Azure Blob Storage
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { claimId } = req.body;

    if (!claimId) {
      return res.status(400).json({ error: 'claimId is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    const documentId = uuidv4();
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const blobPath = buildBlobPath(claimId, file.originalname);

    // Upload to Azure Blob Storage
    const containerClient = await getContainerClient();
    const blockBlobClient = containerClient.getBlockBlobClient(blobPath);

    await blockBlobClient.uploadData(file.buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
    });

    const blobUrl = blockBlobClient.url;

    // Save metadata to Azure SQL
    const pool = await getPool();
    const uploadedDate = new Date().toISOString();

    await pool
      .request()
      .input('documentId', sql.UniqueIdentifier, documentId)
      .input('claimId', sql.UniqueIdentifier, claimId)
      .input('fileName', sql.NVarChar(255), file.originalname)
      .input('fileType', sql.NVarChar(10), fileExtension)
      .input('blobUrl', sql.NVarChar(500), blobUrl)
      .input('fileSize', sql.BigInt, file.size)
      .input('uploadedDate', sql.DateTime2, uploadedDate)
      .query(`
        INSERT INTO Documents (documentId, claimId, fileName, fileType, blobUrl, fileSize, uploadedDate)
        VALUES (@documentId, @claimId, @fileName, @fileType, @blobUrl, @fileSize, @uploadedDate)
      `);

    res.status(201).json({
      documentId,
      claimId,
      fileName: file.originalname,
      fileType: fileExtension,
      blobUrl,
      fileSize: file.size,
      uploadedDate,
    });
  } catch (err) {
    console.error('Error uploading document:', err);
    if (err.message && err.message.includes('Invalid file type')) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// ─── GET /documents ─────────────────────────────────────────
// List all documents (optionally filter by claimId)
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const { claimId } = req.query;

    let query = `
      SELECT d.*, c.customerName, c.policyNumber
      FROM Documents d
      LEFT JOIN Claims c ON d.claimId = c.claimId
    `;

    const request = pool.request();

    if (claimId) {
      query += ' WHERE d.claimId = @claimId';
      request.input('claimId', sql.UniqueIdentifier, claimId);
    }

    query += ' ORDER BY d.uploadedDate DESC';

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

// ─── GET /documents/:id ────────────────────────────────────
// Download / stream a document from Blob Storage
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('documentId', sql.UniqueIdentifier, req.params.id)
      .query('SELECT * FROM Documents WHERE documentId = @documentId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = result.recordset[0];
    const blobPath = buildBlobPath(doc.claimId, doc.fileName);

    const containerClient = await getContainerClient();
    const blobClient = containerClient.getBlobClient(blobPath);
    const downloadResponse = await blobClient.download(0);

    res.setHeader('Content-Type', downloadResponse.contentType || 'application/octet-stream');
    res.setHeader('Content-Disposition', `inline; filename="${doc.fileName}"`);

    downloadResponse.readableStreamBody.pipe(res);
  } catch (err) {
    console.error('Error downloading document:', err);
    res.status(500).json({ error: 'Failed to download document' });
  }
});

// ─── GET /documents/:id/metadata ───────────────────────────
// Get document metadata only
router.get('/:id/metadata', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('documentId', sql.UniqueIdentifier, req.params.id)
      .query(`
        SELECT d.*, c.customerName, c.policyNumber
        FROM Documents d
        LEFT JOIN Claims c ON d.claimId = c.claimId
        WHERE d.documentId = @documentId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching document metadata:', err);
    res.status(500).json({ error: 'Failed to fetch document metadata' });
  }
});

module.exports = router;

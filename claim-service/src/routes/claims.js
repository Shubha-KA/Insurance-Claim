const express = require('express');
const { getPool, sql } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// ─── POST /claims ───────────────────────────────────────────
// Create a new insurance claim
router.post('/', async (req, res) => {
  try {
    const { customerName, policyNumber, claimType, description } = req.body;

    // Validation
    if (!customerName || !policyNumber || !claimType) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, policyNumber, claimType',
      });
    }

    const claimId = uuidv4();
    const createdDate = new Date().toISOString();
    const pool = await getPool();

    await pool
      .request()
      .input('claimId', sql.UniqueIdentifier, claimId)
      .input('customerName', sql.NVarChar(255), customerName)
      .input('policyNumber', sql.NVarChar(50), policyNumber)
      .input('claimType', sql.NVarChar(100), claimType)
      .input('description', sql.NVarChar(sql.MAX), description || '')
      .input('createdDate', sql.DateTime2, createdDate)
      .query(`
        INSERT INTO Claims (claimId, customerName, policyNumber, claimType, description, createdDate)
        VALUES (@claimId, @customerName, @policyNumber, @claimType, @description, @createdDate)
      `);

    const claim = { claimId, customerName, policyNumber, claimType, description, createdDate };
    res.status(201).json(claim);
  } catch (err) {
    console.error('Error creating claim:', err);
    res.status(500).json({ error: 'Failed to create claim' });
  }
});

// ─── GET /claims ────────────────────────────────────────────
// List all claims
router.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .query('SELECT * FROM Claims ORDER BY createdDate DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching claims:', err);
    res.status(500).json({ error: 'Failed to fetch claims' });
  }
});

// ─── GET /claims/:id ───────────────────────────────────────
// Get a single claim by ID
router.get('/:id', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('claimId', sql.UniqueIdentifier, req.params.id)
      .query('SELECT * FROM Claims WHERE claimId = @claimId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Claim not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('Error fetching claim:', err);
    res.status(500).json({ error: 'Failed to fetch claim' });
  }
});

module.exports = router;

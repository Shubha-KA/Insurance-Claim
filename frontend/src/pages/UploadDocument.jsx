import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import FileUpload from '../components/FileUpload';
import { uploadDocument } from '../services/documentService';
import { getClaims } from '../services/claimService';

export default function UploadDocument() {
  const [claims, setClaims] = useState([]);
  const [selectedClaimId, setSelectedClaimId] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingClaims, setLoadingClaims] = useState(true);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await getClaims();
        setClaims(res.data);
      } catch (err) {
        console.error('Failed to fetch claims:', err);
      } finally {
        setLoadingClaims(false);
      }
    }
    fetchClaims();
  }, []);

  const handleUpload = async () => {
    if (!selectedClaimId) {
      setError('Please select a claim');
      return;
    }
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);

    const formData = new FormData();
    formData.append('claimId', selectedClaimId);
    formData.append('file', file);

    try {
      // Simulate progress since axios doesn't provide real progress for small files
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90));
      }, 200);

      const res = await uploadDocument(formData);

      clearInterval(progressInterval);
      setProgress(100);

      setSuccess(
        `Document uploaded successfully! Document ID: ${res.data.documentId}`
      );
      setFile(null);
      setSelectedClaimId('');
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to upload document. Please try again.'
      );
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Upload Document
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload supporting documents for an existing claim
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 700 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          {/* Claim Selector */}
          <TextField
            id="claimSelector"
            select
            label="Select Claim"
            value={selectedClaimId}
            onChange={(e) => setSelectedClaimId(e.target.value)}
            fullWidth
            disabled={loadingClaims}
            helperText={loadingClaims ? 'Loading claims...' : 'Select the claim this document belongs to'}
          >
            {claims.map((claim) => (
              <MenuItem key={claim.claimId} value={claim.claimId}>
                {claim.customerName} — {claim.policyNumber} ({claim.claimType})
              </MenuItem>
            ))}
          </TextField>

          {/* File Upload */}
          <FileUpload
            file={file}
            setFile={setFile}
            uploading={uploading}
            progress={progress}
            error=""
          />

          {/* Upload Button */}
          <Button
            id="uploadBtn"
            variant="contained"
            size="large"
            onClick={handleUpload}
            disabled={uploading || !file || !selectedClaimId}
            startIcon={
              uploading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <UploadIcon />
              )
            }
            sx={{ alignSelf: 'flex-start' }}
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

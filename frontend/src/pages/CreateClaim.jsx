import { useState } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import ClaimForm from '../components/ClaimForm';
import { createClaim } from '../services/claimService';

export default function CreateClaim() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (formData, resetForm) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await createClaim(formData);
      setSuccess(
        `Claim created successfully! Claim ID: ${res.data.claimId}`
      );
      resetForm();
    } catch (err) {
      setError(
        err.response?.data?.error || 'Failed to create claim. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Create New Claim
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details below to submit a new insurance claim
        </Typography>
      </Box>

      <Card sx={{ maxWidth: 700 }}>
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <ClaimForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error}
            success={success}
          />
        </CardContent>
      </Card>
    </Box>
  );
}

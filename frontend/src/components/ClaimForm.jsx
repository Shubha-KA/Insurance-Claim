import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';

const claimTypes = [
  'Auto',
  'Health',
  'Property',
  'Life',
  'Travel',
  'Liability',
];

export default function ClaimForm({ onSubmit, loading, error, success }) {
  const [form, setForm] = useState({
    customerName: '',
    policyNumber: '',
    claimType: '',
    description: '',
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form, () =>
      setForm({ customerName: '', policyNumber: '', claimType: '', description: '' })
    );
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <TextField
        id="customerName"
        name="customerName"
        label="Customer Name"
        value={form.customerName}
        onChange={handleChange}
        required
        fullWidth
      />

      <TextField
        id="policyNumber"
        name="policyNumber"
        label="Policy Number"
        value={form.policyNumber}
        onChange={handleChange}
        required
        fullWidth
        placeholder="e.g. POL-2024-00123"
      />

      <TextField
        id="claimType"
        name="claimType"
        label="Claim Type"
        value={form.claimType}
        onChange={handleChange}
        required
        select
        fullWidth
      >
        {claimTypes.map((type) => (
          <MenuItem key={type} value={type}>
            {type}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        id="description"
        name="description"
        label="Description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        placeholder="Describe the incident..."
      />

      <Button
        id="submitClaimBtn"
        type="submit"
        variant="contained"
        size="large"
        disabled={loading}
        startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
        sx={{ alignSelf: 'flex-start', mt: 1 }}
      >
        {loading ? 'Submitting...' : 'Submit Claim'}
      </Button>
    </Box>
  );
}

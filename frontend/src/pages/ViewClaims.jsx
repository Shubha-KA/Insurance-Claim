import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { getClaims, getClaimById } from '../services/claimService';

const claimTypeColors = {
  Auto: '#6366f1',
  Health: '#10b981',
  Property: '#f59e0b',
  Life: '#ec4899',
  Travel: '#06b6d4',
  Liability: '#f43f5e',
};

export default function ViewClaims() {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchClaims() {
      try {
        const res = await getClaims();
        setClaims(res.data);
      } catch (err) {
        setError('Failed to fetch claims. Make sure the Claim Service is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchClaims();
  }, []);

  const handleViewClaim = async (id) => {
    try {
      const res = await getClaimById(id);
      setSelectedClaim(res.data);
      setDialogOpen(true);
    } catch (err) {
      setError('Failed to load claim details.');
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          View Claims
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and view all submitted insurance claims
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Policy Number</TableCell>
                  <TableCell>Claim Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(6)].map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : claims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No claims found. Create your first claim!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  claims.map((claim) => (
                    <TableRow key={claim.claimId} hover>
                      <TableCell>
                        <Typography variant="subtitle2">{claim.customerName}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {claim.policyNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={claim.claimType}
                          size="small"
                          sx={{
                            bgcolor: `${claimTypeColors[claim.claimType] || '#6366f1'}22`,
                            color: claimTypeColors[claim.claimType] || '#6366f1',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {claim.description || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {new Date(claim.createdDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          id={`viewClaim-${claim.claimId}`}
                          size="small"
                          onClick={() => handleViewClaim(claim.claimId)}
                          sx={{ color: 'primary.light' }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Claim Detail Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Claim Details</Typography>
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <Grid container spacing={2.5} sx={{ pt: 1 }}>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  Claim ID
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>
                  {selectedClaim.claimId}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Customer Name
                </Typography>
                <Typography variant="body1">{selectedClaim.customerName}</Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Policy Number
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {selectedClaim.policyNumber}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Claim Type
                </Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip
                    label={selectedClaim.claimType}
                    size="small"
                    sx={{
                      bgcolor: `${claimTypeColors[selectedClaim.claimType] || '#6366f1'}22`,
                      color: claimTypeColors[selectedClaim.claimType] || '#6366f1',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {new Date(selectedClaim.createdDate).toLocaleString()}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body1">
                  {selectedClaim.description || 'No description provided'}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}

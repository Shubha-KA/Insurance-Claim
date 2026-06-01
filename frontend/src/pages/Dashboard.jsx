import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Skeleton,
} from '@mui/material';
import {
  NoteAdd as NoteAddIcon,
  CloudUpload as CloudUploadIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { getClaims } from '../services/claimService';
import { getDocuments } from '../services/documentService';

const claimTypeColors = {
  Auto: '#6366f1',
  Health: '#10b981',
  Property: '#f59e0b',
  Life: '#ec4899',
  Travel: '#06b6d4',
  Liability: '#f43f5e',
};

export default function Dashboard() {
  const [claims, setClaims] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [claimRes, docRes] = await Promise.all([getClaims(), getDocuments()]);
        setClaims(claimRes.data);
        setDocuments(docRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const stats = [
    {
      label: 'Total Claims',
      value: claims.length,
      icon: <AssignmentIcon sx={{ fontSize: 32 }} />,
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
    },
    {
      label: 'Documents Uploaded',
      value: documents.length,
      icon: <DescriptionIcon sx={{ fontSize: 32 }} />,
      color: '#14b8a6',
      gradient: 'linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)',
    },
    {
      label: 'Claim Types',
      value: [...new Set(claims.map((c) => c.claimType))].length,
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Overview of your insurance claims and documents
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat) => (
          <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
            <Card
              sx={{
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {stat.label}
                    </Typography>
                    {loading ? (
                      <Skeleton width={60} height={40} />
                    ) : (
                      <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        {stat.value}
                      </Typography>
                    )}
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: stat.gradient,
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
              {/* Decorative accent */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: stat.gradient,
                }}
              />
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              cursor: 'pointer',
              '&:hover': { borderColor: 'primary.main' },
            }}
            onClick={() => navigate('/claims/new')}
          >
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  color: 'primary.main',
                }}
              >
                <NoteAddIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Create New Claim</Typography>
                <Typography variant="body2" color="text.secondary">
                  File a new insurance claim
                </Typography>
              </Box>
              <ArrowForwardIcon sx={{ color: 'text.secondary' }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card
            sx={{
              cursor: 'pointer',
              '&:hover': { borderColor: 'secondary.main' },
            }}
            onClick={() => navigate('/documents/upload')}
          >
            <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(20, 184, 166, 0.1)',
                  color: 'secondary.main',
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6">Upload Document</Typography>
                <Typography variant="body2" color="text.secondary">
                  Attach supporting documents
                </Typography>
              </Box>
              <ArrowForwardIcon sx={{ color: 'text.secondary' }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Claims Table */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Recent Claims</Typography>
            <Button
              size="small"
              onClick={() => navigate('/claims')}
              endIcon={<ArrowForwardIcon />}
              sx={{ color: 'primary.light' }}
            >
              View All
            </Button>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ bgcolor: 'transparent' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Policy #</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : claims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">No claims yet. Create your first claim!</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  claims.slice(0, 5).map((claim) => (
                    <TableRow
                      key={claim.claimId}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate('/claims')}
                    >
                      <TableCell>{claim.customerName}</TableCell>
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
                        {new Date(claim.createdDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

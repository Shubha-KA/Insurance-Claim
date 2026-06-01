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
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Download as DownloadIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { getDocuments, getDocumentDownloadUrl } from '../services/documentService';

function getFileTypeIcon(fileType) {
  switch (fileType) {
    case 'pdf':
      return <PdfIcon sx={{ color: '#f43f5e' }} />;
    case 'png':
    case 'jpg':
    case 'jpeg':
      return <ImageIcon sx={{ color: '#14b8a6' }} />;
    default:
      return <FileIcon sx={{ color: '#94a3b8' }} />;
  }
}

function getFileTypeColor(fileType) {
  switch (fileType) {
    case 'pdf':
      return { bg: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e' };
    case 'png':
      return { bg: 'rgba(20, 184, 166, 0.1)', color: '#14b8a6' };
    case 'jpg':
    case 'jpeg':
      return { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' };
    default:
      return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8' };
  }
}

function formatSize(bytes) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ViewDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDocuments() {
      try {
        const res = await getDocuments();
        setDocuments(res.data);
      } catch (err) {
        setError('Failed to fetch documents. Make sure the Document Service is running.');
      } finally {
        setLoading(false);
      }
    }
    fetchDocuments();
  }, []);

  const handleDownload = (id, fileName) => {
    const url = getDocumentDownloadUrl(id);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          View Documents
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and download all uploaded supporting documents
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
                  <TableCell>File</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Policy #</TableCell>
                  <TableCell>Uploaded Date</TableCell>
                  <TableCell align="center">Download</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(7)].map((__, j) => (
                        <TableCell key={j}>
                          <Skeleton />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography color="text.secondary">
                        No documents found. Upload your first document!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((doc) => {
                    const typeStyle = getFileTypeColor(doc.fileType);
                    return (
                      <TableRow key={doc.documentId} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            {getFileTypeIcon(doc.fileType)}
                            <Typography variant="subtitle2" noWrap sx={{ maxWidth: 200 }}>
                              {doc.fileName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={doc.fileType.toUpperCase()}
                            size="small"
                            sx={{
                              bgcolor: typeStyle.bg,
                              color: typeStyle.color,
                              fontWeight: 600,
                              fontSize: '0.7rem',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {formatSize(doc.fileSize)}
                          </Typography>
                        </TableCell>
                        <TableCell>{doc.customerName || '—'}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {doc.policyNumber || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {new Date(doc.uploadedDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Download file">
                            <IconButton
                              id={`downloadDoc-${doc.documentId}`}
                              size="small"
                              onClick={() => handleDownload(doc.documentId, doc.fileName)}
                              sx={{ color: 'secondary.main' }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

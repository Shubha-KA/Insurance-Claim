import { useCallback, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Chip,
  LinearProgress,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';

const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg'];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function getFileIcon(type) {
  if (type === 'application/pdf') return <PdfIcon sx={{ fontSize: 40, color: '#f43f5e' }} />;
  if (type.startsWith('image/')) return <ImageIcon sx={{ fontSize: 40, color: '#14b8a6' }} />;
  return <FileIcon sx={{ fontSize: 40, color: '#94a3b8' }} />;
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileUpload({ file, setFile, uploading, progress, error }) {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState('');

  const validateFile = (f) => {
    if (!ALLOWED_TYPES.includes(f.type)) {
      setValidationError('Invalid file type. Only PDF, PNG, and JPG are allowed.');
      return false;
    }
    if (f.size > MAX_SIZE) {
      setValidationError('File size exceeds 10 MB limit.');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, [setFile]);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected && validateFile(selected)) {
      setFile(selected);
    }
  };

  return (
    <Box>
      {(error || validationError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || validationError}
        </Alert>
      )}

      {!file ? (
        <Box
          id="fileDropZone"
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('fileInput').click()}
          sx={{
            border: '2px dashed',
            borderColor: dragOver ? 'primary.main' : 'divider',
            borderRadius: 3,
            p: 6,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: dragOver ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: 'primary.light',
              bgcolor: 'rgba(99, 102, 241, 0.03)',
            },
          }}
        >
          <CloudUploadIcon
            sx={{
              fontSize: 56,
              color: dragOver ? 'primary.main' : 'text.secondary',
              mb: 2,
              transition: 'color 0.2s',
            }}
          />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Drag & drop a file here
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            or click to browse
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            <Chip label="PDF" size="small" variant="outlined" />
            <Chip label="PNG" size="small" variant="outlined" />
            <Chip label="JPG" size="small" variant="outlined" />
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Max file size: 10 MB
          </Typography>
          <input
            id="fileInput"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {getFileIcon(file.type)}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap>
              {file.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatSize(file.size)}
            </Typography>
            {uploading && (
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ mt: 1, borderRadius: 1 }}
              />
            )}
          </Box>
          {!uploading && (
            <IconButton
              id="removeFileBtn"
              onClick={() => setFile(null)}
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
}

import axios from 'axios';

const API_URL = import.meta.env.VITE_DOCUMENT_SERVICE_URL || 'http://localhost:3002';

const documentApi = axios.create({
  baseURL: API_URL,
});

export const uploadDocument = (formData) =>
  documentApi.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getDocuments = (claimId) => {
  const params = claimId ? { claimId } : {};
  return documentApi.get('/documents', { params });
};

export const getDocumentMetadata = (id) =>
  documentApi.get(`/documents/${id}/metadata`);

export const getDocumentDownloadUrl = (id) =>
  `${API_URL}/documents/${id}`;

export default documentApi;

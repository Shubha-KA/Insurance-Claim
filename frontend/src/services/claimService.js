import axios from 'axios';

const API_URL = import.meta.env.VITE_CLAIM_SERVICE_URL || 'http://localhost:3001';

const claimApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createClaim = (claimData) => claimApi.post('/claims', claimData);

export const getClaims = () => claimApi.get('/claims');

export const getClaimById = (id) => claimApi.get(`/claims/${id}`);

export default claimApi;

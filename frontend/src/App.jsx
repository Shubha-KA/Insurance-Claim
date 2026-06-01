//app.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreateClaim from './pages/CreateClaim';
import ViewClaims from './pages/ViewClaims';
import UploadDocument from './pages/UploadDocument';
import ViewDocuments from './pages/ViewDocuments';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="claims/new" element={<CreateClaim />} />
            <Route path="claims" element={<ViewClaims />} />
            <Route path="documents/upload" element={<UploadDocument />} />
            <Route path="documents" element={<ViewDocuments />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

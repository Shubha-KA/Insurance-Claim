# Insurance Claims Application

A microservices-based insurance claims management application with Azure Blob Storage and Azure SQL integration.

## Architecture

```
Frontend (React + MUI)
  │
  ├── Claim Service    (Node.js/Express → Azure SQL)
  │
  └── Document Service (Node.js/Express → Azure SQL + Azure Blob Storage)
```

## Prerequisites

- Node.js 20+
- Azure SQL Database
- Azure Storage Account
- Docker & Docker Compose (optional)

## Project Structure

```
Insurance-Claim/
├── frontend/            # React + Material UI (Vite)
├── claim-service/       # Microservice 1 — Claims CRUD
├── document-service/    # Microservice 2 — Document upload/download
├── database/            # SQL schema
├── docker-compose.yml   # Container orchestration
└── README.md
```

## Setup

### 1. Database

Run the SQL schema against your Azure SQL Database:

```sql
-- Connect to your Azure SQL Database and run:
-- database/schema.sql
```

### 2. Environment Variables

#### Claim Service (`claim-service/.env`)

```env
DB_SERVER=your-server.database.windows.net
DB_NAME=InsuranceClaimsDB
DB_USER=your-username
DB_PASSWORD=your-password
PORT=3001
```

#### Document Service (`document-service/.env`)

```env
DB_SERVER=your-server.database.windows.net
DB_NAME=InsuranceClaimsDB
DB_USER=your-username
DB_PASSWORD=your-password
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net
PORT=3002
```

#### Frontend (`frontend/.env`)

```env
VITE_CLAIM_SERVICE_URL=http://localhost:3001
VITE_DOCUMENT_SERVICE_URL=http://localhost:3002
```

### 3. Run Locally

```bash
# Install and start Claim Service
cd claim-service
npm install
npm run dev

# Install and start Document Service (new terminal)
cd document-service
npm install
npm run dev

# Install and start Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 4. Run with Docker

```bash
# Create a .env file in the root directory with all required variables
# then run:
docker-compose up --build
```

The app will be available at `http://localhost`.

## API Endpoints

### Claim Service (port 3001)

| Method | Endpoint      | Description         |
|--------|--------------|---------------------|
| POST   | /claims      | Create a new claim  |
| GET    | /claims      | List all claims     |
| GET    | /claims/:id  | Get claim by ID     |
| GET    | /health      | Health check        |

### Document Service (port 3002)

| Method | Endpoint                  | Description              |
|--------|--------------------------|--------------------------|
| POST   | /documents/upload        | Upload a document        |
| GET    | /documents               | List all documents       |
| GET    | /documents/:id           | Download a document      |
| GET    | /documents/:id/metadata  | Get document metadata    |
| GET    | /health                  | Health check             |

## Azure Blob Storage Structure

```
Container: documents
└── claims/
    └── {claimId}/
        └── {filename}
```

## Supported File Types

- PDF (`.pdf`)
- PNG (`.png`)
- JPEG (`.jpg`, `.jpeg`)

Max file size: 10 MB

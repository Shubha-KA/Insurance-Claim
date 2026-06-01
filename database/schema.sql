-- ============================================
-- Insurance Claims Application
-- Azure SQL Database Schema
-- ============================================

-- Create Claims table
CREATE TABLE Claims (
    claimId         UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    customerName    NVARCHAR(255)       NOT NULL,
    policyNumber    NVARCHAR(50)        NOT NULL,
    claimType       NVARCHAR(100)       NOT NULL,
    description     NVARCHAR(MAX)       NULL,
    createdDate     DATETIME2           NOT NULL DEFAULT GETUTCDATE()
);

-- Create Documents table
CREATE TABLE Documents (
    documentId      UNIQUEIDENTIFIER    PRIMARY KEY DEFAULT NEWID(),
    claimId         UNIQUEIDENTIFIER    NOT NULL,
    fileName        NVARCHAR(255)       NOT NULL,
    fileType        NVARCHAR(10)        NOT NULL,
    blobUrl         NVARCHAR(500)       NOT NULL,
    fileSize        BIGINT              NULL,
    uploadedDate    DATETIME2           NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Documents_Claims FOREIGN KEY (claimId) REFERENCES Claims(claimId)
);

-- Indexes
CREATE INDEX IX_Claims_CreatedDate ON Claims(createdDate DESC);
CREATE INDEX IX_Documents_ClaimId ON Documents(claimId);
CREATE INDEX IX_Documents_UploadedDate ON Documents(uploadedDate DESC);

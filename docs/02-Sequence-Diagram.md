# Document Upload & Replication Sequence

This sequence diagram illustrates how a user uploads a document, how it's stored in the primary region, and the event-driven replication to the secondary region.

## Mermaid Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    
    actor User
    participant AppGW as Application Gateway
    participant DocService as Document Service
    participant PrimaryBlob as Primary Blob Storage (East US)
    participant EventGrid as Event Grid Topic
    participant Function as Azure Function
    participant SecondaryBlob as Secondary Blob Storage (Central US)
    
    User->>AppGW: POST /api/documents (File Upload)
    AppGW->>DocService: Forward Request
    
    DocService->>PrimaryBlob: Upload Blob Stream
    PrimaryBlob-->>DocService: Success (201 Created)
    DocService-->>AppGW: Success Response
    AppGW-->>User: File Uploaded Successfully
    
    Note over PrimaryBlob, SecondaryBlob: Asynchronous Geo-Replication Flow
    
    PrimaryBlob-->>EventGrid: Fire `Microsoft.Storage.BlobCreated` Event
    EventGrid->>Function: Push Event Payload
    
    activate Function
    Function->>PrimaryBlob: Read Source Blob Data
    PrimaryBlob-->>Function: Blob Data Stream
    Function->>SecondaryBlob: Copy Blob Data (Preserve Metadata)
    SecondaryBlob-->>Function: Copy Complete
    deactivate Function
    
    Note over User, SecondaryBlob: Document is now safely redundant across two regions!
```

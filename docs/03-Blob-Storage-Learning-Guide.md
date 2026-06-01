# Azure Blob Storage Learning Guide

This guide introduces core Azure Blob Storage concepts using our Insurance Claims Application as a practical example.

## Core Hierarchy

- **Storage Account**: The top-level namespace in Azure. In our app, we have `insuranceprimarysa` for East US and `insurancebackupsa` for Central US. Every piece of data stored is accessible via this account's unique DNS name.
- **Container**: Similar to a directory or folder. We use a container named `documents` to store all uploaded insurance files. You can set access policies at the container level (e.g., private vs. public).
- **Blob**: The actual file object. When a user uploads a driver's license (e.g., `license.pdf`), it becomes a blob inside the `documents` container.

## Storage Tiers

- **Hot Tier**: Optimized for data that is accessed frequently. We use this for active insurance claims where adjusters are actively reviewing documents.
- **Cool Tier**: Lower storage cost but higher access cost. Ideal for documents of closed claims that only need occasional auditing.
- **Archive Tier**: Lowest storage cost, but data takes hours to retrieve. Suitable for compliance retention (e.g., keeping records for 7 years).

## Redundancy Options

- **LRS (Locally Redundant Storage)**: 3 synchronous copies within a single data center. Protects against server rack failures. We use this for our individual storage accounts in this demo.
- **ZRS (Zone-Redundant Storage)**: 3 synchronous copies across different availability zones in the same region. Protects against a data center going down.
- **GRS (Geo-Redundant Storage)**: LRS in the primary region, asynchronously copied to a secondary region hundreds of miles away (e.g., East US to West US).
- **RA-GRS (Read-Access Geo-Redundant Storage)**: Like GRS, but you can read from the secondary region even if the primary region hasn't failed.

*Note: In our architecture, we manually implement a custom GRS-like pattern using Event Grid and Azure Functions. This gives us full programmatic control over the replication process.*

## Event-Driven Architecture

- **Event Grid**: A highly scalable event routing service. When a document is uploaded to our Primary Blob, Event Grid automatically catches the `BlobCreated` event.
- **Azure Functions**: Serverless compute. Event Grid triggers our Function, passing the blob details. The Function wakes up, copies the blob to the Secondary Blob Storage, and goes back to sleep, charging us only for the milliseconds it ran.

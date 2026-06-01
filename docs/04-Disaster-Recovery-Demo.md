# Disaster Recovery Demonstration

This document outlines how to demonstrate the disaster recovery capabilities of the Insurance Claims Application, specifically focusing on our custom Azure Blob Storage geo-redundancy.

## Scenario: East US Region Outage

**The Problem**: The primary data center in East US goes completely offline. The `insuranceprimarysa` storage account is unreachable.

**The Goal**: Prove that all uploaded claim documents are safe and accessible in the secondary region (Central US).

## Verification Workflow

### Step 1: Pre-Disaster Verification
1. Open the **Frontend Application** and upload a new document (e.g., `car-damage.jpg`) to a claim.
2. Log into the **Azure Portal** and navigate to the Primary Storage Account (`insuranceprimarysa`).
3. Open the `documents` container and verify `car-damage.jpg` exists.
4. Navigate to the Secondary Storage Account (`insurancebackupsa`).
5. Open the `documents` container and verify `car-damage.jpg` was successfully copied by the Azure Function.

### Step 2: Simulating the Disaster
Since we cannot actually take down an Azure region, we simulate the failure by:
1. Going to the Primary Storage Account in the Azure Portal.
2. Navigating to **Networking**.
3. Changing public network access to **Disabled** (or changing the storage account access keys).
4. Restarting the Document Service.
*Result: The application can no longer read/write to the primary storage.*

### Step 3: Executing the Recovery Workflow
1. **Update Configuration**: In the Azure Portal, go to the Document Service App Service.
2. Open **Environment Variables** / **Configuration**.
3. Change the `STORAGE_ACCOUNT` variable from `insuranceprimarysa` to `insurancebackupsa`.
4. Save and Restart the App Service.

### Step 4: Post-Disaster Verification
1. Return to the **Frontend Application**.
2. Navigate to **View Documents**.
3. Click "Download" on `car-damage.jpg`.
*Result: The file downloads successfully! The application is now serving files directly from the Central US backup.*

## Key Takeaways
- **Zero Data Loss (RPO)**: Because Event Grid triggers almost instantly, the Recovery Point Objective is near-zero.
- **Fast Recovery Time (RTO)**: Recovery only requires an environment variable update, allowing operations to resume in minutes.

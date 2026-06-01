# Comprehensive Validation, Testing, Verification, and Demonstration Guide

This guide provides a detailed, step-by-step process for proving that every component of the Insurance Claims Application is functioning correctly in Azure.

---

## PART 1: PRE-DEMO CHECKLIST

Before starting a demo, verify all core components are healthy.

### Azure Portal Verification
- **Resource Group**: Navigate to `Resource groups` -> `rg-insurance-demo`. Ensure it exists.
- **App Services**: Navigate to `App Services`. Check `Status: Running` for Frontend, Claim, and Document apps.
- **Application Gateway**: Navigate to `Application Gateways`. Check `Status: Running`. 
- **WAF**: Under Application Gateway -> `Web application firewall`, verify `Status: Enabled`, `Mode: Prevention`.
- **SQL Connected**: Navigate to `SQL databases`. Ensure status is `Online`.
- **Blob Storage**: Navigate to `Storage accounts`. Verify `insuranceprimarysa` and `insurancebackupsa` are online.
- **Event Grid**: Navigate to `Event Grid System Topics`. Verify topic exists and is active.
- **Function App**: Navigate to `Function App`. Verify `Status: Running`.

### Azure CLI Verification Commands
```bash
# Verify Resource Group
az group show --name rg-insurance-demo --query properties.provisioningState

# Verify App Services
az webapp list --resource-group rg-insurance-demo --query "[].{Name:name, State:state}"

# Verify Storage Accounts
az storage account list --resource-group rg-insurance-demo --query "[].{Name:name, Location:primaryLocation}"

# Verify SQL Database
az sql db show --resource-group rg-insurance-demo --server <sql_server_name> --name <sql_database_name> --query status
```

---

## PART 2: CLAIM SERVICE VALIDATION

### 1. Create Claim (API Call)
Use Postman or `curl` to create a claim.
```bash
curl -X POST "https://<app-gateway-ip>/api/claims" \
     -H "Content-Type: application/json" \
     -d '{"customerName": "Jane Smith", "policyNumber": "POL-999", "claimType": "Property", "description": "Roof damage"}'
```
**Expected Response (201 Created):**
```json
{
  "message": "Claim created successfully",
  "claimId": "abc123xx-yyyy..."
}
```

### 2. Verify Database Entry
**Azure Portal**:
1. Go to `SQL databases` -> select your database.
2. Click **Query editor (preview)**.
3. Login with SQL Admin credentials.

**SQL Query**:
```sql
SELECT * FROM Claims WHERE customerName = 'Jane Smith';
```
*(Screenshot opportunity: Show the record populated with a UUID `claimId`)*

---

## PART 3: DOCUMENT UPLOAD VALIDATION

### 1. Upload File
Use Postman or `curl`.
```bash
curl -X POST "https://<app-gateway-ip>/api/documents/upload" \
  -F "claimId=<claimId>" \
  -F "document=@/path/to/roof-damage.jpg"
```
**Expected Response (201 Created):**
```json
{
  "message": "File uploaded successfully",
  "url": "https://insuranceprimarysa.blob.core.windows.net/documents/roof-damage.jpg"
}
```

### 2. Verify Blob Exists
**Azure Portal**: Navigate to `insuranceprimarysa` -> `Storage browser` -> `Blob containers` -> `documents`. Verify `roof-damage.jpg` exists.
**Azure Storage Explorer**: Open the tool, connect to your subscription, expand `insuranceprimarysa`, open `documents` container. Observe the file size and Content-Type (`image/jpeg`).

**Azure CLI**:
```bash
az storage blob show --container-name documents --name roof-damage.jpg --account-name insuranceprimarysa --auth-mode login --query "{Name:name, Size:properties.contentLength, Type:properties.contentType}"
```

---

## PART 4: EVENT GRID VALIDATION

Immediately after upload, verify Event Grid fired.

### 1. Portal Steps
1. Navigate to `Event Grid System Topics` -> `egst-insurance-blob`.
2. Open the **Metrics** tab.

### 2. Metrics to Check
- **Published Events**: Should increment by 1.
- **Matched Events**: Should increment by 1 (it matched the `BlobCreated` filter).
- **Delivered Events**: Should increment by 1.

**Expected Values**: You should see a spike of "1" across these three metrics correlating with your upload time.

---

## PART 5: AZURE FUNCTION VALIDATION

Verify the Function received the event and copied the blob.

### 1. Portal Steps
1. Navigate to the Function App (`func-insurance-repl-demo`).
2. Go to **Log stream** or **Invocations**.

### 2. Application Insights Query
If App Insights is connected, go to **Logs** and run:
```kusto
requests
| where name == "BlobReplicationFunction"
| project timestamp, success, duration
```
**Expected Logs**: "Executed 'BlobReplicationFunction' (Succeeded)".

### 3. Azure CLI
```bash
az functionapp log tail --name func-insurance-repl-demo --resource-group rg-insurance-demo
```
**Expected Output**: Messages indicating "Copying blob roof-damage.jpg to secondary storage... Done."

---

## PART 6: GEO-REDUNDANCY VALIDATION

Prove the file exists in both regions.

### 1. Upload Test
Upload `test.pdf` via the Frontend UI.

### 2. Verify Primary (East US)
**CLI**:
```bash
az storage blob exists --account-name insuranceprimarysa --container-name documents --name claims/123/test.pdf --auth-mode login
```
*(Expected: `{"exists": true}`)*

### 3. Verify Secondary (Central US)
**CLI**:
```bash
az storage blob exists --account-name insurancebackupsa --container-name documents --name claims/123/test.pdf --auth-mode login
```
*(Expected: `{"exists": true}`)*

*(Screenshot opportunity: Show both Storage Account containers side-by-side in Storage Explorer confirming identical folder structures and metadata).*

---

## PART 7: DISASTER RECOVERY DEMO

**Scenario**: East US Storage becomes unreachable.

### 1. Detect Outage & Simulate Failure
- Go to `insuranceprimarysa` -> `Networking`.
- Change **Public network access** to `Disabled`.
- The frontend will now fail to load or upload documents (Simulated Outage).

### 2. Manual Failover Process
- Navigate to the **Document Service App Service**.
- Go to `Environment variables` / `Configuration`.
- Edit the `STORAGE_ACCOUNT` key. Change value from `insuranceprimarysa` to `insurancebackupsa`.
- Click **Apply** and **Restart** the App Service.

### 3. Recovery Verification
- Return to the Frontend Application.
- Go to **View Documents**. Click download on a previously uploaded file.
- **Expected Application Behavior**: The file downloads successfully. The App Service is now seamlessly reading from Central US.

---

## PART 8: APPLICATION GATEWAY VALIDATION

Verify traffic flows properly through the App Gateway.

### 1. Backend Health
- Portal: `Application Gateways` -> Select yours -> `Backend health`.
- **Expected Output**: Status should be **Healthy** for the App Service backend pools.

### 2. Routing & Listeners
- Portal: Check `Listeners` (port 80/443). Check `Rules` ensuring traffic is routed to the correct backend pool.

**CLI Command**:
```bash
az network application-gateway show-backend-health --resource-group rg-insurance-demo --name appgateway-insurance
```

---

## PART 9: WAF VALIDATION

Prove the WAF protects against common attacks.

### 1. SQL Injection Test
```bash
curl -I "https://<app-gateway-ip>/?search=' OR 1=1 --"
```
**Expected Result**: `403 Forbidden`. The WAF intercepts the malicious payload.

### 2. Cross Site Scripting (XSS) Test
```bash
curl -I "https://<app-gateway-ip>/?q=<script>alert('xss')</script>"
```
**Expected Result**: `403 Forbidden`.

### 3. Path Traversal Test
```bash
curl -I "https://<app-gateway-ip>/../../etc/passwd"
```
**Expected Result**: `403 Forbidden`.

### Log Verification
1. Navigate to the Log Analytics Workspace attached to the App Gateway.
2. Run Query:
```kusto
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.NETWORK" and Category == "ApplicationGatewayFirewallLog"
| project TimeGenerated, clientIp_s, ruleId_s, Message
```
**Expected Log Entry**: You will see rules triggered (e.g., `ruleId 942100` for SQLi) and `action_s: Blocked`.

---

## PART 10: APP SERVICE VALIDATION

### Verification Steps
- **Portal**: Navigate to App Services -> `Deployment Center`. Verify the deployment from GitHub Actions/Zip deploy says `Success`.
- **Health Checks**: Navigate to App Service -> `Health checks`. Add path `/api/health`. Wait for status to show `Healthy`.
- **Metrics**: Check the `Overview` page for HTTP 2xx and 5xx graphs.

**CLI Application Logs**:
```bash
az webapp log tail --name <frontend-app-name> --resource-group rg-insurance-demo
```

---

## PART 11: END-TO-END DEMO SCRIPT (10 MINS)

1. **Show Architecture (1m)**: Open the Draw.io diagram. Explain the flow from User -> WAF -> App Services -> Primary Storage -> Event Grid -> Function -> Secondary Storage.
2. **Create Claim (1m)**: Open the Frontend UI, fill out a new claim.
3. **Verify Database Entry (1m)**: Jump to Azure SQL Query Editor, run `SELECT * FROM Claims` to prove the UI writes to DB.
4. **Upload File (1m)**: Go back to UI, upload an image for the claim.
5. **Verify Blob Storage (1m)**: Open Storage Browser for Primary account, show the file exists.
6. **Show Event Grid Trigger (1m)**: Open Event Grid metrics, show the spike in "Delivered Events".
7. **Show Function Execution (1m)**: Open Function App Invocations/Logs, show the success message.
8. **Verify Secondary Blob Copy (1m)**: Open Storage Browser for Secondary account, prove the file is exactly the same.
9. **Demonstrate WAF Protection (1m)**: Run the SQL Injection `curl` command in the terminal. Show the `403 Forbidden`. Show the Log Analytics query proving WAF blocked it.
10. **Conclude (1m)**: Summarize how the components securely and redundantly handled the business process.

---

## PART 12: SUCCESS CRITERIA TABLE

| Azure Component | How To Verify | Proof |
|----------------|---------------|-------|
| **Application Gateway** | Check Backend Health | Portal: `Backend health` shows **Healthy** |
| **WAF** | Run `curl` with SQL injection | CLI: Returns `403 Forbidden`, Log Analytics shows `Blocked` |
| **Frontend App Service**| Load UI in browser | Browser: Renders React application successfully |
| **Claim Service** | Send POST request | Postman: Returns `201 Created` and claim ID |
| **Document Service** | Send POST file upload request | Postman: Returns `201 Created` and blob URL |
| **Azure SQL** | Run `SELECT` query | Portal: Query Editor returns expected claim rows |
| **Primary Blob Storage**| Check Storage Browser | Portal/Explorer: File exists in `documents` container |
| **Event Grid** | Check Metrics tab | Portal: `Delivered Events` metric increments by 1 |
| **Azure Function** | Check Invocations/Log Stream | Portal: Log shows Succeeded and "Copying blob..." |
| **Secondary Blob Storage**| Check Storage Browser | Portal/Explorer: Exact copy of file exists in Central US |
| **Application Insights**| Run Kusto Query | Portal: `requests` table shows Function/App execution times |
| **Log Analytics** | Query WAF Logs | Portal: `AzureDiagnostics` shows WAF firewall blocks |

---
*End of Guide*

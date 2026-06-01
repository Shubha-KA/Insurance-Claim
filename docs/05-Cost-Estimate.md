# Azure Monthly Cost Estimate

This is a generalized monthly cost estimate for the Insurance Claims Application architecture, assuming moderate usage in a production environment (East US region). 

*Note: Azure pricing fluctuates. These numbers are illustrative.*

| Service | Tier / SKU | Monthly Estimated Cost | Notes |
|---------|------------|------------------------|-------|
| **App Service Plan** | Premium v2 (P1v2) | ~$164.00 | Hosts Frontend, Claim Service, Document Service, and Function App. Highly capable for production workloads. |
| **Azure SQL Database** | Standard (S0) - 10 DTUs | ~$15.00 | Sufficient for lightweight CRUD operations and metadata storage. |
| **Application Gateway** | WAF v2 | ~$225.00 | Base cost + capacity units. Includes Web Application Firewall for security. |
| **Primary Blob Storage**| Standard LRS (100 GB) | ~$2.00 | Includes storage space and transaction costs. |
| **Secondary Blob Storage**| Standard LRS (100 GB) | ~$2.00 | Backup storage in Central US. |
| **Event Grid** | Basic | ~$0.00 | First 100,000 operations are free. |
| **Azure Functions** | App Service Plan (Shared) | ~$0.00 | Cost absorbed by the existing P1v2 App Service Plan. |
| **Log Analytics & App Insights** | Pay-as-you-go (5 GB) | ~$15.00 | Monitoring, alerting, and logging infrastructure. |
| **Total Estimated Cost** | | **~$423.00 / month** | |

## Cost Optimization Tips
1. **Dev/Test Environments**: Scale down the App Service Plan to Basic (B1) or Free (F1) and App Gateway to Standard v2 to save ~$300/month in non-production environments.
2. **Database**: Use Serverless SQL for unpredictable workloads to save costs when idle.
3. **Storage Lifecycle**: Implement lifecycle management policies to move blobs older than 30 days to the Cool Tier, and older than 365 days to the Archive Tier.

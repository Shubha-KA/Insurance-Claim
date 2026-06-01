# High-Level Architecture

```text
User (Browser)
       |
[ HTTPS Ingress ]
Application Gateway + WAF
       |
       +-----------------+
       |                 |
 [ Frontend ]      [ Backend ]
App Service       App Service(s)
 (React)               |
                       +-------------------+
                       |                   |
               Claim Service        Document Service
                       |                   |
                       |                   |
                  [ Database ]        [ Primary Storage ]
                   Azure SQL             Blob Storage (East US)
                                           |
                                      [ Event Router ]
                                         Event Grid
                                           |
                                      [ Compute ]
                                      Azure Function
                                           |
                                      [ Secondary Storage ]
                                         Blob Storage (Central US)
```

## Mermaid Diagram

```mermaid
graph TD
    User([User])
    
    subgraph Security & Ingress
        AppGateway[Application Gateway + WAF]
    end
    
    subgraph Frontend App Service
        UI[React Frontend SPA]
    end
    
    subgraph Backend App Services
        ClaimService[Claim Service API]
        DocService[Document Service API]
    end
    
    subgraph Database
        SQL[(Azure SQL Database)]
    end
    
    subgraph Primary Region: East US
        PrimaryBlob[(Primary Blob Storage)]
    end
    
    subgraph Event & Compute
        EventGrid{{Azure Event Grid}}
        AzFunction[[Azure Function]]
    end
    
    subgraph Secondary Region: Central US
        SecondaryBlob[(Secondary Blob Storage)]
    end
    
    User -->|HTTPS| AppGateway
    AppGateway -->|Route /| UI
    AppGateway -->|Route /api/claims| ClaimService
    AppGateway -->|Route /api/documents| DocService
    
    ClaimService -->|Read/Write| SQL
    DocService -->|Upload/Read| PrimaryBlob
    DocService -->|Metadata| SQL
    
    PrimaryBlob -.->|BlobCreated Event| EventGrid
    EventGrid -.->|Trigger| AzFunction
    AzFunction -->|Copy Blob| SecondaryBlob
    
    classDef service fill:#0072C6,color:#fff,stroke:#fff,stroke-width:2px;
    classDef storage fill:#0089D6,color:#fff,stroke:#fff,stroke-width:2px;
    classDef event fill:#5C2D91,color:#fff,stroke:#fff,stroke-width:2px;
    classDef function fill:#FF8C00,color:#fff,stroke:#fff,stroke-width:2px;
    classDef db fill:#003F7A,color:#fff,stroke:#fff,stroke-width:2px;
    classDef gateway fill:#0072C6,color:#fff,stroke:#fff,stroke-width:2px;
    classDef user fill:#68217A,color:#fff,stroke:#fff,stroke-width:2px;
    
    class AppGateway gateway;
    class ClaimService,DocService service;
    class PrimaryBlob,SecondaryBlob storage;
    class EventGrid event;
    class AzFunction function;
    class SQL db;
    class User user;
```

# Insurance Claims Application - 10 Minute Demo Script

## 1. Problem Statement (1 min)
"Hello everyone! Today, I'm going to demonstrate a cloud-native Insurance Claims Application. In the insurance industry, losing a customer's claim document—like a photo of car damage—is catastrophic. It delays processing and hurts customer trust. The problem we are solving today is: **How do we guarantee that uploaded claim documents are never lost, even if an entire Azure data center goes offline?**"

## 2. Architecture (1 min)
*Show Architecture Diagram*
"To solve this, we built a microservices architecture.
- We have a **React Frontend** for the user interface.
- A **Claim Service** built in Node.js, storing claim data in **Azure SQL**.
- A **Document Service** handling file uploads.
- We secure all traffic through an **Azure Application Gateway** with a Web Application Firewall."

## 3. Blob Storage (1 min)
"When a user uploads a document, it goes into Azure Blob Storage. Blob Storage is object storage optimized for massive amounts of unstructured data like images and PDFs. We use the 'Standard' tier for cost-efficiency, and organize our files inside a logical folder called a 'Container'."

## 4. File Upload Flow (1 min)
"Let's see it in action."
*Open application, create a claim, and upload a document.*
"As you can see, I just uploaded a photo of a damaged bumper. The frontend sent this to our Document Service, which streamed it directly into our Primary Blob Storage account located in East US."

## 5. Geo Redundancy (1 min)
"But what happens if a hurricane hits the East US data center? 
Azure offers Geo-Redundant Storage (GRS) out of the box, but it can be expensive and sometimes slow to failover. We decided to build our own event-driven replication to maintain total control over our data flow and costs. We want every document copied to Central US."

## 6. Event Grid (1 min)
*Show Sequence Diagram*
"To do this, we use **Azure Event Grid**. Event Grid is a highly scalable message routing service. We configured it to listen to our Primary Blob Storage. The millisecond my photo finished uploading, the storage account fired a `BlobCreated` event, and Event Grid caught it."

## 7. Azure Functions (1 min)
"Event Grid immediately pushed that event to an **Azure Function**. Azure Functions are serverless compute—they only run when triggered. Our Function received the event, woke up, read the photo from East US, and copied it to our Secondary Blob Storage in Central US. This entire process happened in the background in less than a second."

## 8. Application Gateway + WAF (1 min)
"Security is paramount. Users don't talk directly to our App Services. They go through the **Application Gateway**. It acts as a reverse proxy and load balancer. More importantly, it runs a Web Application Firewall (WAF) that actively blocks SQL injection and cross-site scripting attacks before they ever reach our code."

## 9. Terraform (1 min)
"You might be wondering how we deployed all these complex resources. We used **Terraform**. It's an Infrastructure as Code tool. We defined our network, storage, SQL, and event grid routing in code modules. With one `terraform apply` command, Azure built exactly what we asked for, ensuring our environments are perfectly reproducible."

## 10. Demo Walkthrough / Disaster Simulation (1 min)
"Let's prove the redundancy works."
*Switch to Azure Portal*
"Here is the primary storage in East US. I'm going to simulate a disaster by turning off public network access. The East US storage is now dead."
*Switch to Document Service Configuration*
"I'll update our Document Service to point to the `insurancebackupsa` in Central US and restart it."
*Go back to the frontend, click 'Download' on the image*
"And as you can see, the document downloaded perfectly! The application survived a regional failure."

## 11. Conclusion
"In conclusion, by combining microservices with Azure's event-driven architecture, we built an application that is highly available, secure, and resilient against catastrophic failures. Thank you!"

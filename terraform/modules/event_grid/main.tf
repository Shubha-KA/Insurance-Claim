resource "azurerm_eventgrid_system_topic" "blob_topic" {
  name                   = "egst-insurance-blob"
  resource_group_name    = var.resource_group_name
  location               = "global"
  source_arm_resource_id = var.primary_storage_account_id
  topic_type             = "Microsoft.Storage.StorageAccounts"
}

resource "azurerm_eventgrid_system_topic_event_subscription" "blob_subscription" {
  name                = "egsub-insurance-blob"
  system_topic        = azurerm_eventgrid_system_topic.blob_topic.name
  resource_group_name = var.resource_group_name

  azure_function_endpoint {
    function_id = var.function_app_id
  }

  included_event_types = [
    "Microsoft.Storage.BlobCreated"
  ]
}

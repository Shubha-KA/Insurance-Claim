resource "azurerm_service_plan" "app_service_plan" {
  name                = "asp-insurance-demo"
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "P1v2"
}

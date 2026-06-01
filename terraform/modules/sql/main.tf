resource "azurerm_mssql_server" "sql_server" {
  name                         = "${var.sql_server_name}-${random_string.suffix.result}"
  resource_group_name          = var.resource_group_name
  location                     = var.location
  version                      = "12.0"
  administrator_login          = var.admin_username
  administrator_login_password = var.admin_password
}

resource "azurerm_mssql_database" "sql_database" {
  name      = var.sql_database_name
  server_id = azurerm_mssql_server.sql_server.id
  collation = "SQL_Latin1_General_CP1_CI_AS"
  max_size_gb = 2
  sku_name  = "S0"
}

resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

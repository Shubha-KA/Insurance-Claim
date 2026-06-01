terraform {
  required_version = ">= 1.6.0"

  backend "azurerm" {
    resource_group_name   = "rg-terraform-state"
    storage_account_name  = "tfstateinsdemo"
    container_name        = "tfstate"
    key                   = "insurance-demo.tfstate"
  }
}

provider "azurerm" {
  features {}
}

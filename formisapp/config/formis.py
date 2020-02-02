from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
        {
			"label": _("Sales"),
			"icon": "fa fa-glass",
			"items": [
				{
					"type": "doctype",
					"name": "Sales Order",
					"description": _("Change field properties (hide, readonly, permission etc.)")
				},
				{
					"type": "doctype",
					"name": "Sales Invoice",
					"description": _("Add fields to forms.")
				},
				{
					"type": "doctype",
					"name": "Custom Script",
					"description": _("Add custom javascript to forms.")
				},
				{
					"type": "doctype",
					"name": "DocType",
					"description": _("Add custom forms.")
				},
			]
		},
		{
			"label": _("Dashboards"),
			"items": [
				{
					"type": "doctype",
					"name": "Dashboard",
				},
				{
					"type": "doctype",
					"name": "Dashboard Chart",
				},
				{
					"type": "doctype",
					"name": "Dashboard Chart Source",
				},
			]
		},
		{
			"label": _("Stock"),
			"items": [
            {
					"type": "doctype",
					"name": "Delivery Note",
					"onboard": 1,
					"dependencies": ["Item", "Customer"],
				},
				{
					"type": "doctype",
					"label": _("Item"),
					"name": "Item",
					"description": _("Add your own translations")
				},
				{
					"type": "report",
					"is_query_report": True,
					"name": "Stock Balance",
					"doctype": "Stock Ledger Entry",
					"onboard": 1,
					"dependencies": ["Item"],
				},
                {
					"type": "page",
					"name": "stock-balance",
					"label": _("Stock Summary"),
					"dependencies": ["Item"],
                    }
			]
		}
	]

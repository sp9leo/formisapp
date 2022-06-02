# Copyright (c) 2022, formis and contributors
# For license information, please see license.txt

import frappe

@frappe.whitelist()
def get_dostava_price(name):
	subject = frappe.db.get_value('Dostava Cenik', name, ['cena', 'naziv_storitve'])
	frappe.msgprint(msg='Function called', title='Info'	)
	return subject

@frappe.whitelist()
def get_embalaza(name):
	skatla = frappe.db.get_value('Item', name, ['weight_per_unit', 'weight_uom'])
	frappe.msgprint(msg='Function skatla called', title='Info'	)
	return skatla
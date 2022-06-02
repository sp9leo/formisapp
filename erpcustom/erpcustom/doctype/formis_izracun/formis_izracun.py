# Copyright (c) 2022, formis and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document

class FormisIzracun(Document):
	pass
@frappe.whitelist()
# def make_sales_order(arg):
# 	doc = frappe.new_doc('Task')
# 	doc.title = 'New Task 2'
# 	doc.insert()
def mycustomdoc(doctype,subject):
	print(doctype, subject)
	doc = frappe.get_doc(doctype)
	doc.subject = subject
	doc.append("depends_on", {
    "task": "TASK-2022-00001",
    
})
	doc.insert()
	return

# doc.append("childtable", {
#     "child_table_field": "value",
#     "child_table_int_field": 0,
#     ...
# })
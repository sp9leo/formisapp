@frappe.whitelist()
def make_payment_entry():
    payment_entry = frappe.new_doc("Payment Entry")
    payment_entry.party_type = "Supplier"
    payment_entry.save()
    return payment_entry.name
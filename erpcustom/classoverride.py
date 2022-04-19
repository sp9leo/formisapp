import erpnext.education.doctype.student.student
from frappe.model.document import Document

class SandiStudent(Document):
	def validate(self):
		self.title = " ".join(filter(None, [self.first_name, self.middle_name]))
				print ("loooks like it is working!!")
				frappe.msgprint(
					msg='This file does not exist',
					title='Error'				)
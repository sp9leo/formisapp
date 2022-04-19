// Copyright (c) 2022, formis and contributors
// For license information, please see license.txt

frappe.ui.form.on('Dostava Cenik', {
	// refresh: function(frm) {

	// }
	before_save: function (frm) {
		const i = frm.doc
		let naziv_storitve = i.skupina_name + " od " + i.teza_od + "g" + " do " + i.teza_do + "g"
		let naziv = " Od " + i.teza_od + "g" + " do " + i.teza_do + "g"

		if (!i.naziv_storitve) { //if empty

			frm.set_value('naziv_storitve', naziv_storitve)
		}
		else {
			//frappe.show_alert('Naziv storitve', 5);
		}
		if (!i.naziv) { //if empty

			frm.set_value('naziv', naziv)
		}
		else {
			//frappe.show_alert('Hi, you have a new message', 5);
		}
	},


});

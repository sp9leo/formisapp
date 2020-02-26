// Copyright (c) 2016, formis and contributors
// For license information, please see license.txt

frappe.ui.form.on('Izdelki Formis', {
	refresh: function(frm) {

	}
});

frappe.ui.form.on("Izdelki Formis", "cost", function(frm) {
frappe.model.with_doc("Kalkulacija izdelki", frm.doc.cost, function() {
var s= frappe.model.get_doc("Kalkulacija izdelki", frm.doc.cost);
frm.set_value("strosek_izdelave", s.work_kos);
frm.set_value("produkt", s.izdelek);
frm.set_value("opis", s.opis);
frm.set_value("poraba_materiala", s.area + " m2");
if(s.sekunde==1) {frm.set_value("cas_izdelave", s.razrez +" sekund")}
else{frm.set_value("cas_izdelave", s.razrez +" minut")};
frm.set_value("strosek_materiala", s.material_kos);
frm.set_value("material", s.doc_1);
frm.set_value("total_cost", s.work_kos+s.material_kos);
frm.set_value("dimenzija", s.x+"x"+s.y);
})
});

frappe.ui.form.on("Izdelki Formis", {
    refresh: function(frm) {
        // use the __islocal value of doc, to check if the doc is saved or not
        frm.set_df_property("strosek_materiala", "read_only", frm.doc.status=="izdelava");
frm.set_df_property("strosek_izdelave", "read_only", frm.doc.status=="izdelava");
frm.set_df_property("total_cost", "read_only", frm.doc.status=="izdelava");
frm.set_df_property("cost", "read_only", frm.doc.status=="izdelava");
    }
});
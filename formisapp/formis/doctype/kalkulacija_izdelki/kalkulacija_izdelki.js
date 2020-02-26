// Copyright (c) 2016, formis and contributors
// For license information, please see license.txt

//filtriraj cenik glede na izbran item
frappe.ui.form.on("Kalkulacija izdelki", "refresh", function(frm) {
    cur_frm.set_query("cenik", function() {
        return {
            "filters": {
                "item_name": frm.doc.item,                
            }
        };
    });
});

//gumb za osvezitev kalkulacije
frappe.ui.form.on("Kalkulacija izdelki", "button", function(frm) {
frm.refresh();
});

//pridobi podatke preko linka
cur_frm.add_fetch("doc_1", "last_purchase_rate", "last_purchase_rate");
cur_frm.add_fetch("doc_1", "valuation_rate", "valuation_rate");
cur_frm.add_fetch("doc_1", "standard_rate", "price1");
cur_frm.add_fetch("cenik", "price_list", "pricelist");
cur_frm.add_fetch("doc_1", "standard_rate", "price");
//izpisi ceno skupaj z enotami
frappe.ui.form.on("Kalkulacija izdelki", "doc_1", function(frm) {
cur_frm.set_value("price1", (frm.doc.price1)+" za "+(frm.doc.item_uom));

 });
//test html-ja
frappe.ui.form.on("Kalkulacija izdelki", "refresh", function(frm,doctype,name) {
   $(cur_frm.fields_dict.html_field.wrapper).html(("Cena po ceniku za kos "+(frm.doc.plist_rate)+"<br>Valuation rate "+(frm.doc.valuation_rate)+"<br>Zadnja nabavna cena "+(frm.doc.last_purchase_rate)));
});


 //izracunaj povrsino//
 frappe.ui.form.on("Kalkulacija izdelki", "x", function(frm) {
 cur_frm.set_value("area", (frm.doc.x*frm.doc.y)/10000);
    
 });
frappe.ui.form.on("Kalkulacija izdelki", "y", function(frm) {
 cur_frm.set_value("area", (frm.doc.x*frm.doc.y)/10000);
 
 });

//spremeni ceno ce racunas s sekundami namesto minutami
frappe.ui.form.on("Kalkulacija izdelki", "refresh", function(frm) {
    if (frm.doc.sekunde==1) {
        cur_frm.set_value("work_kos", (frm.doc.work_price/60*frm.doc.razrez));
          }
else {cur_frm.set_value("work_kos", (frm.doc.work_price*frm.doc.razrez));}
});

frappe.ui.form.on("Kalkulacija izdelki", "refresh", function(frm) {
//izracunaj ceno materiala
 cur_frm.set_value("material_total", (frm.doc.material_kos*frm.doc.qty));
cur_frm.set_value("material_kos", (frm.doc.area*frm.doc.price));
//izracunaj povrsino
cur_frm.set_value("area", (frm.doc.x*frm.doc.y)/10000);
//izracunaj skupno povrsino
cur_frm.set_value("area_total", (frm.doc.area*frm.doc.qty));
//izracunaj ceno dela
cur_frm.set_value("work_total", (frm.doc.work_kos*frm.doc.qty));
//izracunaj skupno ceno na kos
cur_frm.set_value("total_kos", (frm.doc.work_kos+frm.doc.material_kos));
//izracunaj skupni znesek delo+material
cur_frm.set_value("total", (frm.doc.work_total+frm.doc.material_total));
cur_frm.set_value("area_total", (frm.doc.area*frm.doc.qty));
cur_frm.set_value("work_total", (frm.doc.work_kos*frm.doc.qty));
cur_frm.set_value("total", (frm.doc.work_total+frm.doc.material_total));



});
frappe.ui.form.on("Kalkulacija izdelki", "man_price", function(frm) {
 cur_frm.set_value("material_total1", (frm.doc.area*frm.doc.man_price));

});



cur_frm.add_custom_button(__('Delivery'), this.make_delivery_note, __("Make"));


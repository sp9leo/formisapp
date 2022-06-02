
// funkcije za izračun total po posameznih vrsticah tabele. Funkcijo pokličeš v polju v tabeli(child) - glej spodaj.
frappe.ui.form.on('Formis Izracun', {
    setup: function (frm) {
        console.log("setup function"),
            frm.compute_total_material = function (frm, row) {

                let total = 0;
                frm.doc.material.forEach(d => {

                    total = total + d.material_cena_kos;
                    console.log("calculation done" + total)

                })

                let new_total = total
                console.log("new total" + new_total)
                frm.set_value('material_total', new_total)
            }

        frm.compute_total_razrez = function (frm, row) {
            let total = 0;
            frm.doc.delo.forEach(d => {
                total = total + d.work_kos;
                console.log("calculation razrez" + total)
            })
            let new_total = total
            console.log("new total" + new_total)
            frm.set_value('delo_total', new_total)
        }
        frm.compute_total_graviranje = function (frm, row) {
            let total = 0;
            frm.doc.delo.forEach(d => {
                total = total + d.engrave_total;
                console.log("calculation graviranje" + total)
            })
            let new_total = total
            console.log("new total" + new_total)
            frm.set_value('delo_total', new_total)
        }





    }




})

//IZRAČUNAJ TOTAL s klicanjem funkcije
frappe.ui.form.on('Formis Izracun Delo', {
    razrez_sec: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frm.compute_total_razrez(frm, row)

    },
    razrez_min: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frm.compute_total_razrez(frm, row)

    },
    engrave_y: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frm.compute_total_graviranje(frm, row)

    },
    per_piece: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frm.compute_total_graviranje(frm, row)

    },
    qty: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frm.compute_total_graviranje(frm, row)

    },
    delo_remove: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frm.compute_total_razrez(frm, row)
        frm.compute_total_graviranje(frm, row)
    },


})

// property v child table - NE DELA PRAV-ne osvežuje v realtime
frm.dfproperty = function (frm, cdt, cdn) {

    let df = frappe.meta.get_docfield('Formis Izracun Delo', 'engrave_y', cur_frm.doc.name)
    console.log(df)
    let i = locals[cdt][cdn]
    console.log("trigger ok")

    df.description = ("Hello label")
    frm.reload_doc();



}

/*--------------------------funkcije, za child doctype "Formis Izracun Material"-------------------------------*/
frappe.ui.form.on('Formis Izracun Material', {
    form_render: function (frm, cdt, cdn) { //event ko odpreš novo vrstico od child table v glavnem dokumentu
        console.log("hi there")


    }
});
frappe.ui.form.on('Formis Izracun', 'material_on_form_rendered', function (frm, cdt, cdn) {

    let df = frappe.meta.get_docfield('Formis Izracun Material', 'y', cur_frm.doc.name)
    console.log(df)
    let i = locals[cdt][cdn]
    console.log("trigger ok")

    df.description = i.buying_price;
    frm.refresh_field('material')
})

/* Vstavi nov dokument v ozadju dokument se shrani---------->>>*/
var doc = {
    'doctype' : 'Sales Order',
    'customer': "kupec",
    'delivery_date':'2022-04-13',
    'items': [{'item_code':item.name1, 
    'item_name':"izdelek po meri", 
    'qty':1,
    }]

}; 
frappe.call({
    method: "frappe.client.insert",
    args: {"doc": doc}, // use JSON.parse(JSON.stringify(doc)) for parsing to json object
    callback: function(r) {
        if(r.exc) {
            msgprint(__("There were errors."));
        } else {
            msgprint(__("Document inserted."));
        }
    }
})
/*<<<<<---------------------- Vstavi nov dokument v ozadju - dokument se shrani*/

/* Vstavi nov dokument v ozadju dokument se shrani---------->>>*/
frappe.db.insert({
        doctype: 'Task',
        subject: 'New Task'
    }).then(doc => {
        console.log(doc);
    })
/*<<<<<---------------------- Vstavi nov dokument v ozadju - dokument se shrani*/

/*------>>>  vstavi nov dokument in ga odpri - dokument ni shranjen------->>>*/
frappe.new_doc("Sales Order", {"customer": "kupec"}, doc => {
    doc.posting_date = frappe.datetime.get_today();
    let row = frappe.model.add_child(doc, "items");
    row.item_code = 'test';
    row.item_name = 'item name test';
    row.qty = 2.0;
    row.rate = 10.0;
});

/*<<<<<-----------  vstavi nov dokument in ga odpri - dokument ni shranjen*/

# def make_sales_order(arg):
# 	doc = frappe.new_doc('Task')
# 	doc.title = 'New Task 2'
# 	doc.insert()
# def mycustomdoc(doctype,subject):
# 	print(doctype, subject)
# 	doc = frappe.get_doc(doctype)
# 	doc.subject = subject
# 	doc.append("depends_on", {
#     "task": "TASK-2022-00001",
    
# })
# 	doc.insert()
# 	return

#  doc.append("childtable", {
#     "child_table_field": "value",
#     "child_table_int_field": 0,
#     ...
# }) 
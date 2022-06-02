// Copyright (c) 2022, formis and contributors
// For license information, please see license.txt
//FORM SETUP
frappe.ui.form.on('Formis Izracun', {
    setup: function (frm) {
        console.log("setup function")

        frm.compute_total_material = function (frm) {//seštej vse vrstice materiala
            if (frm.doc.material) {
                let total = 0;
                frm.doc.material.forEach(d => {
                    total = total + d.material_cena_kos;
                    console.log("calculation done" + total)
                })
                let new_total = total
                console.log("new total" + new_total)
                frm.set_value('material_total', new_total)
            }
            else { frm.set_value('material_total', 0) }

        };

        frm.compute_total_delo = function (frm) {//seštej vse vrstice delo->graviranje in razrez
            if (frm.doc.delo) {
                let total = 0;
                frm.doc.delo.forEach(d => {
                    total = total + d.work_total
                    console.log("calculation delo-" + total)
                })
                let new_total = total
                console.log("new total" + new_total)
                frm.set_value('delo_total', new_total)
            }
            else { frm.set_value('delo_total', 0) }
        };

        frm.computeTotal = function (frm) {
            let grandTotal = frm.doc.delo_total + frm.doc.material_total
            console.log(grandTotal)

            frm.set_value('total', grandTotal)

            $(cur_frm.fields_dict.izracun_html.wrapper).html(("Izračun delo: " + (frm.doc.delo_total).toPrecision(2) + "<br>Izračun material: " //pokaži rezultate v html polju "price_difference"
                + (frm.doc.material_total).toPrecision(3)
            ))
        };
    },

    //izračunaj TOTAL
    before_save: function (frm) {
        //let row = locals[cdt][cdn]
        console.log("before save")
        //console.log("before save2")
        // frm.compute_total_material(frm)
        // frm.compute_total_delo(frm)
        // frm.computeTotal(frm)

    },
    calculate_btn: function (frm) {
        //let row = locals[cdt][cdn]
        console.log("Button pressed")

        frm.compute_total_material(frm)
        frm.compute_total_delo(frm)
        frm.computeTotal(frm)

    }

})
// -----------MATERIAL CHILD DOCTYPE-------------------
// MATERIAL CHILD DOCTYPE SETUP - izračunaj površino
frappe.ui.form.on('Formis Izracun Material', {
    form_render: function (frm) {
        //izračunaj površino
        frm.calculateArea = function (frm, cdt, cdn) {
            let i = locals[cdt][cdn]
            let area_m = (i.x * i.y) / 10000; // dolžina * širina
            let area_cm = (i.x * i.y); // dolžina * širina v cm
            let material_strosek = (area_m * i.buying_price) // vrednost po nabavni ceni
            let material_cena = (area_m * i.selling_price) // vrednost po prodajni ceni
            //console.log(povrsina+"m²") 
            i.area = area_m
            i.area_cm = area_cm
            i.material_kos = material_strosek
            i.material_cena_kos = material_cena
            //frm.set_value({ area: area_m, area_cm: area_cm })
            frm.refresh_field('material')
        }
        //izračunaj popust materiala
        frm.material_discount = function (frm, cdt, cdn) {
            let i = locals[cdt][cdn]

            if (i.material_discount > 0) {
                let discount = (1 - i.material_discount / 100)
                let material_cena = (i.area * i.selling_price * discount)
                i.material_cena_kos = material_cena


            }
            else {
                let material_cena = (i.area * i.selling_price)
                i.material_cena_kos = material_cena

            }
            frm.refresh_field('material')
            // poglej v dokumeticijo za html polje - class warning
            //get_value(material_cena_kos)

        }
        //izračunaj ceno materiala na kos
        frm.material_cena_kos = function (frm, cdt, cdn) {
            let i = locals[cdt][cdn]
            let razlika = (i.material_cena_kos - i.material_kos)
            $(cur_frm.fields_dict.price_difference.wrapper).html(("Strošek materiala: " + (i.material_kos).toPrecision(2) + "<br>Cena materiala:" //pokaži rezultate v html polju "price_difference"
                + (i.material_cena_kos).toPrecision(2) + "<br>Razlika: " + (razlika).toPrecision(2)
            ))
            frm.refresh_field('material')
        }
    },
    x: function (frm, cdt, cdn) {
        let i = locals[cdt][cdn]
        frm.calculateArea(frm, cdt, cdn)
    },
    y: function (frm, cdt, cdn) {
        let i = locals[cdt][cdn]
        frm.calculateArea(frm, cdt, cdn)
    },
    material_discount: function (frm, cdt, cdn) {

        let i = locals[cdt][cdn]
        frm.material_discount(frm, cdt, cdn)
    },
    material_cena_kos: function (frm, cdt, cdn) {

        let i = locals[cdt][cdn]
        frm.material_cena_kos(frm, cdt, cdn)

    }
});
//iz cenika dobi prodajno in nakupno ceno
frappe.ui.form.on('Formis Izracun Material', 'item_code', function (frm, cdt, cdn) {

    let i = locals[cdt][cdn];
    frappe.db.get_value(
        'Item Price', //doctype
        { selling: "1", item_code: i.item_code }, //filters
        ['price_list_rate', 'item_name', 'price_list'])// fields to return
        .then(r => {
            let response = r.message;
            //console.log(response)
            i.selling_price = response.price_list_rate
            frm.refresh_field('material')
        })

    frappe.db.get_value(
        'Item Price', //doctype
        { selling: "0", item_code: i.item_code }, //filters
        ['price_list_rate', 'item_name', 'price_list'])// fields to return
        .then(r => {
            let response = r.message;
            //console.log(response),
            i.buying_price = response.price_list_rate
            frm.refresh_field('material')
        })



});
//Izberi ali se računa rezanje ali graviranje
frappe.ui.form.on('Formis Izracun Delo', {
    vrsta: function (frm, cdt, cdn) {

        let i = locals[cdt][cdn];
        if (i.vrsta == "Razrez") {

            //let cena = (i.razrez_min * 60 + i.razrez_sec) / 60 * i.work_price
            //console.log(cena)
            // i.work_kos = cena
            i.engrave_kos = 0
            i.work_total = 0
            frm.refresh_field('delo')
        }
        else {

            console.log("Graviranje")
            i.work_kos = 0
            i.razrez_min = 0
            i.razrez_sec = 0
            i.work_total = 0
            frm.refresh_field('delo')
        }

    },


});


// ----------DELO CHILD DOCTYPE---------------------------------
// DELO CHILD DOCTYPE SETUP - izračunaj razrez in graviranje
frappe.ui.form.on('Formis Izracun Delo', {
    form_render: function (frm) {
        frm.razrez = function (frm, cdt, cdn) {

            let i = locals[cdt][cdn];
            if (i.vrsta == "Razrez") {

                let cena = (i.razrez_min * 60 + i.razrez_sec) / 60 * 1.25//cena razreza
                console.log(cena)
                i.work_kos = cena
                i.engrave_kos = ''
                i.work_total = cena
                frm.refresh_field('delo')
            }
            else {

                console.log("Graviranje")
                i.work_kos = ''
                i.work_total = ''
                frm.refresh_field('delo')
            }

        },
            frm.graviranje = function (frm, cdt, cdn) {

                let i = locals[cdt][cdn];
                if (i.vrsta == "Graviranje") {
                    let area = i.engrave_x * i.engrave_y
                    i.engrave_area = area
                    //i.engrave_cm = area * i.engrave_price_cm
                }
                else {
                    console.log("ni graviranje")
                }
                frm.refresh_field('delo')
            },

            /*izračunaj variabilno ceno na podlagi količine kosov
            do 10 kos je 0,7€ do 50 kos je 0,45€ za večje količine je 0,3€*/
            frm.SteviloKosov = function (a) {

                if (a <= 10 && a > 0) {
                    console.log("<10")
                    return 0.70
                    console.log(a)
                }
                else if (a <= 50 && a > 10) {
                    console.log("<50")
                    return 0.45
                }
                else if (a <= 100 && a > 50) { return 0.30 }
                else if (a >= 100) { frappe.show_alert("Količina nad 100, \n cena po dogovoru"); return 0.30 }

            },
            //FUNKCIJA ZA  IZRAČUN CENE GRAVIRANJA!!
            frm.cenagraviranja = function (frm, cdt, cdn) {
                console.log("funkcija cena graviranja")
                let i = locals[cdt][cdn]
                let variabilnaCena = frm.SteviloKosov(i.qty)
                frm.refresh_field(i.SteviloKosov)
                console.log(variabilnaCena)
                let cenaCm = i.engrave_area * 0.03
                let cenaKos = ''
                if (i.engrave_area > 10) { cenaKos = (i.engrave_area - 10) * 0.05 + variabilnaCena }
                else { cenaKos = 0.7 }
                console.log(cenaKos)
                let graviranje_result = (cenaKos - variabilnaCena).toString() + '+' + variabilnaCena + '=' + cenaKos

                if (i.per_piece) {
                    i.work_total = cenaKos * i.qty
                    i.engrave_kos = cenaKos
                    i.engrave_cm = ''
                    let wrapper = frm.fields_dict[i.parentfield].grid.grid_rows_by_docname[cdn].grid_form.fields_dict['delo_html'].wrapper // "demo" je ime polja v childtable
                    $(wrapper).html("Cena:" + (cenaKos - variabilnaCena) +
                        "<br>Variabilni del:" + variabilnaCena +
                        "<br>Izračun:" + (graviranje_result));
                    console.log(wrapper)
                    console.log(graviranje_result)
                }
                else {
                    i.engrave_cm = cenaCm
                    i.engrave_kos = ''
                    i.work_total = cenaCm * i.qty
                }
                frm.refresh_field('delo')







            }
    }


});
// DELO CHILD DOCTYPE triggerji
frappe.ui.form.on('Formis Izracun Delo', { // ime child doctype-a, polje v child doctypu

    razrez_min(frm, cdt, cdn) {
        frm.razrez(frm, cdt, cdn)
    },
    razrez_sec(frm, cdt, cdn) {
        frm.razrez(frm, cdt, cdn)
    },
    engrave_y(frm, cdt, cdn) {

        frm.SteviloKosov(frm)
        frm.graviranje(frm, cdt, cdn)
        frm.cenagraviranja(frm, cdt, cdn)

    },
    engrave_x(frm, cdt, cdn) {
        frm.SteviloKosov(frm)
        frm.graviranje(frm, cdt, cdn)
        frm.cenagraviranja(frm, cdt, cdn)

    },

    qty(frm, cdt, cdn) {
        frm.SteviloKosov(frm)
        frm.cenagraviranja(frm, cdt, cdn)

    },
    per_piece(frm, cdt, cdn) {
        frm.cenagraviranja(frm, cdt, cdn)
        frm.graviranje(frm, cdt, cdn)
    }



});

// izračunaj total iz child table in pokaži v polju na form
frappe.ui.form.on('Formis Izracun Material', {
    //preračunaj, ko odstraniš row v child table
    material_remove: function (frm, cdt, cdn) {
        let row = locals[cdt][cdn]
        frm.compute_total_material(frm, row)
        frm.computeTotal(frm)

    }

})

frappe.ui.form.on('Formis Izracun Delo', {


    delo_remove: function (frm, cdt, cdn) {
        //let row = locals[cdt][cdn]
        console.log("delo row removed")


        frm.compute_total_delo(frm)
        frm.computeTotal(frm)

    }
})

//vstavi vrednost v HTML polje v CHILD-TABLE - DELUJE
frappe.ui.form.on('Formis Izracun Material', {
    y: function (frm, cdt, cdn) {

        var d = locals[cdt][cdn]
        let wrapper = frm.fields_dict[d.parentfield].grid.grid_rows_by_docname[cdn].grid_form.fields_dict['material_html'].wrapper // "demo" je ime polja v childtable
        let sellingPrice = d.selling_price
        let difference = d.material_cena_kos - d.material_kos

        //$("<div></div>").html("hello" + (sellingPrice)).appendTo(wrapper);
        $(wrapper).html("Prodajna cena: " + (d.material_cena_kos).toPrecision(2) + "Nabavna cena: " + (d.material_kos).toPrecision(2) + "profit/loss: " + (difference).toPrecision(2));
        console.log(wrapper)
        console.log(d.selling_price)

    },
    x: function (frm, cdt, cdn) {

        var d = locals[cdt][cdn]
        let wrapper = frm.fields_dict[d.parentfield].grid.grid_rows_by_docname[cdn].grid_form.fields_dict['material_html'].wrapper // "demo" je ime polja v childtable
        let sellingPrice = d.selling_price
        let difference = d.material_cena_kos - d.material_kos

        //$("<div></div>").html("hello" + (sellingPrice)).appendTo(wrapper);
        $(wrapper).html("Prodajna cena: " + (d.material_cena_kos).toPrecision(2) + "Nabavna cena: " + (d.material_kos).toPrecision(2) + "profit/loss: " + (difference).toPrecision(2));
        console.log(wrapper)
        console.log(d.selling_price)

    },
    material_discount: function (frm, cdt, cdn) {

        var d = locals[cdt][cdn]
        let wrapper = frm.fields_dict[d.parentfield].grid.grid_rows_by_docname[cdn].grid_form.fields_dict['material_html'].wrapper // "demo" je ime polja v childtable
        let sellingPrice = d.selling_price
        let difference = d.material_cena_kos - d.material_kos

        //$("<div></div>").html("hello" + (sellingPrice)).appendTo(wrapper);
        $(wrapper).html("Prodajna cena: " + (d.material_cena_kos).toPrecision(2) + "Nabavna cena: " + (d.material_kos).toPrecision(2) + "profit/loss: " + (difference).toPrecision(2));
        console.log(wrapper)
        console.log(d.selling_price)

    }
});

frappe.ui.form.on('Formis Izracun', {
    setup: function(frm) {
    let i = frm.doc
      frm.add_custom_button(__('Make Sales Order'), function(){
          console.log("this is price")

          frappe.new_doc("Sales Order", {"customer": i.stranka}, doc => {
            doc.posting_date = frappe.datetime.get_today();//današnji datum
            doc.delivery_date = frappe.datetime.add_days(frappe.datetime.nowdate(), 5)//dodaj 5 dni k današnjem datumu
            let row = frappe.model.add_child(doc, "items");
            row.item_code = 'test';
            row.item_name = i.name1;
            row.qty = 1.0;
            row.rate = i.total;
            row.delivery_date=doc.delivery_date
        });

       
            
          
    }, __("Action"));
    
  }
});

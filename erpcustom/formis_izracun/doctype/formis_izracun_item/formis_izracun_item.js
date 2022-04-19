//pokliči cenik ob izbiri cenika

frappe.ui.form.on('Formis Izracun Item', {

    item_code: function (frm) {

        let i = frm.doc;

        frappe.db.get_value(
            'Item Price', //doctype
            { selling: "1", item_code: i.item_code }, //filters
            ['price_list_rate', 'item_name', 'price_list'])// fields to return
            .then(r => {
                let response = r.message;
                console.log(response),
                    frm.set_value({
                        selling_price: response.price_list_rate,
                    })
            })

        frappe.db.get_value(
            'Item Price', //doctype
            { selling: "0", item_code: i.item_code }, //filters
            ['price_list_rate', 'item_name', 'price_list'])// fields to return
            .then(r => {
                let response = r.message;
                console.log(response),
                    frm.set_value({
                        buying_price: response.price_list_rate,
                    })
            })

    },



})

frappe.ui.form.on("Formis Izracun Item", "item_code", function (frm, doctype, name) {
    $(cur_frm.fields_dict.html_field.wrapper).html(("Artikel:" + (frm.doc.item_name) + "<br>Cena po ceniku za kos:"
        + (frm.doc.plist_rate) + "<br>Valuation rate: "
        + (frm.doc.valuation_rate)
        + "<br>Zadnja nabavna cena: "
        + (frm.doc.last_purchase_rate)
        + "<br>Cena:" + (frm.doc.price) + "€" + " za " + (frm.doc.item_uom)



    ))
});

//kalkulacije

frappe.ui.form.on('Formis Izracun Item', {


    x: function (frm) {
        let i = frm.doc
        let area_m = (i.x * i.y) / 10000 // dolžina * širina
        let area_cm = (i.x * i.y) // dolžina * širina v cm
        //console.log(area_m, area_cm)
        frm.set_value({ area: area_m, area_cm: area_cm })
        frm.refresh_field(i.material_cena_kos)
    },
    y: function (frm) {
        let i = frm.doc
        let area_m = (i.x * i.y) / 10000; // dolžina * širina
        let area_cm = (i.x * i.y); // dolžina * širina v cm
        let material_kos = (i.area * i.buying_price);
        //console.log(povrsina+"m²") 
        frm.set_value({ area: area_m, area_cm: area_cm })
    },
    area: function (frm) {
        let i = frm.doc
        let material_strosek = (i.area * i.buying_price) // vrednost po nabavni ceni
        let material_cena = (i.area * i.selling_price) // vrednost po prodajni ceni

        frm.set_value({ material_kos: material_strosek, material_cena_kos: material_cena })
        frm.set_df_property('material_kos', 'description', (`Nabavna cena:${i.buying_price}€`)); // ${field name} - sintaksa za string
        frm.set_df_property('material_cena_kos', 'description', (`Prodajna cena:${i.selling_price}€`))
    }
});


frappe.ui.form.on('Formis Izracun Item', {
    material_discount: function (frm) {
        let i = frm.doc

        if (i.material_discount > 0) {
            let discount = (1 - i.material_discount / 100)
            let material_cena = (i.area * i.selling_price * discount)
            frm.set_value({ material_cena_kos: material_cena })


        }
        else {
            let material_cena = (i.area * i.selling_price)
            frm.set_value({ material_cena_kos: material_cena })

        }
        // poglej v dokumeticijo za html polje - class warning
        //get_value(material_cena_kos)

    },
    material_cena_kos: function (frm) {
        let i = frm.doc
        let razlika = (i.material_cena_kos - i.material_kos)
        $(cur_frm.fields_dict.price_difference.wrapper).html(("Strošek materiala: " + (i.material_kos).toPrecision(2) + "<br>Cena materiala:" //pokaži rezultate v html polju "price_difference"
            + (i.material_cena_kos).toPrecision(2) + "<br>Razlika: " + (razlika).toPrecision(2)
        ))


    }


})

frappe.ui.form.on('Formis Izracun Item', {

    razrez_sec:function(frm){

        let i = frm.doc
        let cena = (i.razrez_min*60 + i.razrez_sec)/60*i.work_price
        console.log(cena)
        frm.set_value({work_kos: cena})
    }


})


/*
frappe.ui.form.on("Article Details", "article_name", function(frm, cdt, cdn) {
    let item = locals[cdt][cdn]; 
    let articleId = Math.round(+new Date()/1000);
    item.article_id = articleId;
    frm.refresh_field('my_article');
});
*/
/*
frappe.ui.form.on('Formis Izracun Item',{
 
    //item price
  cenik:function (frm) {
        let i = frm.doc;
       
        if (frm.doc.item_code) {
            frappe.call({
                method: 'erpcustom.erpcustom.doctype.formis_izracun_item.formis_izracun_item.get_cena',// funkcija v py datoteki
                args: {//argumenti za py funkcijo
                    doctype: 'Item Price',
                    item: i.item_code,
                    pricelist: i.cenik
                }
            }).done((r) => {
                console.log(r)
                if (r.message.length !=0) //če py funkcija vrne rezultate. Običajno vrne kot "message" --> glej v konzoli
                    console.log("liftoff"),
                    frm.set_value({
                        item_name: r.message[0].item_name, // oglati oklepaj je indeks v arrayu
                        plist_rate: r.message[0].price_list_rate,
                        //pricelist: r.message[0].price_list
                    })
                else (r.message.length==0)
                console.log("no result"),
                frappe.show_alert({
                    message:__(i.item_code+" nima cene v ceniku " ),
                    indicator:'red'
                }, 10);
                
            }


                //console.log(r)
                // {
                //     $.each(r.message, function (_i, e) {
                //         console.log(e)
                //     }


                //     )
                // }


            )

        }

        else{
            frappe.show_alert({
                message:__("izberi material!" ),
                indicator:'red'
            }, 10);

            
        }
        

    }
})

//pokliči cenik ob spremembi item_code
frappe.ui.form.on('Formis Izracun Item',{
 
    //item price
  item_code:function (frm) {
        let i = frm.doc;
       
        if (frm.doc.item_code) {
            frappe.call({
                method: 'erpcustom.erpcustom.doctype.formis_izracun_item.formis_izracun_item.get_cena',// funkcija v py datoteki
                args: {//argumenti za py funkcijo
                    doctype: 'Item Price',
                    item: i.item_code,
                    pricelist: i.cenik
                }
            }).done((r) => {
                console.log(r)
                if (r.message.length !=0) //če py funkcija vrne rezultate. Običajno vrne kot "message" --> glej v konzoli
                    console.log("liftoff"),
                    frm.set_value({
                        item_name: r.message[0].item_name, // oglati oklepaj je indeks v arrayu
                        plist_rate: r.message[0].price_list_rate,
                        //pricelist: r.message[0].price_list
                    })
                else (r.message.length==0)
                console.log("no result"),
                frappe.show_alert({
                    message:__(i.item_code+" nima cene v ceniku " ),
                    indicator:'red'
                }, 10);
                
            }


                //console.log(r)
                // {
                //     $.each(r.message, function (_i, e) {
                //         console.log(e)
                //     }


                //     )
                // }


            )

        }

        else{
            frappe.show_alert({
                message:__("izberi material!" ),
                indicator:'red'
            }, 10);

            
        }
        

    }
})





frappe.ui.form.on("Formis Izracun Item", {

    //item price
    opis: function (frm) {
        console.log("new dialog")
        let d = new frappe.ui.Dialog({
            title: 'Enter details',
            fields: [
                {
                    label: 'Pošta',
                    fieldname: 'posta',
                    fieldtype: 'Link',
                    options: 'Posta'
                },
                {
                    label: 'Last Name',
                    fieldname: 'last_name',
                    fieldtype: 'Data'
                },
                {
                    label: 'Age',
                    fieldname: 'age',
                    fieldtype: 'Int'
                }
            ],
            primary_action_label: 'Submit',
            primary_action(values) {
                let i = d.get_values()// variable za vrednosti iz dialoga - pokliče vse vrednosti
                console.log(i)
                frm.add_fetch('posta', 'kraj', 'age')
                frm.set_value({
                    opis: i.posta + i.age //v polje opis zapiši vrednost polja pošta in age iz dialoga.
                })
                d.hide();
            }
        });

        d.show();

    }

})



*/
/*frappe.db.get_list('Item Price', {
           fields: ['item_code', 'price_list_rate', 'price_list'],
           filters: {
               price_list:i.cenik,
               item_code: i.item_code
           }
       }).then(r => {
           console.log(r);


       


   })
   */
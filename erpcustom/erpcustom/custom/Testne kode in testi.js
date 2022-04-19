/* 
          let item = frm.doc
          let items_to_load =[]
          //for (item in doc.items):
          console.log(item)
            items_to_load.push({
                'item_code':item.name1, 
                'item_name':"izdelek po meri", 
                'qty':1,
                'delivery_date':"13-04-2022"})
            console.log(items_to_load)
            let row = frm.add_child('items', {
                item_code: 'Tennis Racket',
                qty: 2
            });
            
            frm.refresh_field('items');
         frappe.new_doc('Sales Order',{
            customer: "Kupec",
            items: row
            })

            



            
         } ), */

          /*   var doc= {
              'doctype':'Task',
              'subject': 'this is subject'
          }
          frappe.call({
            method: 'erpcustom.erpcustom.doctype.formis_izracun.formis_izracun.mycustomdoc',
            args:{'doctype': 'Task',
            'subject': "Hello world"
            }
        }).done((r) => {
           console.log(r)
           console.log("call return")
       }) */

        //  var doc = {
        //     'doctype' : 'Sales Order',
        //     'customer': "kupec",
        //     'delivery_date':'2022-04-13',
        //     'items': [{'item_code':item.name1, 
        //     'item_name':"izdelek po meri", 
        //     'qty':1,
        //     }]
        
        // };
        // frappe.call({
        //     method: "frappe.client.insert",
        //     args: {"doc": doc}, // use JSON.parse(JSON.stringify(doc)) for parsing to json object
        //     callback: function(r) {
        //         if(r.exc) {
        //             msgprint(__("There were errors."));
        //         } else {
        //             msgprint(__("Document inserted."));
        //         }
        //     }
        // });

        // frappe.db.insert({
        //     doctype: 'Task',
        //     subject: 'New Task'
        // }).then(doc => {
        //     console.log(doc);
        // })
        
         /* frappe.call({
                     method: 'erpcustom.erpcustom.doctype.formis_izracun.formis_izracun.make_sales_order'
                 }).done((r) => {
                    console.log(r)
                }) */

         /*  
          let fi = frappe.get_doc('Formis Izracun', frm.doc.name)
          console.log(fi)
         let doc = frappe.new_doc('Sales Order',{
            
            'customer':fi.stranka
          })
          doc.append('Items', {
            "item_code": "Test",
            
            
        }) */

        
/*
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
                total = total + d.work_total;
                console.log("calculation graviranje" + total)
            })
            let new_total = total
            console.log("new total" + new_total)
            frm.set_value('delo_total', new_total)
        }





    }




})
//IZRAČUNAJ TOTAL
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


})*/
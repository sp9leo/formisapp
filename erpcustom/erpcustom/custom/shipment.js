frappe.ui.form.on("Shipment", {
  onload: function (frm) {
    frm.set_query("embalaza", () => {
      return {
        filters: {
          item_group: "Embalaža",
        },
      };
    });
    (frm.compute_total_weight = function (frm) {
      //seštej vse vrstice delo->graviranje in razrez
      if (frm.doc.shipment_delivery_note) {
        let total = 0;
        frm.doc.shipment_delivery_note.forEach((d) => {
          total = total + d.weight;
          console.log("calculation delo-" + total);
        });
        let new_total = total;
        console.log("new total" + new_total);
        frm.set_value("delivery_note_weight", new_total);
      } else {
        frm.set_value("delivery_note_weight", 0);
      }
    }),
      frm.compute_total_weight(frm);
  },
});

frappe.ui.form.on("Shipment Delivery Note", {
  shipment_delivery_note: function (frm) {
    frm.compute_total_weight(frm);
  },
  shipment_delivery_note_remove: function (frm) {
    frm.compute_total_weight(frm);
  },
});

frappe.ui.form.on("Shipment", {
  onload: function (frm) {
    frm.teza = function (frm) {
      //let emb=200 //pavšal za težo embalaže
      let i = Number(frm.doc.delivery_note_weight);
      if (i < 250) {
        return 250;
      } else if (i > 250 && i < 500) {
        return 500;
      } else if (i > 1000 && i < 2000) {
        return 2000;
      } else if (i > 2000 && i<5000) {
        frappe.show_alert("Teža presega težo za blagovno pismo", 5)
        return 5000;
      }
      else if( i>5000 && i<10000){ return 10000 }
    };
    let t = frm.teza(frm);
    console.log(t);
    frm.set_query("storitev", () => {
      return {
        filters: {
          izvajalec_storitve: frm.doc.dostavna_sluzba,
          teza_do: t,
        },
      };
    });
    frm.set_query("dostavna_sluzba", () => {
        return {
          filters: {
            is_company: 1
                      },
        };
      });
  },
  // storitev: function (frm) {

  //     frappe.call({
  //         method: 'erpcustom.erpcustom.custom.shipment.get_something'
  //     }).done((r) => {
  //         console.log(r)
  //     })
  // }
}),
  frappe.ui.form.on("Shipment", {
    //item price
    storitev: function (frm) {
      let i = frm.doc;
      frappe
        .call({
          method: "erpcustom.erpcustom.custom.shipment.get_dostava_price", // funkcija v py datoteki
          args: {
            //argumenti za py funkcijo
            doctype: "Dostava Cenik",
            name: i.storitev,
          },
        })
        .done((r) => {
          console.log(r);
          //če py funkcija vrne rezultate. Običajno vrne kot "message" --> glej v konzoli
          console.log("liftoff");
          console.log(r);
          frm.set_value({
            shipment_amount: r.message[0], // oglati oklepaj je indeks v arrayu
          });
          frm.set_df_property("storitev", "description", r.message[1]);
        });
    },
  });

frappe.ui.form.on("Shipment", {
  //item price
  embalaza: function (frm) {
    let i = frm.doc;
    frappe
      .call({
        method: "erpcustom.erpcustom.custom.shipment.get_embalaza", // funkcija v py datoteki
        args: {
          //argumenti za py funkcijo
          doctype: "Item",
          name: i.embalaza,
        },
      })
      .done((r) => {
        console.log(r);
        //če py funkcija vrne rezultate. Običajno vrne kot "message" --> glej v konzoli
        console.log("liftoff");
        console.log(r);

        frm.set_df_property(
          "embalaza",
          "description",
          r.message[0] + " " + r.message[1]
        );
      });
  },
});

frappe.ui.form.on('Shipment', {
  refresh: function(frm) {
  let i = frm.doc
    frm.add_custom_button(__('Make Stock Entry'), function(){
      var doc = {
        'doctype' : 'Stock Entry',
        'stock_entry_type': "embalaža",
        'from_warehouse':"Stores - D",
        'items': [{'item_code':i.embalaza, 
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

     
          
        
  }, __("Action"));
  
}
});

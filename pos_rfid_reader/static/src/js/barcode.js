odoo.define('custom_pos_rfid.RFIDBarcodeReader', function(require) {
    "use strict";

    var BarcodeReader = require('point_of_sale.BarcodeReader');
    var { Gui } = require('point_of_sale.Gui');
    var rpc = require('web.rpc');
    console.log("I am working ==========================")
    BarcodeReader.include({
        async scan(code) {
            if (!code) return;

            // RFID detection (numeric only)
            if (/^\d+$/.test(code)) {
                console.log("Processing RFID:", code);
                
                try {
                    // First check local POS DB
                    let partner = this.env.pos.db.get_partner_by_barcode(code);
                    
                    // If not found, query backend
                    if (!partner) {
                        const partners = await rpc.query({
                            model: 'res.partner',
                            method: 'search_read',
                            args: [[['rfid', '=', code]], 
                                   ['id', 'name', 'barcode', 'property_product_pricelist']],
                            limit: 1
                        });

                        if (partners && partners.length > 0) {
                            this.env.pos.db.add_partners(partners);
                            partner = this.env.pos.db.get_partner_by_id(partners[0].id);
                        }
                    }

                    if (partner) {
                        const order = this.env.pos.get_order();
                        if (order) {
                            order.set_partner(partner);
                            order.updatePricelist(partner);
                            return true;
                        }
                    } else {
                        console.warn('Not Have Customer code:', code);
                        this._showErrorNotification(
                            "RFID Not Registered", 
                            "This RFID is not linked to any customer."
                        );              
                    }
                } catch (error) {
                    console.error("RFID scan error:", error);
                    // this.env.pos.chrome.showNotification('Error processing RFID', 'error');
                }
                return;
            }
            
            // Fall back to original barcode handling
            return this._super(code);
        },
        _showErrorNotification: function(title, body) {
            try {
                // Try using the GUI if available
                if (Gui && Gui.showPopup) {
                    Gui.showPopup('ErrorPopup', {
                        title: title,
                        body: body,
                    });
                } 
                // Fallback to Chrome notification
                else if (this.env.pos.chrome && this.env.pos.chrome.showNotification) {
                    this.env.pos.chrome.showNotification(body, 'error');
                }
                // Final fallback to console
                else {
                    console.error(title + ":", body);
                    // Queue notification for when GUI is ready
                    this.env.pos.notifications = this.env.pos.notifications || [];
                    this.env.pos.notifications.push({
                        title: title,
                        message: body,
                        type: 'error'
                    });
                }
            } catch (e) {
                console.error("Failed to show error:", e);
            }
        }
    });
});

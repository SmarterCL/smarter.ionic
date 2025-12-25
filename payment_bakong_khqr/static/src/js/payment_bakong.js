// payment_bakong.js – OWL component placeholder for Odoo POS
odoo.define('payment_bakong.payment_bakong', function (require) {
    'use strict';
    const publicWidget = require('web.public.widget');
    const rpc = require('web.rpc');

    publicWidget.registry.PaymentBakong = publicWidget.Widget.extend({
        selector: '.payment-bakong',
        events: {
            'click .generate-qr': '_onGenerateQR',
        },
        async _onGenerateQR(ev) {
            ev.preventDefault();
            const order = this.env.pos.get_order();
            const amount = order.get_total_with_tax();
            // Call MCP endpoint to generate QR (placeholder URL)
            const result = await rpc.query({
                route: '/bakong/generate_qr',
                params: { amount: amount },
            });
            // Show QR code (simple alert for demo)
            alert('QR Code: ' + result.qr_code);
        },
    });
});

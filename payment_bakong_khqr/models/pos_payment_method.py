# -*- coding: utf-8 -*-
"""Model to extend Odoo POS payment method with QR (Bakong KHQR)."""

from odoo import models, fields, api

class PosPaymentMethodBakong(models.Model):
    _inherit = "pos.payment.method"

    # Enable the QR payment method in POS configuration
    is_bakong_qr = fields.Boolean(string="Bakong QR", default=False)
    bakong_api_key = fields.Char(string="Bakong API Key")
    bakong_merchant_id = fields.Char(string="Bakong Merchant ID")

    @api.model
    def _get_available_payment_methods(self, config_id):
        """Add the QR method to the list of available methods when enabled."""
        methods = super(PosPaymentMethodBakong, self)._get_available_payment_methods(config_id)
        if self.is_bakong_qr:
            methods.append({
                "id": "bakong_qr",
                "name": "Bakong QR",
                "type": "qr",
                "api_key": self.bakong_api_key,
                "merchant_id": self.bakong_merchant_id,
            })
        return methods

# -*- coding: utf-8 -*-
"""Model to store QR payment transactions for Bakong KHQR."""

from odoo import models, fields, api
from datetime import datetime

class PaymentTransactionBakong(models.Model):
    _name = "payment.transaction.bakong"
    _description = "Bakong QR Payment Transaction"

    name = fields.Char(string="Transaction Reference", required=True, copy=False, default=lambda self: self.env['ir.sequence'].next_by_code('payment.transaction.bakong'))
    amount = fields.Float(string="Amount", required=True)
    currency_id = fields.Many2one('res.currency', string='Currency', required=True, default=lambda self: self.env.company.currency_id)
    partner_id = fields.Many2one('res.partner', string='Customer')
    pos_order_id = fields.Many2one('pos.order', string='POS Order')
    state = fields.Selection([
        ('draft', 'Draft'),
        ('pending', 'Pending Validation'),
        ('done', 'Validated'),
        ('error', 'Error')
    ], string='Status', default='draft')
    qr_code = fields.Char(string='QR Code Data')
    created_at = fields.Datetime(string='Created At', default=fields.Datetime.now)
    validated_at = fields.Datetime(string='Validated At')

    def action_send_to_mcp(self):
        """Send QR generation request to MCP and store the returned QR code."""
        for rec in self:
            # Placeholder: call MCP service (to be implemented in MCP endpoint)
            rec.qr_code = f"bakong://{rec.id}"  # mock QR data
            rec.state = 'pending'

    def action_validate(self, validation_result):
        """Update transaction based on MCP validation response."""
        for rec in self:
            if validation_result.get('valid'):
                rec.state = 'done'
                rec.validated_at = fields.Datetime.now()
            else:
                rec.state = 'error'

# -*- coding: utf-8 -*-
{
    "name": "QR Payment Method - Bakong KHQR",
    "version": "1.0.0",
    "summary": "Custom QR payment method for Odoo POS using Bakong KHQR",
    "category": "Point of Sale",
    "author": "SmartBot Team",
    "website": "https://github.com/SmarterCL/smarter.ionic",
    "depends": ["point_of_sale", "base"],
    "data": [
        "views/payment_method_views.xml",
        "views/payment_bakong_templates.xml",
        "static/src/xml/payment_bakong.xml",
        "static/src/js/payment_bakong.js",
    ],
    "installable": True,
    "application": False,
    "license": "LGPL-3",
}

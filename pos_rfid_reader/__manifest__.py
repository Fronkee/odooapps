{
    'name': 'POS RFID Barcode Reader',
    'version': '16.0.1.0.0',
    'category': 'Point of Sale',
    'summary': 'Automatically select a customer in POS using RFID card',
    'description': """
        This module allows users to select customers in the Point of Sale (POS) system 
        by scanning an RFID card. The system will match the RFID with a registered 
        customer and automatically assign them to the POS order.
    """,
    'category': 'Point of Sale',
    'author': 'Rubid Technology',
    'depends': ['point_of_sale','contacts'],
    'data': [
        'views/res_partner_views.xml'
    ],
    'assets': {
        'point_of_sale.assets': [
            'point_of_sale/static/src/js/models.js',
            'pos_rfid_reader/static/src/js/rfid_barcode_reader.js',
        ],
    },
    'installable': True,
    'application': False,
    'price':  '300',
    'currency': 'USD',
    'license': 'LGPL-3',
    'support': 'drezee2000@gmail.com'
}
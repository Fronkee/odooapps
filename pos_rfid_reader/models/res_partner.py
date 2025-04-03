from odoo import models,fields

class PartnerExtension(models.Model):
    _inherit = 'res.partner'
    
    rfid = fields.Char("RFID Number", unique=True)
    
    _sql_constraints = [
        ('unique_rfid', 'unique(rfid)', 'The RFID Number must be unique!'),
    ]
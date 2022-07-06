from xmlrpc import client


HOST = "www.odoo.com" # Host url name
db =  "openerp"  # Name of the database
USER = "fame" # User Name to login database
password = "" # Password to login database
url = 'https://%s/xmlrpc/2/' % (HOST)
common_proxy = client.ServerProxy(url+'common')
object_proxy = client.ServerProxy(url+'object')
uid = common_proxy.login(db,USER,password)
print("Logged in as %s (uid:%d)" % (USER, uid))
# retrieve the list of sale orders ids
sale_order_ids = object_proxy.execute(db, uid, password, 'sale.order', 'search', [])
# use the id to get each sale order's name, state, user_id, amount_total, and print it
for sale_order_id in sale_order_ids:
    sale_order = object_proxy.execute(db, uid, password, 'sale.order', 'read', sale_order_id, ['name', 'state', 'user_id', 'amount_total'])[0]
    # append the sale order's name, state, user_id, amount_total to a csv file
    with open('sale_orders.csv', 'a') as f:
        f.write(sale_order['name'] + ',' + sale_order['state'] + ',' + str(sale_order['user_id'][1]) + ',' + str(sale_order['amount_total']) + '\n')

from xmlrpc import client
# password = "7f25f13bcb3efa3760757e25ff3ef820e7ad58ab"
# username = "kusn" #the user
# dbname = 'openerp'    #the database
# sock = client.ServerProxy('http://www.odoo.com/xmlrpc/')
# print(sock.version())


HOST = "www.odoo.com" # Host url name
db =  "openerp"  # Name of the database
USER = "kusn" # User Name to login database
password = "7f25f13bcb3efa3760757e25ff3ef820e7ad58ab" # Password to login database
url = 'https://%s/xmlrpc/2/' % (HOST)
common_proxy = client.ServerProxy(url+'common')
object_proxy = client.ServerProxy(url+'object')
uid = common_proxy.login(db,USER,password)
print("Logged in as %s (uid:%d)" % (USER, uid))
# working to retrieve records
ids = object_proxy.execute_kw(db, uid, password, 'sale.order', 'search', [[]], {'limit':5})
print(ids)
# record = object_proxy.execute_kw(db, uid, password, 'sale.order', 'read', [ids], {'fields': ['user_id', 'partner_id']})
# print(record)

# groupby sales person
x =[]
print(isinstance(x,(list,tuple)))
record = object_proxy.execute_kw(db, uid, password, 'sale.order', 'read_group', [[], ['user_id'],['date_order']])
print(record[0])

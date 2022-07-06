from xmlrpc import client

HOST = "www.odoo.com" # Host url name
db =  "openerp"  # Name of the database
USER = "kusn" # User Name to login database
password = "" # Password to login database
url = 'https://%s/xmlrpc/2/' % (HOST) # URL to connect to
common_proxy = client.ServerProxy(url+'common') # Proxy for common connection
object_proxy = client.ServerProxy(url+'object') # Proxy for object connection
uid = common_proxy.login(db,USER,password) # User id
print("Logged in as %s (uid:%d)" % (USER, uid))
# working to retrieve records
ids = object_proxy.execute_kw(db, uid, password, 'res.users', 'search', [[('sale_team_id','!=',False)]], {})
# print(ids)
print(len(ids))
user_ids = []
# groupby sales person
record = object_proxy.execute_kw(db, uid, password, 'sale.order', 'read_group', [[('user_id','in',ids),('state','=','sale')], ['user_id','amount_total'],['user_id']],{"offset":0 ,"orderby":'amount_total desc', "lazy":True,"limit":10})
for rec in record:
    print(rec['user_id'],rec['amount_total'])


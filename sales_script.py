from xmlrpc import client

HOST = "www.odoo.com" # Host url name
db =  "openerp"  # Name of the database
USER = "fame" # User Name to login database
password = "" # Password to login database
url = 'https://%s/xmlrpc/2/' % (HOST) # URL to connect to
common_proxy = client.ServerProxy(url+'common') # Proxy for common connection
object_proxy = client.ServerProxy(url+'object') # Proxy for object connection
uid = common_proxy.login(db,USER,password) # User id
print("Logged in as %s (uid:%d)" % (USER, uid))

# working to retrieve records
ids = object_proxy.execute_kw(db, uid, password, 'res.users', 'search', [[('sale_team_id','!=',False)]], {})
user_ids = []

# groupby sales person
records = object_proxy.execute_kw(db, uid, password, 'sale.order', 'read_group', [[('user_id','in',ids),('state','=','sale')], ['user_id','amount_total'],['user_id']],{"offset":0 ,"orderby":'amount_total desc', "lazy":True,"limit":10})

# print out the result to confirm it's right
for record in records:
    print(record['user_id'],record['amount_total'])

# save user_id and amount_total to a csv file
with open('top10salesperson.csv', 'w') as csvfile:
    for record in records:
        user_ids.append(record['user_id'][1])
        csvfile.write(str(record['user_id'][1]) + "," + str(record['amount_total']) + "\n")

# create a new postgresql database and save the data to it
import psycopg2
conn = psycopg2.connect("dbname='salesdashboard' user='admin' host='localhost' password='admin'")
cur = conn.cursor()
cur.execute("CREATE TABLE top10salesperson (user_id INTEGER, amount_total INTEGER)")
for record in records:
    cur.execute("INSERT INTO top10salesperson VALUES (%s,%s)", (record['user_id'][1],record['amount_total']))
conn.commit()
conn.close()




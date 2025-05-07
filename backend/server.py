from flask import Flask
from controladores import home_bp,Musuario,Mproducto,Mventa,Mbodega
from flask_mysqldb import MySQL
from flask_cors import CORS

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'ferromas_db'

CORS(app) #Protege a los usuarios de ataques
mysql = MySQL(app)

@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM usuario")
    data = cur.fetchall()
    cur.close()
    return str(data)

app.register_blueprint(home_bp)
app.register_blueprint(Musuario)
app.register_blueprint(Mproducto)
app.register_blueprint(Mventa)
app.register_blueprint(Mbodega)

if __name__ == "__main__":
    app.run(debug=True)
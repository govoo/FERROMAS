from flask import Flask,Response
from controladores import home_bp,Musuario,Mproducto,Mventa,Mbodega
from flask_mysqldb import MySQL
from flask_cors import CORS
import json

app = Flask(__name__)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'root'
app.config['MYSQL_DB'] = 'ferromas_db'

CORS(app) #Protege a los usuarios de ataques
mysql = MySQL(app)

app.extensions["mysql"] = mysql

@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM usuario")
    data = cur.fetchall()
    cur.close()
    
    # Construimos el JSON de manera ordenada
    usuarios = [
        {
            "id": usuario[0],
            "nombre": usuario[1],
            "segundo_nombre": usuario[2],
            "apellido": usuario[3],
            "correo": usuario[4],
            "telefono": usuario[5]
        }
        for usuario in data
    ]

    # Serializamos manualmente para controlar el orden
    response_data = json.dumps({"usuarios": usuarios}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

app.register_blueprint(home_bp)
app.register_blueprint(Musuario)
app.register_blueprint(Mproducto)
app.register_blueprint(Mventa)
app.register_blueprint(Mbodega)

if __name__ == "__main__":
    app.run(debug=True)
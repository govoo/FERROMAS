from flask import Flask, Response
from controladores import home_bp, Musuario, Mproducto, Mventa, Mbodega
from flask_mysqldb import MySQL
from flask_cors import CORS
import json
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# Configuración de base de datos
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'admin'
app.config['MYSQL_DB'] = 'ferromas_db'

# Habilita CORS para permitir conexiones desde React (localhost:3000)
CORS(app, resources={r"/*": {"origins": "*"}})

# Inicializa MySQL
mysql = MySQL(app)
app.extensions["mysql"] = mysql

# Ruta de prueba directa
@app.route('/')
def index():
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM usuario")
    data = cur.fetchall()
    cur.close()

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

    response_data = json.dumps({"usuarios": usuarios}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

# Registrar los blueprints
app.register_blueprint(home_bp)
app.register_blueprint(Musuario)
app.register_blueprint(Mproducto)
app.register_blueprint(Mventa)
app.register_blueprint(Mbodega)

if __name__ == "__main__":
    app.run(debug=True)

from flask import Blueprint, current_app,Response
import json

Musuario = Blueprint("usuario",__name__)

@Musuario.route("/mantenedor_usuario")
def mantenedor_usuario():
    mysql = current_app.extensions["mysql"]
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
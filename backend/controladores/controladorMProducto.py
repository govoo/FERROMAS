from flask import Blueprint, current_app , Response
import json

Mproducto = Blueprint("producto",__name__)

@Mproducto.route("/mantenedor_producto")
def mantenedor_producto():
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM producto")
    data = cur.fetchall()
    cur.close()
    
    # Construimos el JSON de manera ordenada
    producto = [
        {
            "id": producto[0],
            "nombre_producto": producto[1],
            "precio_producto": producto[2],
            "bodega": producto[3]
        }
        for producto in data
    ]

    # Serializamos manualmente para controlar el orden
    response_data = json.dumps({"producto": producto}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')
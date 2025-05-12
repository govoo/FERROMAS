from flask import Blueprint, current_app,Response
import json

Mbodega = Blueprint("bodega",__name__)

@Mbodega.route("/mantenedor_bodega")
def mantenedor_bodega():
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM bodega")
    data = cur.fetchall()
    cur.close()
    
    # Construimos el JSON de manera ordenada
    bodega = [
        {
            "id": bodega[0],
            "cantidad_producto": bodega[1],
            "fecha_vencimiento": bodega[2].strftime("%d-%m-%Y"),
            "estado_producto": bodega[3]
        }
        for bodega in data
    ]

    # Serializamos manualmente para controlar el orden
    response_data = json.dumps({"bodega": bodega}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')
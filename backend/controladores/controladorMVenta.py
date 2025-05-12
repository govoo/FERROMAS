from flask import Blueprint, current_app, Response
import json

Mventa = Blueprint("venta",__name__)

@Mventa.route("/mantenedor_venta")
def mantenedor_venta():
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM ventas")
    data = cur.fetchall()
    cur.close()
    
    # Construimos el JSON de manera ordenada
    ventas = [
        {
            "id": ventas[0],
            "usuario": ventas[1],
            "cantidad_productos": ventas[2],
            "fecha_venta": ventas[3].strftime("%d-%m-%Y"),
            "total": ventas[4]
        }
        for ventas in data
    ]

    # Serializamos manualmente para controlar el orden
    response_data = json.dumps({"ventas": ventas}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

@Mventa.route("/obtener_ventas", methods = ["GET"])
def obtener_ventas(id):
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
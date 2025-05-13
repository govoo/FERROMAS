from flask import Blueprint, current_app, Response, jsonify, request
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

#GET

@Mbodega.route("/mantenedor_bodega/obtener_bodega", methods = ["GET"])
def obtener_bodega():
    id = request.args.get("id")
    if not id:
        return Response(json.dumps({"error": "Debes proporcionar un ID"}), content_type='application/json', status=400)
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""SELECT * FROM bodega WHERE idBodega = %s""", (id,))
    data = cur.fetchone()
    cur.close()
    bodega = [
        {
            "id": data[0],
            "cantidad_producto": data[1],
            "fecha_vencimiento": data[2].strftime("%d-%m-%Y"),
            "estado_producto": data[3]
        }
    ]
    response_data = json.dumps({"bodegas": bodega}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

#POST

@Mbodega.route("/mantenedor_bodega/crear_bodega", methods = ["POST"])
def crear_bodega():
    data = request.get_json()
    
    # Extraer los valores
    cantidad_productos = data["cantidad_productos"]
    fecha_vencimiento = data["fecha_venta"]
    estado_producto = data["estado_producto"]
    
    # Conectar a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL de inserción
    cur.execute("""
        INSERT INTO bodega (cantidad_producto, fecha_vencimiento, Estado_producto_idEstado_producto)
        VALUES (%s, %s, %s)
    """, (cantidad_productos, fecha_vencimiento, estado_producto))

    # Confirmar la transacción
    mysql.connection.commit()

    # Cerrar el cursor
    cur.close()

    # Devolver una respuesta de éxito
    return jsonify({"mensaje": "Bodega creada exitosamente"}), 201

#DELETE
@Mbodega.route("/mantenedor_bodega/eliminar_bodega", methods = ["DELETE"])
def eliminar_bodega():
    id = request.args.get("id")

    if not id:
        return jsonify({"error": "Falta el ID de la bodega"}), 400
    
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    cur.execute("DELETE FROM ventas WHERE idVentas = %s", (id,))
    
    mysql.connection.commit()
    
    if cur.rowcount == 0:
        return jsonify({"error": "Bodega no encontrada"}), 404

    cur.close()

    return jsonify({"mensaje": "Bodega eliminada exitosamente"}), 200

#UPDATE
@Mbodega.route("/mantenedor_bodega/editar_bodega", methods = ["PUT"])
def editar_bodega():
    id = request.args.get("id")  # Obtener el ID de la venta desde los parámetros de la consulta

    if not id:
        return jsonify({"error": "Falta el ID de la Bodega"}), 400
    
    # Obtener los nuevos valores para la actualización
    cantidad_productos = request.json.get("cantidad_productos")
    fecha_vencimiento = request.json.get("fecha_vencimiento")
    estado_producto = request.json.get("estado_producto")
    
    # Conexión a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL para actualizar la venta
    cur.execute("""
        UPDATE bodega
        SET cantidad_producto = %s, fecha_vencimiento = %s, Estado_producto_idEstado_producto = %s
        WHERE idBodega = %s
    """, (cantidad_productos, fecha_vencimiento, estado_producto, id))
    
    mysql.connection.commit()

    # Verificar si la actualización fue exitosa
    if cur.rowcount == 0:
        return jsonify({"error": "Bodega no encontrada"}), 404

    cur.close()

    return jsonify({"mensaje": "Bodega actualizada exitosamente"}), 200
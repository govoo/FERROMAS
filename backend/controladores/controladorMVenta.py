from flask import Blueprint, current_app, Response, request, jsonify
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

#GET

@Mventa.route("/mantenedor_venta/obtener_venta", methods = ["GET"])
def obtener_venta():
    id = request.args.get("id")
    if not id:
        return Response(json.dumps({"error": "Debes proporcionar un ID"}), content_type='application/json', status=400)
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
    SELECT v.idVentas, u.p_nombre_usuario, v.cantidad_productos, v.fecha_venta, v.total
    FROM ventas v
    JOIN usuario u on (v.Usuario_idUsuario = u.idUsuario)
    WHERE v.idVentas = %s
""", (id,))
    data = cur.fetchone()
    cur.close()
    ventas = [
        {
            "id": data[0],
            "usuario": data[1],
            "cantidad_productos": data[2],
            "fecha_venta": data[3].strftime("%d-%m-%Y"),
            "total": data[4]
        }
    ]
    response_data = json.dumps({"ventas": ventas}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

#POST

@Mventa.route("/mantenedor_venta/crear_venta", methods = ["POST"])
def crear_venta():
    data = request.get_json()
    
    # Extraer los valores
    usuario_id = data["usuario_id"]
    cantidad_productos = data["cantidad_productos"]
    fecha_venta = data["fecha_venta"]
    total = data["total"]
    
    # Conectar a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL de inserción
    cur.execute("""
        INSERT INTO ventas (Usuario_idUsuario, cantidad_productos, fecha_venta, total)
        VALUES (%s, %s, %s, %s)
    """, (usuario_id, cantidad_productos, fecha_venta, total))

    # Confirmar la transacción
    mysql.connection.commit()

    # Cerrar el cursor
    cur.close()

    # Devolver una respuesta de éxito
    return jsonify({"mensaje": "Venta creada exitosamente"}), 201

#DELETE
@Mventa.route("/mantenedor_venta/eliminar_venta", methods = ["DELETE"])
def eliminar_venta():
    id = request.args.get("id")

    if not id:
        return jsonify({"error": "Falta el ID de la venta"}), 400
    
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    cur.execute("DELETE FROM bodega WHERE idBodega = %s", (id,))
    
    mysql.connection.commit()
    
    if cur.rowcount == 0:
        return jsonify({"error": "Venta no encontrada"}), 404

    cur.close()

    return jsonify({"mensaje": "Bodega eliminada exitosamente"}), 200

#UPDATE
@Mventa.route("/mantenedor_venta/editar_venta", methods = ["PUT"])
def editar_venta():
    id = request.args.get("id")  # Obtener el ID de la venta desde los parámetros de la consulta

    if not id:
        return jsonify({"error": "Falta el ID de la venta"}), 400
    
    # Obtener los nuevos valores para la actualización
    cantidad_productos = request.json.get("cantidad_productos")
    fecha_venta = request.json.get("fecha_venta")
    total = request.json.get("total")

    # Validar si los datos son correctos
    if not cantidad_productos or not fecha_venta or not total:
        return jsonify({"error": "Faltan datos para actualizar la venta"}), 400
    
    # Conexión a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL para actualizar la venta
    cur.execute("""
        UPDATE ventas
        SET cantidad_productos = %s, fecha_venta = %s, total = %s
        WHERE idVentas = %s
    """, (cantidad_productos, fecha_venta, total, id))
    
    mysql.connection.commit()

    # Verificar si la actualización fue exitosa
    if cur.rowcount == 0:
        return jsonify({"error": "Venta no encontrada"}), 404

    cur.close()

    return jsonify({"mensaje": "Venta actualizada exitosamente"}), 200
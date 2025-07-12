from flask import Blueprint, current_app, Response, jsonify, request
import json

Mbodega = Blueprint("bodega", __name__)

@Mbodega.route("/mantenedor_bodega")
def mantenedor_bodega():
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT 
            b.idBodega, 
            b.cantidad_producto, 
            b.fecha_vencimiento, 
            b.Estado_producto_idEstado_producto,
            p.nombre_producto
        FROM bodega b
        LEFT JOIN producto p ON p.bodega_idBodega = b.idBodega
    """)
    data = cur.fetchall()
    cur.close()
    
    bodegas = [
        {
            "id": row[0],
            "cantidad_producto": row[1],
            "fecha_vencimiento": row[2].strftime("%d-%m-%Y"),
            "estado_producto": row[3],
            "nombre_producto": row[4] or "Sin producto asignado"
        }
        for row in data
    ]

    return jsonify(bodegas)

@Mbodega.route("/mantenedor_bodega/obtener_bodega", methods=["GET"])
def obtener_bodega():
    id = request.args.get("id")
    if not id:
        return jsonify({"error": "Debes proporcionar un ID"}), 400

    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("SELECT * FROM bodega WHERE idBodega = %s", (id,))
    data = cur.fetchone()
    cur.close()

    bodega = {
        "id": data[0],
        "cantidad_producto": data[1],
        "fecha_vencimiento": data[2].strftime("%d-%m-%Y"),
        "estado_producto": data[3]
    }

    return jsonify({"bodega": bodega})

@Mbodega.route("/mantenedor_bodega/crear_bodega", methods=["POST"])
def crear_bodega():
    data = request.get_json()
    cantidad_productos = data["cantidad_productos"]
    fecha_vencimiento = data["fecha_vencimiento"]
    estado_producto = data["estado_producto"]

    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO bodega (cantidad_producto, fecha_vencimiento, Estado_producto_idEstado_producto)
        VALUES (%s, %s, %s)
    """, (cantidad_productos, fecha_vencimiento, estado_producto))
    mysql.connection.commit()
    cur.close()

    return jsonify({"mensaje": "Bodega creada exitosamente"}), 201

@Mbodega.route("/mantenedor_bodega/eliminar_bodega", methods=["DELETE"])
def eliminar_bodega():
    id = request.args.get("id")
    if not id:
        return jsonify({"error": "Falta el ID de la bodega"}), 400

    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()

    # Eliminar productos asociados a la bodega (nombre correcto de la columna)
    cur.execute("DELETE FROM producto WHERE bodega_idBodega = %s", (id,))

    # Eliminar la bodega
    cur.execute("DELETE FROM bodega WHERE idBodega = %s", (id,))
    
    mysql.connection.commit()
    cur.close()

    return jsonify({"mensaje": "Bodega y productos asociados eliminados exitosamente"}), 200


@Mbodega.route("/mantenedor_bodega/editar_bodega", methods=["PUT"])
def editar_bodega():
    id = request.args.get("id")
    if not id:
        return jsonify({"error": "Falta el ID de la Bodega"}), 400

    cantidad_productos = request.json.get("cantidad_productos")
    fecha_vencimiento = request.json.get("fecha_vencimiento")
    estado_producto = request.json.get("estado_producto")

    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE bodega
        SET cantidad_producto = %s, fecha_vencimiento = %s, Estado_producto_idEstado_producto = %s
        WHERE idBodega = %s
    """, (cantidad_productos, fecha_vencimiento, estado_producto, id))
    mysql.connection.commit()
    cur.close()

    return jsonify({"mensaje": "Bodega actualizada exitosamente"}), 200

from flask import Blueprint, current_app , Response, jsonify, request
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

#GET

@Mproducto.route("/mantenedor_producto/obtener_producto", methods = ["GET"])
def obtener_producto():
    id = request.args.get("id")
    if not id:
        return Response(json.dumps({"error": "Debes proporcionar un ID"}), content_type='application/json', status=400)
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""SELECT * FROM producto WHERE idProducto = %s""", (id,)) 
    data = cur.fetchone()
    cur.close()
    producto = [
        {
            "id": data[0],
            "nombre_producto": data[1],
            "precio_producto": data[2],
            "bodega": data[3]
        }
    ]
    response_data = json.dumps({"productos": producto}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

#POST

@Mproducto.route("/mantenedor_producto/crear_producto", methods=["POST"])
def crear_producto():
    data = request.get_json()

    nombre_producto = data.get("nombre_producto")
    precio_producto = data.get("precio_producto")
    bodega = data.get("bodega_idBodega")

    if not nombre_producto or not precio_producto or not bodega:
        return jsonify({"error": "Faltan datos obligatorios"}), 400

    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()

    # ✅ Comprobar si existe la bodega
    cur.execute("SELECT idBodega FROM bodega WHERE idBodega = %s", (bodega,))
    existe_bodega = cur.fetchone()

    # ✅ Si no existe, crear una bodega predeterminada con ese ID
    if not existe_bodega:
        cur.execute("""
            INSERT INTO bodega (idBodega, cantidad_producto, fecha_vencimiento, Estado_producto_idEstado_producto)
            VALUES (%s, %s, %s, %s)
        """, (bodega, 0, '2099-12-31', 1))

    # ✅ Insertar producto
    cur.execute("""
        INSERT INTO producto (nombre_producto, precio_producto, bodega_idBodega)
        VALUES (%s, %s, %s)
    """, (nombre_producto, precio_producto, bodega))

    mysql.connection.commit()
    cur.close()

    return jsonify({"mensaje": "Producto creado exitosamente"}), 201

#DELETE
@Mproducto.route("/mantenedor_producto/eliminar_producto", methods = ["DELETE"])
def eliminar_producto():
    id = request.args.get("id")

    if not id:
        return jsonify({"error": "Falta el ID del Producto"}), 400
    
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    cur.execute("DELETE FROM producto WHERE idProducto = %s", (id,))
    
    mysql.connection.commit()
    
    if cur.rowcount == 0:
        return jsonify({"error": "Producto no encontrado"}), 404

    cur.close()

    return jsonify({"mensaje": "Producto eliminado exitosamente"}), 200

#UPDATE
@Mproducto.route("/mantenedor_producto/editar_producto", methods=["PUT"])
def editar_producto():
    id = request.args.get("id")
    if not id:
        return jsonify({"error": "Falta el ID del producto"}), 400

    nombre_producto = request.json.get("nombre_producto")
    precio_producto = request.json.get("precio_producto")
    bodega = request.json.get("bodega_idBodega")  # <- CORREGIDO

    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()

    cur.execute("""
        UPDATE producto
        SET nombre_producto = %s, precio_producto = %s, bodega_idBodega = %s
        WHERE idProducto = %s
    """, (nombre_producto, precio_producto, bodega, id))

    mysql.connection.commit()

    if cur.rowcount == 0:
        return jsonify({"error": "Producto no encontrado"}), 404

    cur.close()
    return jsonify({"mensaje": "Producto actualizado exitosamente"}), 200

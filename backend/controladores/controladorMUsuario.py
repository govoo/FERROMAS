from flask import Blueprint, current_app,Response, jsonify, request
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

#GET

@Musuario.route("/mantenedor_usuario/obtener_usuario", methods = ["GET"])
def obtener_producto():
    id = request.args.get("id")
    if not id:
        return Response(json.dumps({"error": "Debes proporcionar un ID"}), content_type='application/json', status=400)
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""SELECT * FROM usuario WHERE idUsuario = %s""", (id,)) 
    data = cur.fetchone()
    cur.close()
    usuarios = [
        {
            "id": data[0],
            "nombre": data[1],
            "segundo_nombre": data[2],
            "apellido": data[3],
            "correo": data[4],
            "telefono": data[5]
        }
    ]
    response_data = json.dumps({"usuarios": usuarios}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

#POST

@Musuario.route("/mantenedor_usuario/crear_usuario", methods = ["POST"])
def crear_producto():
    data = request.get_json()
    
    # Extraer los valores
    nombre = data["nombre"]
    segundo_nombre = data["precio_producto"]
    apellido = data["bodega"]
    correo = data["correo"]
    telefono = data["telefono"]
    
    # Conectar a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL de inserción
    cur.execute("""
        INSERT INTO usuario (p_nombre_usuario, s_nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario)
        VALUES (%s, %s, %s, %s, %s)
    """, (nombre, segundo_nombre, apellido,correo,telefono))

    # Confirmar la transacción
    mysql.connection.commit()

    # Cerrar el cursor
    cur.close()

    # Devolver una respuesta de éxito
    return jsonify({"mensaje": "Usuario creado exitosamente"}), 201

#DELETE
@Musuario.route("/mantenedor_usuario/eliminar_usuario", methods = ["DELETE"])
def eliminar_producto():
    id = request.args.get("id")

    if not id:
        return jsonify({"error": "Falta el ID del usuario"}), 400
    
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    cur.execute("DELETE FROM usuario WHERE idUsuario = %s", (id,))
    
    mysql.connection.commit()
    
    if cur.rowcount == 0:
        return jsonify({"error": "Usuario no encontrado"}), 404

    cur.close()

    return jsonify({"mensaje": "Usuario eliminado exitosamente"}), 200

#UPDATE
@Musuario.route("/mantenedor_usuario/editar_usuario", methods = ["PUT"])
def editar_producto():
    id = request.args.get("id")  # Obtener el ID de la venta desde los parámetros de la consulta

    if not id:
        return jsonify({"error": "Falta el ID del usuario"}), 400
    
    # Obtener los nuevos valores para la actualización
    nombre = request.json.get("nombre")
    segundo_nombre = request.json.get("segundo_nombre")
    apellido = request.json.get("apellido")
    correo = request.json.get("correo")
    telefono = request.json.get("telefono")
    
    # Conexión a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL para actualizar la venta
    cur.execute("""
        UPDATE usuario
        SET p_nombre_usuario = %s, s_nombre_usuario = %s, apellido_usuario = %s, correo_usuario = %s, telefono_usuario = %s
        WHERE idUsuario = %s
    """, (nombre, segundo_nombre, apellido, correo, telefono, id))
    
    mysql.connection.commit()

    # Verificar si la actualización fue exitosa
    if cur.rowcount == 0:
        return jsonify({"error": "Usuario no encontrado"}), 404

    cur.close()

    return jsonify({"mensaje": "Usuario actualizado exitosamente"}), 200
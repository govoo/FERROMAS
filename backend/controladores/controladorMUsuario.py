from flask import Blueprint, current_app,Response, jsonify, request
import json
from flask_cors import CORS

Musuario = Blueprint("usuario",__name__)

CORS(Musuario)

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
            "telefono": usuario[5],
            "contraseña": usuario[6]
        }
        for usuario in data
    ]

    # Serializamos manualmente para controlar el orden
    response_data = json.dumps({"usuarios": usuarios}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

#GET

@Musuario.route("/mantenedor_usuario/obtener_usuario", methods = ["GET"])
def obtener_usuario():
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
            "telefono": data[5],
            "contraseña": data[6]
        }
    ]
    response_data = json.dumps({"usuarios": usuarios}, ensure_ascii=False)
    return Response(response_data, content_type='application/json')

#POST

@Musuario.route("/mantenedor_usuario/crear_usuario", methods = ["POST"])
def crear_usuario():
    data = request.get_json()
    
    # Extraer los valores
    nombre = data["nombre"]
    segundo_nombre = data["segundo_nombre"]
    apellido = data["apellido"]
    correo = data["correo"]
    telefono = data["telefono"]
    clave_usuario = data["contraseña"]
    
    # Conectar a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL de inserción
    cur.execute("""
        INSERT INTO usuario (p_nombre_usuario, s_nombre_usuario, apellido_usuario, correo_usuario, telefono_usuario, clave_usuario)
        VALUES (%s, %s, %s, %s, %s, %s)
    """, (nombre, segundo_nombre, apellido,correo,telefono,clave_usuario))

    # Confirmar la transacción
    mysql.connection.commit()

    # Cerrar el cursor
    cur.close()

    # Devolver una respuesta de éxito
    return jsonify({"mensaje": "Usuario creado exitosamente"}), 201

#DELETE
@Musuario.route("/mantenedor_usuario/eliminar_usuario", methods = ["DELETE"])
def eliminar_usuario():
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
def editar_usuario():
    id = request.args.get("id")  # Obtener el ID de la venta desde los parámetros de la consulta

    if not id:
        return jsonify({"error": "Falta el ID del usuario"}), 400
    
    # Obtener los nuevos valores para la actualización
    nombre = request.json.get("nombre")
    segundo_nombre = request.json.get("segundo_nombre")
    apellido = request.json.get("apellido")
    correo = request.json.get("correo")
    telefono = request.json.get("telefono")
    clave_usuario = request.json.get("contraseña")
    
    # Conexión a la base de datos
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    
    # Ejecutar la consulta SQL para actualizar la venta
    cur.execute("""
        UPDATE usuario
        SET p_nombre_usuario = %s, s_nombre_usuario = %s, apellido_usuario = %s, correo_usuario = %s, telefono_usuario = %s, clave_usuario = %s
        WHERE idUsuario = %s
    """, (nombre, segundo_nombre, apellido, correo, telefono, clave_usuario, id))
    
    mysql.connection.commit()

    # Verificar si la actualización fue exitosa
    if cur.rowcount == 0:
        return jsonify({"error": "Usuario no encontrado"}), 404

    cur.close()

    return jsonify({"mensaje": "Usuario actualizado exitosamente"}), 200

# login
@Musuario.route("/mantenedor_usuario/login_usuario", methods=["POST"])
def login_usuario():
    data = request.get_json()
    correo = data.get("email")
    clave = data.get("password")

    if not correo or not clave:
        return jsonify({"success": False, "message": "Faltan campos"}), 400

    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()

    cur.execute("SELECT * FROM usuario WHERE correo_usuario = %s AND clave_usuario = %s", (correo, clave))
    usuario = cur.fetchone()
    columnas = [col[0] for col in cur.description] if usuario else []
    cur.close()

    if usuario:
        usuario_dict = dict(zip(columnas, usuario))
        return jsonify({"success": True, "usuario": usuario_dict})
    else:
        return jsonify({"success": False, "message": "Correo o clave incorrectos"}), 401
from flask import Blueprint, current_app, Response, jsonify, request
from flask_cors import CORS
import json

Musuario = Blueprint("usuario", __name__)
CORS(Musuario)

# Obtener todos los usuarios con sus roles
@Musuario.route("/mantenedor_usuario", methods=["GET"])
def mantenedor_usuario():
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT u.idUsuario, u.p_nombre_usuario, u.s_nombre_usuario, u.apellido_usuario,
               u.correo_usuario, u.telefono_usuario, u.clave_usuario, u.rol_id, r.nombre_rol
        FROM usuario u
        JOIN rol_usuario r ON u.rol_id = r.idRol_usuario
    """)
    data = cur.fetchall()
    cur.close()

    usuarios = [
        {
            "id": u[0],
            "nombre": u[1],
            "segundo_nombre": u[2],
            "apellido": u[3],
            "correo": u[4],
            "telefono": u[5],
            "contrasena": u[6],
            "rol_id": u[7],
            "rol_nombre": u[8]
        } for u in data
    ]
    return jsonify({"usuarios": usuarios})

# Obtener todos los roles
@Musuario.route("/api/roles", methods=["GET"])
def obtener_roles():
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("SELECT idRol_usuario, nombre_rol FROM rol_usuario")
    data = cur.fetchall()
    cur.close()
    roles = [{"idRol_usuario": r[0], "nombre_rol": r[1]} for r in data]
    return jsonify({"roles": roles})

# Crear usuario
@Musuario.route("/mantenedor_usuario/crear_usuario", methods=["POST"])
def crear_usuario():
    data = request.get_json()
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
        INSERT INTO usuario (p_nombre_usuario, s_nombre_usuario, apellido_usuario,
                             correo_usuario, telefono_usuario, clave_usuario, rol_id)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """, (
        data["nombre"], data["segundo_nombre"], data["apellido"],
        data["correo"], data["telefono"], data["contrasena"],
        data["rol_id"]
    ))
    mysql.connection.commit()
    cur.close()
    return jsonify({"mensaje": "Usuario creado exitosamente"}), 201

# Editar usuario
@Musuario.route("/mantenedor_usuario/editar_usuario", methods=["PUT"])
def editar_usuario():
    id = request.args.get("id")
    if not id:
        return jsonify({"error": "Falta el ID"}), 400

    data = request.get_json()
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("""
        UPDATE usuario SET p_nombre_usuario = %s, s_nombre_usuario = %s,
        apellido_usuario = %s, correo_usuario = %s, telefono_usuario = %s,
        clave_usuario = %s, rol_id = %s WHERE idUsuario = %s
    """, (
        data["nombre"], data["segundo_nombre"], data["apellido"],
        data["correo"], data["telefono"], data["contrasena"],
        data["rol_id"], id
    ))
    mysql.connection.commit()
    cur.close()
    return jsonify({"mensaje": "Usuario actualizado"}), 200

# Eliminar usuario
@Musuario.route("/mantenedor_usuario/eliminar_usuario", methods=["DELETE"])
def eliminar_usuario():
    id = request.args.get("id")
    mysql = current_app.extensions["mysql"]
    cur = mysql.connection.cursor()
    cur.execute("DELETE FROM usuario WHERE idUsuario = %s", (id,))
    mysql.connection.commit()
    cur.close()
    return jsonify({"mensaje": "Usuario eliminado"}), 200

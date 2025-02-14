# filepath: /c:/Users/angel/Desktop/Mali/Proyecto/Backend/app.py
from flask import Flask, request, send_from_directory, jsonify, redirect, url_for
from werkzeug.utils import secure_filename
import os
import qrcode
import uuid

# Configuración
UPLOAD_FOLDER = '/tmp/uploads'
QR_FOLDER = '/tmp/static/qr'
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['QR_FOLDER'] = QR_FOLDER

# Crear carpetas si no existen
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(QR_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "El nombre del archivo está vacío"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        unique_filename = f"{uuid.uuid4()}_{filename}"
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], unique_filename))

        # Generar URL para descargar el archivo
        file_url = url_for('download_file', filename=unique_filename, _external=True)

        # Generar código QR
        qr = qrcode.make(file_url)
        qr_filename = f"{uuid.uuid4()}.png"
        qr.save(os.path.join(app.config['QR_FOLDER'], qr_filename))

        return jsonify({"download_url": file_url, "qr_code_url": url_for('static', filename=f'qr/{qr_filename}', _external=True)})

    return jsonify({"error": "Tipo de archivo no permitido"}), 400

@app.route('/api/link', methods=['POST'])
def generate_qr_from_link():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "No se envió ninguna URL"}), 400

    link = data['url']

    # Generar código QR
    qr = qrcode.make(link)
    qr_filename = f"{uuid.uuid4()}.png"
    qr.save(os.path.join(app.config['QR_FOLDER'], qr_filename))

    return jsonify({"qr_code_url": url_for('static', filename=f'qr/{qr_filename}', _external=True)})

@app.route('/api/uploads/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
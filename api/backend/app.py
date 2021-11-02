from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import json

from PIL import Image
import base64
import io


# All the 1000 imagenet classes
class_labels = 'imagenet_classes.json'

# Read the json
with open('imagenet_classes.json', 'r') as fr:
	json_classes = json.loads(fr.read())

app = Flask(__name__)

# Allow 
CORS(app)

# Path for uploaded images
UPLOAD_FOLDER = 'data/uploads/'
OUTPUT_FOLDER = 'data/result/'

# Allowed file extransions
ALLOWED_EXTENSIONS = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['OUTPUT_FOLDER'] = OUTPUT_FOLDER

@app.route("/")
def hello():
	return "Hello World!"

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
	if request.method == 'POST':
		print("request data", request.data)
		print("request files", request.files)

		# check if the post request has the file part
		if 'file' not in request.files:
			return "No file part"
		file = request.files['file']


		if file and allowed_file(file.filename):
			filename = secure_filename(file.filename)
			file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

	img = Image.open("./data/result/golden.png")
	buffer = io.BytesIO()
	img.save(buffer, 'png')
	buffer.seek(0)
	data = buffer.read()
	data = base64.b64encode(data).decode()

	return f'"data:image/png;base64,{data}"'

	# return send_file( './data/result/golden.png', mimetype='image/png')



if __name__ == "__main__":
	app.run(debug=True)
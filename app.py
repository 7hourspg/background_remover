from flask import Flask, render_template, jsonify, request, send_file
from rembg import remove
from PIL import Image
from io import BytesIO


app = Flask(__name__)


@app.route("/", methods=["GET", "POST"])
def upload_file():
    if request.method == "POST":
        if "file" not in request.files:
            return jsonify({"error": "No file part"})
        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No selected file"})
        if file:
            # input_image = Image.open(file)
            # output_image = remove(input_image)
            # output_image.save("output.png")
            # output_image.show()
            # return jsonify({"success": "File uploaded successfully"})
            input_image = Image.open(file.stream)
            output_image = remove(input_image, post_process_mask=True, post_process_mask_erosion_in_px=2,
                                  post_process_mask_dilation_in_px=4, post_process_mask_smoothing_in_px=0)
            img_byte_arr = BytesIO()
            output_image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            # also show the image preview in the browser
            return send_file(img_byte_arr, mimetype='image/png', as_attachment=True, download_name=file.filename.split('.')[0]+'_bg_removed.png')

    return render_template("index.html")


@app.route("/index")
def index():
    return render_template("landing.html")


if __name__ == '__main__':
    app.run(debug=True, use_reloader=True, port=5000, threaded=True)

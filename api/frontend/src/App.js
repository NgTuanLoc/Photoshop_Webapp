import { useState } from "react";
// import logo from './logo.svg';
import "./App.css";
import axios from "axios";

const App = () => {
  const [previewImageUrl, setPreviewImageUrl] = useState(false);
  const [imageHeight, setImageHeight] = useState(500);
  const [imageFile, setImageFile] = useState(null);
  const [imagePrediction, setImagePrediction] = useState("initialState");

  const generatePreviewImageUrl = (file, callback) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    console.log(previewImageUrl);
    reader.onloadend = (e) => callback(reader.result);
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    setImageFile(file);

    generatePreviewImageUrl(file, (previewImageUrl) => {
      setImagePrediction("");
      setPreviewImageUrl(previewImageUrl);
    });
  };

  // Function for sending image to the backend
  const uploadHandler = (e) => {
    const formData = new FormData();
    formData.append("file", imageFile, "img.png");

    let t0 = performance.now();
    axios
      .post("http://127.0.0.1:5000/upload", formData)
      .then(function (response, data) {
        data = response.data;

        setImagePrediction(data);
        let t1 = performance.now();
        console.log(
          "The time it took to predict the image " +
            (t1 - t0) +
            " milliseconds."
        );
      });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-upload">
          <p>Upload an image for classification</p>

          {/* Button for choosing an image */}
          <div>
            <input type="file" name="file" onChange={handleChange} />
          </div>

          {/* Button for sending image to backend */}
          <div>
            <input type="submit" onClick={uploadHandler} />
          </div>

          {/* Field for previewing the chosen image */}
          <div>
            {previewImageUrl && (
              <img height={imageHeight} alt="" src={previewImageUrl} />
            )}
          </div>

          {/* Text for model prediction */}
          <div>
            {imagePrediction && <p>The model predicted: {imagePrediction}</p>}
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;

function handleFileSelect(evt, imgloader, cvs) {
  let files = evt.target.files; // FileList object

  // Loop through the FileList and upload the first image encountered.
  for (let i = 0, f; (f = files[i]); i++) {
    // Only process image files.
    if (!f.type.match("image.*")) {
      continue;
    } else {
      uploadImage(f, cvs);
    }
  }

  function uploadImage(file, cvs) {
    let fr;

    if (typeof window.FileReader !== "function") {
      console.log("The file API isn't supported on this browser yet.");
      return;
    }

    fr = new FileReader();
    fr.onload = function () {
      imgloader.loadImage(fr.result, cvs);
    };
    fr.readAsDataURL(file);
  }
}

export { handleFileSelect };

const dropArea = document.getElementById("drop-area")
;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}
;["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false)
})
;["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropArea.classList.add("highlight")
}

function unhighlight(e) {
  dropArea.classList.remove("highlight")
}

dropArea.addEventListener("drop", handleDrop, false)

function handleDrop(e) {
  const dt = e.dataTransfer
  const files = dt.files
  handleFiles(files)
}

function handleFiles(files) {
  ;[...files].forEach(uploadFile)
}

function uploadFile(file) {
  const url = "http://your-flask-backend-url/upload" // Replace with your actual backend URL
  const formData = new FormData()

  formData.append("file", file)

  fetch(url, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.qr_code) {
        displayQRCode(data.qr_code)
      } else {
        console.error("Error:", data.error)
        alert("Error generating QR code. Please try again.")
      }
    })
    .catch((error) => {
      console.error("Error:", error)
      alert("Error uploading file. Please try again.")
    })
}

function displayQRCode(qrCodeBase64) {
  const qrCode = document.getElementById("qr-code")
  qrCode.src = "data:image/png;base64," + qrCodeBase64
  qrCode.style.display = "block"
}


document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("drop-zone")
    const fileInput = document.getElementById("fileInput")
    const fileList = document.getElementById("file-list")
    const uploadedFiles = document.getElementById("uploaded-files")
    const dashboardLink = document.getElementById("dashboardLink")
  
    // Prevenir el comportamiento por defecto del navegador
    ;["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, preventDefaults, false)
      document.body.addEventListener(eventName, preventDefaults, false)
    })
  
    // Resaltar la zona de soltar cuando se arrastra un archivo sobre ella
    ;["dragenter", "dragover"].forEach((eventName) => {
      dropZone.addEventListener(eventName, highlight, false)
    })
    ;["dragleave", "drop"].forEach((eventName) => {
      dropZone.addEventListener(eventName, unhighlight, false)
    })
  
    // Manejar la caída de archivos
    dropZone.addEventListener("drop", handleDrop, false)
  
    // Manejar la selección de archivos mediante clic
    dropZone.addEventListener("click", () => fileInput.click())
    fileInput.addEventListener("change", handleFiles)
  
    // Simular el cambio al dashboard
    dashboardLink.addEventListener("click", (e) => {
      e.preventDefault()
      alert("Navegando al Dashboard (funcionalidad no implementada)")
    })
  
    function preventDefaults(e) {
      e.preventDefault()
      e.stopPropagation()
    }
  
    function highlight() {
      dropZone.classList.add("bg-blue-400", "border-white")
    }
  
    function unhighlight() {
      dropZone.classList.remove("bg-blue-400", "border-white")
    }
  
    function handleDrop(e) {
      const dt = e.dataTransfer
      const files = dt.files
      handleFiles(files)
    }
  
    function handleFiles(files) {
      files = Array.from(files)
      files.forEach(uploadFile)
      fileList.classList.remove("hidden")
    }
  
    function uploadFile(file) {
      const li = document.createElement("li")
      li.className = "flex justify-between items-center"
      li.innerHTML = `
        <span>${file.name}</span>
        <button onclick="readFile(this)" class="custom-button">Leer</button>
      `
      li.dataset.file = JSON.stringify(file)
      uploadedFiles.appendChild(li)
    }
  
    // Función global para leer el archivo
    window.readFile = (button) => {
      const li = button.parentElement
      const file = JSON.parse(li.dataset.file)
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log("Contenido del archivo:", e.target.result)
        alert("Contenido del archivo mostrado en la consola")
      }
      reader.readAsText(file)
    }
  })
  
  
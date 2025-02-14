"use client"
import React from 'react';
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"

export default function FileDropPage() {
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log("Contenido del archivo:", e.target?.result)
      alert("Contenido del archivo mostrado en la consola")
    }
    reader.readAsText(file)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-500 to-purple-600 text-white">
      <header className="bg-white bg-opacity-10 p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">DropFile</h1>
          <a href="#" className="hover:underline">
            Dashboard
          </a>
        </nav>
      </header>

      <main className="flex-grow flex justify-center items-center p-8">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-2">Bienvenido a DropFile</h2>
          <p className="text-xl mb-8">Suelta tus archivos y nosotros los procesamos</p>
          <div
            {...getRootProps()}
            className={`p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive ? "border-white bg-blue-400" : "border-gray-300 bg-white text-gray-800"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Suelta los archivos aquí...</p>
            ) : (
              <p>Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos</p>
            )}
          </div>
          {files.length > 0 && (
            <div className="mt-8 bg-white text-gray-800 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4">Archivos cargados:</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{file.name}</span>
                    <button
                      onClick={() => readFile(file)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                    >
                      Leer
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-white bg-opacity-10 p-4 text-center">
        <p>© 2023 DropFile. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}


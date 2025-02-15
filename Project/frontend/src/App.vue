<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">File to QR Code Converter</h1>
      
      <div
        @dragenter.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        @dragover.prevent
        @drop.prevent="onDrop"
        :class="[
          'border-dashed border-2 rounded-lg p-8 text-center transition-all duration-300 ease-in-out',
          dragover ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 bg-gray-50'
        ]"
      >
        <input
          type="file"
          ref="fileInput"
          @change="onFileSelected"
          class="hidden"
          accept="*/*"
        />
        <div v-if="!file">
          <icon-upload class="mx-auto h-12 w-12 text-gray-400" />
          <p class="mt-2 text-sm text-gray-600">
            Drag and drop a file here, or
            <button @click="$refs.fileInput.click()" class="font-medium text-indigo-600 hover:text-indigo-500">
              click to select a file
            </button>
          </p>
        </div>
        <div v-else class="text-sm text-gray-600">
          <p>Selected file: {{ file.name }}</p>
          <button @click="resetFile" class="mt-2 text-indigo-600 hover:text-indigo-500">
            Choose a different file
          </button>
        </div>
      </div>

      <button
        @click="uploadFile"
        :disabled="!file || loading"
        :class="[
          'mt-6 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
          !file || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        ]"
      >
        {{ loading ? 'Generating QR Code...' : 'Generate QR Code' }}
      </button>

      <div v-if="qrCode" class="mt-6">
        <img :src="qrCode" alt="QR Code" class="mx-auto max-w-full h-auto" />
        <button
          @click="downloadQR"
          class="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Download QR Code
        </button>
      </div>

      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { IconUpload } from '@iconify/vue';

const fileInput = ref(null);
const file = ref(null);
const dragover = ref(false);
const loading = ref(false);
const qrCode = ref(null);
const error = ref(null);

const onDrop = (e) => {
  dragover.value = false;
  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile) {
    file.value = droppedFile;
  }
};

const onFileSelected = (e) => {
  const selectedFile = e.target.files[0];
  if (selectedFile) {
    file.value = selectedFile;
  }
};

const resetFile = () => {
  file.value = null;
  qrCode.value = null;
  error.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

const uploadFile = async () => {
  if (!file.value) return;

  loading.value = true;
  error.value = null;
  qrCode.value = null;

  const formData = new FormData();
  formData.append('file', file.value);

  try {
    const response = await fetch('https://vercel.com/angels-projects-a7a85b06/generador-qr-back/DVLf6mQZQwe9Jh5cFsVFsC7b1y3F', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.qr_code) {
      qrCode.value = `data:image/png;base64,${data.qr_code}`;
    } else {
      throw new Error(data.error || 'Failed to generate QR code');
    }
  } catch (err) {
    error.value = err.message || 'An error occurred while generating the QR code';
  } finally {
    loading.value = false;
  }
};

const downloadQR = () => {
  if (!qrCode.value) return;

  const link = document.createElement('a');
  link.href = qrCode.value;
  link.download = 'qr-code.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
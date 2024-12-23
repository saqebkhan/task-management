<template>
  <div
    v-if="!store.isLoading"
    class="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg"
  >
    <h2 class="text-2xl font-semibold text-gray-900 mb-6 text-center">
      Create an Account
    </h2>
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700">
        Name<span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="name"
        placeholder="Your Name"
        v-model="name"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <label for="username" class="block text-sm font-medium text-gray-700">
        Username<span class="text-red-500">*</span>
      </label>
      <input
        type="text"
        id="username"
        placeholder="Your Username"
        v-model="username"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <label for="email" class="block text-sm font-medium text-gray-700">
        Email<span class="text-red-500">*</span>
      </label>
      <input
        type="email"
        id="email"
        placeholder="Your Email"
        v-model="email"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <label for="contactNumber" class="block text-sm font-medium text-gray-700">
        Contact Number
      </label>
      <input
        type="text"
        id="contactNumber"
        placeholder="Your Contact Number"
        v-model="contactNumber"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <label for="password" class="block text-sm font-medium text-gray-700">
        Password<span class="text-red-500">*</span>
      </label>
      <input
        type="password"
        id="password"
        placeholder="Your Password"
        v-model="password"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <label for="image" class="block text-sm font-medium text-gray-700">
        Profile Picture (Optional)
      </label>
      <input
        type="file"
        id="image"
        accept="image/*"
        @change="handleImageUpload"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
      />
      <p v-if="imagePreview" class="mt-2 text-sm text-gray-500">
        <img :src="imagePreview" alt="Image Preview" class="w-24 h-24 object-cover rounded-md" />
      </p>
    </div>

    <p v-if="errorMessage" class="text-red-500 text-sm mt-2">
      {{ errorMessage }}
    </p>

    <button
      @click="register"
      class="w-full mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
    >
      Register
    </button>

    <div class="mt-4 text-center">
      <span class="text-sm text-gray-600">Already have an account?</span>
      <router-link
        :to="{ name: RouteNames.LOGIN }"
        class="text-indigo-600 hover:underline"
        >Login here</router-link
      >
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { RouteNames } from "@/router";
import { useRouter } from "vue-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useStore } from "@/store";

const store = useStore();
const router = useRouter();
const email = ref("");
const errorMessage = ref("");
const password = ref("");
const name = ref("");
const username = ref("");
const contactNumber = ref("");
const image = ref(null);
const imagePreview = ref("");

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    image.value = file;
    const reader = new FileReader();
    reader.onload = () => {
      imagePreview.value = reader.result;
    };
    reader.readAsDataURL(file);
  } else {
    errorMessage.value = "Please upload a valid image file.";
  }
};

const register = () => {
  if (password.value.length < 6) {
    errorMessage.value = "Password should be at least 6 characters";
    return;
  }
  if (name.value.length < 3) {
    errorMessage.value = "Name should be at least 3 characters";
    return;
  }
  if (username.value.length < 3) {
    errorMessage.value = "Username should be at least 3 characters";
    return;
  }

  store.isLoading = true;
  createUserWithEmailAndPassword(getAuth(), email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user, "Successfully registered");
      router.push({ name: RouteNames.LOGIN });
      store.toast = {
        isVisible: true,
        message: "Successfully registered",
        type: "success",
      };
    })
    .catch((error) => {
      const errorCode = error.code;
      errorMessage.value = error.message;
      console.log(errorCode, errorMessage.value, "ERROR");
    })
    .finally(() => {
      store.isLoading = false;
    });
};
</script>

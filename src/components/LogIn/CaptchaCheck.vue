<template>
    <div class="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <label
        for="captcha-answer"
        class="block text-lg font-semibold text-gray-900 mb-2"
      >
        What is {{ num1 }} {{ operationSymbol }} {{ num2 }}?
      </label>
  
      <div class="flex items-center mb-4">
        <input
          v-model="userAnswer"
          type="number"
          id="captcha-answer"
          placeholder="Enter your answer"
          class="w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
          v-if="!captchaValidated"
        />
        <button
          @click="checkCaptcha"
          v-if="!captchaValidated"
          class="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
        >
          Submit
        </button>
  
        <div v-if="captchaValidated" class="flex items-center text-green-600 mt-2">
          <CheckCircleIcon class="w-5 h-5 mr-2" />
          <span>Verified Human</span>
        </div>
      </div>
  
      <p v-if="captchaError" class="text-red-500 text-sm mt-2">
        Incorrect answer, please try again!
      </p>
    </div>
  </template>
  
  <script>
  import { CheckCircleIcon } from "@heroicons/vue/24/outline";
  
  export default {
    data() {
      return {
        num1: this.getRandomNumber(),
        num2: this.getRandomNumber(),
        operation: "+",
        operationSymbol: "+",
        userAnswer: "",
        captchaError: false,
        captchaValidated: false,
        correctAnswer: 0,
      };
    },
    components: {
      CheckCircleIcon,
    },
    created() {
      this.correctAnswer = this.getCorrectAnswer();
    },
    methods: {
      getRandomNumber() {
        return Math.floor(Math.random() * 20) + 1;
      },
      checkCaptcha() {
        if (parseInt(this.userAnswer) === this.correctAnswer) {
          this.captchaError = false;
          this.captchaValidated = true;
          this.$emit("captcha-validated", true);
        } else {
          this.captchaError = true;
          this.$emit("captcha-validated", false);
        }
      },
      getCorrectAnswer() {
        return this.num1 + this.num2;
      },
    },
  };
  </script>
  
  <style scoped>
  input {
    margin-right: 10px;
  }
  </style>
  
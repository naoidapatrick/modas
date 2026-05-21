<template>
  <div class="story-container" ref="container">
    <ThuringiaStory v-if="template === 'thuringia'" :data="storyData" :mode="mode" :columnLabelMap="columnLabelMap" :categoryColours="categoryColours" />
    <VRRStory v-else-if="template === 'vrr'" :data="storyData" :mode="mode" :columnLabelMap="columnLabelMap" :categoryColours="categoryColours" />
    <DresdenStory v-else-if="template === 'dresden'" :data="storyData" :mode="mode" :columnLabelMap="columnLabelMap" :categoryColours="categoryColours" />
    <div v-else class="loading">Loading story...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Streamlit } from "streamlit-component-lib";
import ThuringiaStory from "@components/Thuringia/ThuringiaApp.vue";
import VRRStory from "@components/VRR/VRRApp.vue";
import DresdenStory from "@components/Dresden/DresdenApp.vue";

const storyData = ref(null);
const columnLabelMap = ref({});
const mode = ref("view");
const template = ref(null);
const categoryColours = ref(null);

Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, (event) => {
  const args = event.detail.args;
  if (args.data) storyData.value = args.data;
  if (args.mode) mode.value = args.mode;
  if (args.template) template.value = args.template;
  if (args.columnLabelMap) {
    columnLabelMap.value = args.columnLabelMap ?? {};
    console.log("Received columnLabelMap:", args.columnLabelMap);
  }
  if (args.categoryColours) categoryColours.value = args.categoryColours;
  // Set iframe to full viewport height
  Streamlit.setFrameHeight(window.screen.height - 250);
});

onMounted(() => {
  Streamlit.setComponentReady();
  Streamlit.setFrameHeight(window.screen.height - 250);
});
</script>

<style>
.story-container {
  width: 100%;
  height: 100vh;
  overflow-y: auto;
}
</style>
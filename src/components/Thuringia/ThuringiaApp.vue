<script setup>
import { ref, onMounted, onUnmounted, watch, computed, toRef } from 'vue';
import { getScrollRange, selectedColour } from '@src/composables/utils.js';
import { useUIControls } from '@src/composables/Thuringia/useUIControls.js';
import { useMapControls } from '@src/composables/Thuringia/useMapControls.js';
import { computeStats } from '@composables/Thuringia/useDataProcessing.js';
import { useColumnLabels } from '@composables/useColumnLabels.js';

import ArrowChart from '@src/components/Thuringia/ArrowChart.vue';
import HeaderRange from '@src/components/Thuringia/HeaderRange.vue';
import TextRange from '@src/components/Thuringia/TextRange.vue';
import LeafletMap from '@src/components/Thuringia/LeafletMap.vue';
import MapSVG from '@src/components/Thuringia/MapSVG.vue';
import SpeechBubble from '@src/components/Thuringia/SpeechBubble.vue';
import SideMenu from '@src/components/SideMenu.vue';
import EditableTextField from '@src/components/EditableTextField.vue';

const props = defineProps({
  data: { type: Array, default: () => [] },
  columnLabelMap: { type: Object, default: () => ({}) },
  mode: { type: String, default: 'view' },
  categoryColours: { type: Object, default: () => [] },
});

const stats = ref(null);
const statsPercentages = ref(null);
const rawData = ref([]);
const currentRange = ref(0);
const arrowVisible = ref(false);
const showMapScrollytelling = ref(false);
const showMapScrollytelling2 = ref(false);
const showMapButton = ref(false);
const showMapOverlay = ref(false);
const initMidElement = ref(null);
const headerRangeRef = ref(null);
const textRangeRef = ref(null);
const arrowChartRef = ref(null);
const scrollContainer = ref(null);
const activeMode = ref('view');
const isPresenting = ref(false);
const scrollY = ref(0);
let handleScroll = null;

const textFields = ref({
  first: "Unser Rathaus hat nur wenige Haltestellen innerhalb von 300m. \n\nUnd was bedeutet das für Inge?",
  second: "Ein genauerer Blick auf die Karte zeigt, in welchen Teilen des Landes Rathäuser gut erreichbar sind und wo der öffentliche Nahverkehr eher Lücken aufweist.",
  third: "Wirklich abgehängt ist kaum ein Rathaus. Nur 7 Prozent liegen weiter als 300 Meter von der nächsten Haltestelle entfernt. Das heißt aber auch: Für einige bleibt der Weg zur Bushaltestelle ein kleiner Spaziergang.",
  forth: "Erkunden Sie selbst, wie gut Thüringens Rathäuser erreichbar sind. \nNutzen Sie die Filter und klicken Sie auf die Marker für Details.",
})

const { visibleLayers, handleMapReady, handleMarkerClick, handleLayerToggle } = useMapControls();

const { showMainUI, hideMainUI, initializeUI, showMapImgUI, mapUI } = useUIControls();

const { col } = useColumnLabels(toRef(props, "columnLabelMap"));

const handleModeChange = (newMode) => {
  if (newMode === "presenter") {
    activeMode.value = "view";
    const storyContainer = document.querySelector('.thuringia-app');
    if (storyContainer?.requestFullscreen) {
      storyContainer.requestFullscreen();
      isPresenting.value = true;
    }
  } else {
    activeMode.value = newMode;
  }
};

const exitPresenter = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
  isPresenting.value = false;
  activeMode.value = "view";
};

watch(
  () => props.columnLabelMap,
  (map) => {
    console.log("columnLabelMap updated:", map);
    if (!map || Object.keys(map).length === 0) return;

    const cityCol = col("townhall_city", "Stadt");
    const townhallCol = col("townhall_name", "Rathäuser");
    const stops300Col = col("stops_within_300m", "Haltestellen (300m)");
  },
  { immediate: true }
);

console.log("props.columnLabelMap at mount:", props.columnLabelMap);

watch(scrollY, (newScrollY) => {
  console.log("scrollY changed:", newScrollY)
  if (!initMidElement.value) return;

  const windowHeight = window.innerHeight;
  const initMidRect = initMidElement.value.getBoundingClientRect();
  const initMidOutOfView = initMidRect.bottom <= 0;

  if (initMidOutOfView) {
    const initMidHeight = initMidElement.value.offsetHeight + initMidElement.value.offsetTop;
    const scrollAfterInitMid = Math.max(0, newScrollY - initMidHeight);
    const newRange = getScrollRange(scrollAfterInitMid, windowHeight);

    if (newRange === 3) {
      arrowVisible.value = false;
      showMapScrollytelling.value = true;
      showMapScrollytelling2.value = false;
      showMapButton.value = false;
      showMapImgUI();
      mapUI();
    } else if (newRange === 4) {
      arrowVisible.value = false;
      showMapScrollytelling.value = false;
      showMapScrollytelling2.value = true;
      showMapButton.value = false;
      mapUI();
    } else if (newRange === 5) {
      arrowVisible.value = false;
      showMapScrollytelling.value = false;
      showMapScrollytelling2.value = false;
      showMapButton.value = true;
      showMapImgUI();
      mapUI();
    } else {
      arrowVisible.value = true;
      showMapScrollytelling.value = false;
      showMapScrollytelling2.value = false;
      showMapButton.value = false;
      currentRange.value = newRange;
      showMainUI(newRange, headerRangeRef, textRangeRef, arrowChartRef);
    }
  } else {
    arrowVisible.value = false;
    showMapScrollytelling.value = false;
    showMapScrollytelling2.value = false;
    showMapButton.value = false;
    currentRange.value = 0;
    hideMainUI(headerRangeRef, textRangeRef, arrowChartRef);
  }
}, {
  immediate: true // Run immediately onmount
});

watch(
  () => props.data,
  (newData) => {
    console.log("props.data changed:", Array.isArray(newData) ? newData.length : newData);

    if (!newData || !Array.isArray(newData) || newData.length === 0) {
      stats.value = null;
      statsPercentages.value = null;
      rawData.value = [];
      return;
    }

    const rawData_parsed = newData.map(d => ({
      id: +d.id,
      townHall: d.townhall_name || '',
      city: d.townhall_city || '',
      street: d.townhall_street || '',
      latitude: +d.townhall_latitude || 0,
      longitude: +d.townhall_longitude || 0,
      stops100m: +d.stops_within_100m || 0,
      stops200m: +d.stops_within_200m || 0,
      stops300m: +d.stops_within_300m || 0,
    }));

    rawData.value = rawData_parsed;

    try {
      const out = computeStats(rawData_parsed);
      stats.value = out.stats;
      statsPercentages.value = out.statsPercentages;
      console.log("stats computed OK:", stats.value);
    } catch (e) {
      console.error("computeStats failed:", e);
      stats.value = null;
      statsPercentages.value = null;
    }
  },
  { immediate: true }
);

watch(() => props.data, (d) => {
  console.log("props.data updated rows:", Array.isArray(d) ? d.length : "not array");
}, { immediate: true });

const scrollHeight = computed(() => {
  if (!scrollContainer.value) return 0;
  return scrollContainer.value.scrollHeight - scrollContainer.value.clientHeight;
});

onMounted(async () => {
  initializeUI();

  handleScroll = () => {
    scrollY.value = scrollContainer.value?.scrollTop ?? window.scrollY;
  };

  if (scrollContainer.value) {
    scrollContainer.value.addEventListener('scroll', handleScroll, { passive: true });
  }
  window.addEventListener('scroll', handleScroll, { passive: true });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement) isPresenting.value = false;
  });
});

onUnmounted(() => {
  scrollContainer.value?.removeEventListener('scroll', handleScroll);
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="thuringia-app" ref="scrollContainer">
    <SideMenu v-if="!isPresenting" :active-mode="activeMode" :default-gradient="{
      angle: 180,
      stops: [{ color: '#c5b0ff', position: 0 }, { color: '#ffffff', position: 100 }]
    }" @mode-change="handleModeChange" />
    <button v-if="isPresenting" class="exit-presenter" @click="exitPresenter">Präsentationsansicht beenden</button>
    <div class="scroll-wrapper" :style="{ height: `${scrollHeight}px` }">
      <div class="init-mid" ref="initMidElement">
        <EditableTextField v-model="textFields.first" :active-mode="activeMode" :rows="7" :width="`60%`"
          :font-size="`36px`" :line-height="1.3" :padding="`3vh`" />
      </div>
    </div>
    <div class="main" :style="{ '--selectedColour': selectedColour }">
      <div class="above-ground">
        <div class="cityHall">
          <img src="@img/Thuringia/Clouds.png" alt="Clouds" id="cloudsImage" />
          <img src="@img/Thuringia/Rathaus.png" alt="Rathaus" id="cityHallImage" />
        </div>
        <div class="arrow" :class="{ visible: arrowVisible }" v-if="arrowVisible">
          <ArrowChart v-if="stats" ref="arrowChartRef" :stats="stats" :currentRange="currentRange"
            :active-mode="activeMode" :categoryColours="props.categoryColours" />
          <HeaderRange ref="headerRangeRef" :stats="stats" :stats-percentages="statsPercentages"
            :currentRange="currentRange" v-if="stats" :active-mode="activeMode"
            :columnLabelMap="props.columnLabelMap" />
        </div>
        <div class="character">
          <img src="@img/Thuringia/Bus_Stop.png" alt="Bus Stop" id="busStopImage" />
          <img src="@img/Thuringia/Bus.png" alt="Bus" id="busImage" />
          <SpeechBubble :arrow-range="currentRange" v-if="arrowVisible" />
          <img src="@img/Thuringia/Inge.png" alt="Inge" id="ingeImage" />
        </div>
        <div v-if="showMapScrollytelling" class="map-scrollytelling">
          <div class="map-intro">
            <EditableTextField v-model="textFields.second" :active-mode="activeMode" :rows="12" :width="`100%`"
              :font-size="`24px`" :line-height="1.8" :padding="`5vh`" />
          </div>
          <div class="svg-map-container">
            <MapSVG :csv-data="stats?.stops_within_300m" />
          </div>
        </div>
        <div v-if="showMapScrollytelling2" class="map-scrollytelling-2">
          <div class="map-intro">
            <EditableTextField v-model="textFields.third" :active-mode="activeMode" :rows="12" :width="`100%`"
              :font-size="`24px`" :line-height="1.8" :padding="`5vh`" />
          </div>
          <div class="svg-map-container">
            <MapSVG :csv-data="stats?.townhallsWithoutStopsWithin300m" :color-fill="'#E14A2C'" />
          </div>
        </div>
        <div v-if="showMapButton" class="pre-map-view">
          <div class="map-intro">
            <EditableTextField v-model="textFields.forth" :active-mode="activeMode" :rows="5" :width="`100%`"
              :font-size="`28px`" :line-height="1.8" :padding="`5vh`" />
          </div>
          <button class="open-map-btn" @click="showMapOverlay = true">Erkunden Sie die
            Karte</button>
        </div>
      </div>
      <div class="ground-content">
        <TextRange ref="textRangeRef" :stats="stats" :currentRange="currentRange" v-if="stats && arrowVisible"
          :active-mode="activeMode" :columnLabelMap="props.columnLabelMap" />
      </div>
      <div v-if="showMapOverlay" class="map-overlay">
        <LeafletMap :data="rawData" :stats="stats" :visible-layers="visibleLayers" @map-ready="handleMapReady"
          @marker-click="handleMarkerClick" @layer-toggle="handleLayerToggle" @close="showMapOverlay = false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.thuringia-app {
  height: 100vh;
  overflow-y: auto;
}

p {
  text-align: center;
  font-size: 18px;
}

.main {
  height: 30vh;
  background-color: #E8DFC5;
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0px;
  overflow: visible;
  z-index: 3;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  transition: height 0.8s ease-in-out;
}

.above-ground {
  position: absolute;
  bottom: 100%;
  left: 0;
  width: 100%;
  height: 70vh;
  z-index: 4;
  opacity: 1;
  transition: opacity 0.2s ease-out;
  pointer-events: none;
}

.cityHall,
.arrow,
.character {
  position: absolute;
  bottom: 0;
}

.cityHall {
  left: 0;
  width: 25%;
  height: 70vh;
  margin: 0px 15px;
  z-index: 2;
}

.cityHall img {
  width: 100%;
  left: 0;
}

.cityHall img,
.character img {
  position: absolute;
  bottom: 0;
}

#cloudsImage {
  bottom: 40%;
}

.character {
  right: 0;
  width: 25%;
  height: 70vh;
  z-index: 2;
}

.arrow {
  left: calc(25% + 30px);
  width: 50%;
  height: 70vh;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;
  z-index: 2;
}

.ground-content {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.init-mid {
  position: relative;
  width: 50%;
  margin-left: calc(25% + 50% / 5);
  margin-right: calc(100% - (25% + 50% / 5));
  margin-top: 5vh;
  z-index: 10;
  pointer-events: auto;
}

#ingeImage {
  width: calc(30% * 1.2);
  right: 30%;
}

#ingeImage.scrolled {
  width: 30%;
}

#busStopImage {
  width: calc(25% * 1.2);
  left: 0;
}

#busStopImage.scrolled {
  width: 25%;
}

#busImage {
  width: 80%;
  right: 0;
}

#busImage,
#busStopImage {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

#ingeImage,
#busStopImage {
  transition: width 0.8s ease-in-out;
}

.scroll-wrapper {
  min-height: 700vh;
}

.pre-map-view,
.map-scrollytelling,
.map-scrollytelling-2 {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  bottom: 0;
  margin: 0 2%;
}

.pre-map-view {
  align-items: start;
  flex-direction: column;
  margin-left: 5%;
  z-index: 3;
  pointer-events: auto;
}

.svg-map-container {
  position: relative;
  width: auto;
  height: 80%;
  margin-left: 5%;
}

.pre-map-view .map-intro {
  width: 60%;
}

.map-intro {
  width: 45%;
  height: 100%;
  position: relative;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

#mapImage {
  width: 40%;
}

.open-map-btn {
  display: block;
  width: 30%;
  padding: 16px 32px;
  font-size: 1.2rem;
  background: #2b2d42;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 5%;
}

.open-map-btn:hover {
  background: #415a77;
  color: white;
}

.map-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.main.visible,
#busImage.visible,
#busStopImage.visible,
.arrow.visible {
  opacity: 1;
}

.exit-presenter {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #010080;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.40);
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.thuringia-app:fullscreen::backdrop {
  background: linear-gradient(rgba(197, 176, 255, 1),
      rgba(255, 0, 0, 0)) !important;
}

.thuringia-app:fullscreen {
  background: transparent !important;
}

.thuringia-app:-webkit-full-screen,
.thuringia-app:-moz-full-screen,
.thuringia-app:-ms-fullscreen {
  background: transparent !important;
}
</style>
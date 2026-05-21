<script setup>
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { selectedColour, isLongScreen, isLongLongScreen } from '@src/composables/utils.js';
import { useMapUtils } from '@src/composables/Thuringia/useMapUtils.js';

import FilterList from './FilterList.vue';
import HallList from './HallList.vue';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Props for configuration
const props = defineProps({
  center: {
    type: Array,
    default: () => [50.7787, 11.0328]
  },
  zoom: {
    type: Number,
    default: 8
  },
  data: {
    type: Array,
    default: () => []
  },
  stats: {
    type: Object,
    default: () => ({})
  },
  visibleLayers: {
    type: Object,
    default: () => ({
      'range-0-100': true,
      'range-101-200': true,
      'range-201-300': true,
      'townhalls-over-300': true
    })
  }
});

// Emits for parent communication
const emit = defineEmits(['mapReady', 'markerClick', 'layerToggle', 'close']);

let zoomScreenBased = props.zoom;
if (isLongLongScreen()) zoomScreenBased = 9;
else if (isLongScreen()) zoomScreenBased = 8.5;

const mapContainer = ref(null);
let map = null;
let resizeObserver = null;
let layerGroups = {
  'range-0-100': null,
  'range-101-200': null,
  'range-201-300': null,
  'townhalls-over-300': null
};

// Track clicked markers
const selectedMarkerId = ref(null);
const markerMap = ref(new Map()); // Store marker references by ID

const mapUtils = useMapUtils();

const initMap = () => {
  if (!mapContainer.value) return;

  const container = mapContainer.value;

  // Check if container has dimensions before initializing
  const rect = container.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    console.warn('Map container has no dimensions, waiting for resize');
    return;
  }

  map = L.map(container, {
    center: props.center,
    zoom: zoomScreenBased,
    zoomControl: true,
    scrollWheelZoom: true,
    preferCanvas: false
  });

  // Add tile layer (OpenStreetMap)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
    crossOrigin: true
  }).addTo(map);

  console.log('Map initialized with center:', props.center, 'zoom:', zoomScreenBased);

  // Initialize layer groups
  Object.keys(layerGroups).forEach(key => {
    layerGroups[key] = L.layerGroup().addTo(map);
  });

  // Load data if available
  if (props.data && props.data.length > 0) {
    loadMapData();
  }

  emit('mapReady', map);
};

const setupResizeObserver = () => {
  if (!mapContainer.value) return;

  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect;

      if (width > 0 && height > 0) {
        if (!map) {
          initMap();
        } else {
          map.invalidateSize();
        }
      }
    }
  });

  resizeObserver.observe(mapContainer.value);
};

const loadMapData = () => {
  if (!map || !props.data || props.data.length === 0) return;

  // clear existing layers and marker map
  Object.values(layerGroups).forEach(group => group.clearLayers());
  markerMap.value.clear();

  props.data.forEach(item => {
    const townhallLayer = mapUtils.determineTownhallLayer(item);
    const townhallColor = mapUtils.getColorForLayer(townhallLayer);
    const markerId = mapUtils.createMarkerId(item); // Create unique marker ID

    // Use pink color if this marker is currently selected, otherwise use layer color
    const iconColor = mapUtils.isSelected(item, selectedMarkerId.value) ? selectedColour : townhallColor;

    // custom divIcon with inline SVG using the Rathaus design
    const townhallIcon = createIcon(iconColor, mapUtils.isSelected(item, selectedMarkerId.value));

    const townhallMarker = L.marker([item.latitude, item.longitude], {
      icon: townhallIcon
    });

    // Store marker reference for later color changes
    markerMap.value.set(markerId, {
      marker: townhallMarker,
      item: item,
      layer: townhallLayer,
      originalColor: townhallColor
    });

    townhallMarker.on('click', () => {
      // Reset previous selected marker to original color
      if (selectedMarkerId.value && markerMap.value.has(selectedMarkerId.value)) {
        const prevSelected = markerMap.value.get(selectedMarkerId.value);
        const originalIcon = createIcon(prevSelected.originalColor, false);
        prevSelected.marker.setIcon(originalIcon);
      }

      // Set new marker to pink and scale it
      const pinkIcon = createIcon(selectedColour, true);
      townhallMarker.setIcon(pinkIcon);

      // Update selected marker ID
      selectedMarkerId.value = markerId;

      emit('markerClick', {
        ...item,
        type: 'townhall',
        layer: townhallLayer,
        markerId: markerId
      });
    });

    layerGroups[townhallLayer].addLayer(townhallMarker);
  });
};

const createIcon = (color, isSelected = false) => {
  const scale = isSelected ? 1.4 : 1;
  const transition = 'transition: transform 0.2s ease-out;';

  return L.divIcon({
    html: `
      <div style="filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.4)); transform: scale(${scale}); ${transition}">
        <svg width="20" height="35" viewBox="0 0 20 35" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0C4.48 0 0 4.48 0 10C0 17.5 10 35 10 35S20 17.5 20 10C20 4.48 15.52 0 10 0Z" fill="${color}" stroke="white" stroke-width="1.5"/>
          <circle cx="10" cy="10" r="4" fill="white"/>
        </svg>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [20, 35]
  });
};

const resetMarkerColors = () => {
  selectedMarkerId.value = null;
  loadMapData(); // Reload data to reset all markers to original colors
};

const handleHallClick = ({ hall, markerId }) => {
  // Reset previous selected marker to original color
  if (selectedMarkerId.value && markerMap.value.has(selectedMarkerId.value)) {
    const prevSelected = markerMap.value.get(selectedMarkerId.value);
    const originalIcon = createIcon(prevSelected.originalColor, false);
    prevSelected.marker.setIcon(originalIcon);
  }

  // Set new marker to pink and scale it
  if (markerMap.value.has(markerId)) {
    const selectedMarkerData = markerMap.value.get(markerId);
    const pinkIcon = createIcon(selectedColour, true);
    selectedMarkerData.marker.setIcon(pinkIcon);

    // Update selected marker ID
    selectedMarkerId.value = markerId;

    // Pan to the marker on the map
    if (map) {
      map.setView([hall.latitude, hall.longitude], zoomScreenBased * 2);
    }

    emit('markerClick', {
      ...hall,
      type: 'townhall',
      layer: mapUtils.determineTownhallLayer(hall),
      markerId: markerId
    });
  }
};

const handleLayerToggle = (layerKey, isVisible) => {
  emit('layerToggle', layerKey, isVisible);
};

watch(() => props.visibleLayers, (newLayers) => {
  Object.keys(newLayers).forEach(layerKey => {
    if (layerGroups[layerKey]) {
      if (newLayers[layerKey]) {
        map.addLayer(layerGroups[layerKey]);
      } else {
        map.removeLayer(layerGroups[layerKey]);
      }
    }
  });
}, { deep: true });

watch(() => props.data, () => {
  if (map) {
    loadMapData();
  }
}, { deep: true });

onMounted(() => {
  setupResizeObserver();
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  if (map) {
    map.remove();
    map = null;
  }
});

// Expose methods for parent component
defineExpose({
  getMap: () => map,
  fitBounds: (bounds) => map?.fitBounds(bounds),
  setView: (center, zoom) => map?.setView(center, zoom),
  refreshMap: () => {
    if (map) {
      map.invalidateSize();
      map.setView(props.center, zoomScreenBased);
    }
  },
  resetMarkerColors
});
</script>

<template>
  <div class="map-container" :style="{ '--selectedColour': selectedColour }">
    <div class="map-wrapper">
      <div ref="mapContainer" class="leaflet-map"></div>
      <div class="filter-list-overlay">
        <FilterList :data="props.data" :selectedMarkerId="selectedMarkerId" :visibleLayers="props.visibleLayers"
          @layerToggle="handleLayerToggle" />
      </div>
      <button class="close-map-btn" @click="$emit('close')" aria-label="Close Map">&times;</button>
      <div class="hall-list-overlay">
        <HallList :data="props.data" :selectedMarkerId="selectedMarkerId" :visibleLayers="props.visibleLayers"
          @hallClick="handleHallClick" @layerToggle="handleLayerToggle" />
      </div>
    </div>
  </div>
</template>


<style scoped>
.map-container {
  display: flex;
  width: 90%;
  height: 90%;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  margin-bottom: 16px;
}

.map-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  height: 100%;
  align-items: center;
}

.hall-list-overlay,
.filter-list-overlay {
  position: absolute;
  bottom: 30px;
  z-index: 1000;
  pointer-events: auto;
}

.hall-list-overlay {
  height: 25%;
  width: 90%;
}

.filter-list-overlay {
  height: 6%;
  width: 70%;
}

.filter-list-overlay,
.close-map-btn {
  top: 10px;
}

.close-map-btn {
  position: absolute;
  right: 15px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: #fff;
  color: var(--selectedColour);
  border: 2px solid var(--selectedColour);
  border-radius: 50%;
  cursor: pointer;
  z-index: 1100;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
  text-align: center;
}

.close-map-btn:hover {
  background: var(--selectedColour);
  color: #fff;
}

.leaflet-map {
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

:global(.custom-marker) {
  background: transparent;
  border: none;
}

/* Ensure Leaflet controls are visible */
:global(.leaflet-control-zoom) {
  z-index: 1000;
}

:global(.leaflet-control-attribution) {
  z-index: 1000;
}

:global(.leaflet-container) {
  background: #ddd;
  font-size: 12px;
  width: 100%;
  height: 100%;
}

:global(.leaflet-tile) {
  max-width: none;
}

/* Fix for tiles not loading properly */
:global(.leaflet-tile-pane) {
  z-index: 200;
}

:global(.leaflet-marker-pane) {
  z-index: 600;
}

@media (max-width: 768px) {
  .map-container {
    width: 100%;
    height: 100%;
    margin: 0;
    border-radius: 0;
  }

  .filter-list-overlay {
    height: 13%;
    width: 60%;
  }

  .close-map-btn {
    right: 10px;
    font-size: 1.8rem;
  }
}

@media (min-width: 2560px) {
  .hall-list-overlay {
    height: 27%;
  }

  .close-map-btn {
    width: 60px;
    height: 60px;
    font-size: 45px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
    border-width: 2.5px;
  }
}

@media (min-width: 3440px) {
  .close-map-btn {
    width: 75px;
    height: 75px;
    font-size: 60px;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.8);
    border-width: 3.5px;
  }

}
</style>

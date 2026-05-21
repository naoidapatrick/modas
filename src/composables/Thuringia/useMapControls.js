import { ref } from 'vue';

export function useMapControls() {
  // Map legend state
  const visibleLayers = ref({
    'range-0-100': true,
    'range-101-200': true,
    'range-201-300': true,
    'townhalls-over-300': true
  });

  // Map event handlers
  const handleMapReady = (mapInstance) => {
    console.log('Map is ready:', mapInstance);
  };

  const handleMarkerClick = (markerData) => {
    console.log('Marker clicked:', markerData);
  };

  const handleLayerToggle = (layerKey, isVisible) => {
    visibleLayers.value[layerKey] = isVisible;
  };

  return {
    visibleLayers,
    handleMapReady,
    handleMarkerClick,
    handleLayerToggle
  };
}

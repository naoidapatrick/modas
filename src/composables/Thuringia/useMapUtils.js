import { selectedColour, mapLayersConfig } from "@src/composables/utils";

export function useMapUtils() {
    const determineTownhallLayer = (townhall) => {
        if (townhall.stops100m > 0) return 'range-0-100';
        if (townhall.stops200m > 0) return 'range-101-200';
        if (townhall.stops300m > 0) return 'range-201-300';
        return 'townhalls-over-300';
    };

    const getColorForLayer = (layer) => {
        return mapLayersConfig[layer]?.color || '#000000';
    };

    const getDistanceText = (hall) => {
        const layer = determineTownhallLayer(hall);
        return mapLayersConfig[layer]?.label;
    };

    const createMarkerId = (item) => `id-${item.id}`;

    const isSelected = (hall, selectedMarkerId) => {
        const markerId = createMarkerId(hall);
        return selectedMarkerId === markerId;
    }

    return {
        determineTownhallLayer,
        getColorForLayer,
        getDistanceText,
        createMarkerId,
        isSelected
    };
}
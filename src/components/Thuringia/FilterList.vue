<script setup>
import { ref, computed, watch } from 'vue';
import { mapLayersConfig } from '@src/composables/utils.js';
import { useMapUtils } from '@composables/Thuringia/useMapUtils.js';

const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    selectedMarkerId: {
        type: String,
        default: null
    },
    visibleLayers: {
        type: Object,
        default: () => ({})
    }
});

const emit = defineEmits(['hallClick', 'layerToggle']);

// Generate legend items from config
const legendItems = computed(() => {
    return Object.entries(mapLayersConfig).map(([key, config]) => ({
        key,
        ...config,
        isVisible: props.visibleLayers[key]
    }));
});

const toggleLayer = (layerKey, isVisible) => {
    emit('layerToggle', layerKey, isVisible);
};
</script>

<template>
    <div class="filter-list">
        <h2>Entfernung von Rathäusern zu Haltestellen</h2>
        <div class="legend-items">
            <div v-for="item in legendItems" :key="item.key" class="legend-item">
                <label :for="item.key" class="legend-checkbox-label">
                    <input type="checkbox" :id="item.key" :checked="item.isVisible"
                        @change="toggleLayer(item.key, $event.target.checked)">
                    <span class="legend-color-checkbox" :style="{ backgroundColor: item.color }"></span>
                    {{ item.label }}
                </label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.filter-list {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 13px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    overflow: hidden;
}

.filter-list h2 {
    font-size: 20px;
    font-weight: 600;
    margin-right: 20px;
    font-family: 'General Sans';
    text-transform: none;
    letter-spacing: normal;
    line-height: normal;
}

.legend-items {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

.legend-checkbox-label {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 0.85rem;
    font-weight: 500;
    gap: 0.5rem;
    cursor: pointer;
    font-family: 'General Sans';
    line-height: normal;
    letter-spacing: normal;
    text-transform: none;
}

.legend-checkbox-label input[type="checkbox"] {
    position: absolute;
    width: 100%;
    height: 100%;
    margin: 0;
    opacity: 0;
    cursor: pointer;
    z-index: 2;
}

.legend-color-checkbox {
    position: relative;
    width: 15px;
    height: 15px;
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    border: 2px solid rgba(0, 0, 0, 0.2);
    border-radius: 3px;
    transition: all 0.2s ease;
}

.legend-color-checkbox::after {
    content: '✓';
    color: white;
    opacity: 0;
    transition: opacity 0.2s ease;
}

.legend-checkbox-label input[type="checkbox"]:checked+.legend-color-checkbox::after {
    opacity: 1;
}

.legend-checkbox-label input[type="checkbox"]:not(:checked)+.legend-color-checkbox {
    opacity: 0.5;
}

.legend-checkbox-label:hover .legend-color-checkbox {
    opacity: 1;
    transform: scale(1.05);
}

@media (max-width: 768px) {
    .filter-list {
        flex-direction: column;
        border-radius: 15px;
        text-align: center;
        padding: 10px 15px;
        justify-content: center;
        align-items: center;
        width: 90%;
        height: 100%;
        margin: 0 auto;
    }

    .filter-list h2 {
        font-size: 14px;
        margin: 0 0 15px 0;
    }

    .legend-items {
        flex-direction: row;
        align-items: center;
        justify-content: start;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .legend-checkbox-label {
        font-size: 12px;
    }

    .legend-color-checkbox {
        width: 13px;
        height: 13px;
        padding: 1.5px;
    }
}

@media (min-width: 2560px) {
    .filter-list {
        border-radius: 15px;
        padding: 8px 0px;
        gap: 1rem;
    }

    .filter-list h2 {
        font-size: 28px;
    }

    .legend-items {
        display: flex;
        flex-direction: row;
        gap: 1.5rem;
    }

    .legend-checkbox-label {
        font-size: 22px;
        gap: 0.6rem;
    }

    .legend-color-checkbox {
        width: 16px;
        height: 16px;
        border: 3px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 5px;
    }
}

@media (min-width: 3440px) {
    .filter-list {
        border-radius: 20px;
        padding: 10px 0px;
        gap: 1.5rem;
    }

    .filter-list h2 {
        font-size: 32px;
    }

    .legend-items {
        display: flex;
        flex-direction: row;
        gap: 1.5rem;
    }

    .legend-checkbox-label {
        font-size: 26px;
        gap: 0.6rem;
    }

    .legend-color-checkbox {
        width: 25px;
        height: 25px;
        border: 3px solid rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 3px;
    }
}
</style>
<script setup>
const props = defineProps({
    years: {
        type: Array,
        default: () => ['2022', '2023', '2024', '2025']
    },
    showMarkers: {
        type: Boolean,
        default: true
    },
    startPoint: {
        type: Number,
        default: 10 // Percentage from left where the timeline starts
    },
    markersGap: {
        type: Number,
        default: 25 // Additional percentage to add to the left position of the last year marker
    }
});
</script>

<template>
    <div class="timeline">
        <div class="arrow-line">
            <div v-if="showMarkers" class="year-markers">
                <div v-for="(year, index) in years" :key="year" class="year-marker" :style="{
                    left: (props.startPoint + (index * props.markersGap)) + '%'
                }">
                    <div class="year-dot"></div>
                    <div class="year-label">{{ year }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.timeline {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 3;
}

.arrow-line {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 10px;
    background-color: black;
}

.year-markers {
    position: absolute;
    width: 100%;
    height: 100%;
}

.year-marker {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 4;
}

.year-dot {
    width: 30px;
    height: 30px;
    background: black;
    border-radius: 50%;
    position: relative;
    top: -10px;
}

.year-label {
    font-size: 1.5rem;
    font-weight: 600;
    color: black;
}

@media (max-width: 768px) {
    .arrow-line {
        top: 0;
        width: 8px;
        height: 80%;
        left: 18%;
    }

    .year-marker {
        flex-direction: row;
        gap: 10px;
        transform: translateX(-80%);
    }

    .year-dot {
        width: 20px;
        height: 20px;
        top: 0;
    }

    .year-label {
        transform: rotate(-90deg);
        font-size: 18px;
    }
}
</style>

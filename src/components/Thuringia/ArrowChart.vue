<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useArrowChart } from '@src/composables/Thuringia/useArrowChart.js';
import { scaleRange, defaultCategoryColours } from '@src/composables/utils.js';
import { Streamlit } from 'streamlit-component-lib';

const props = defineProps({
    stats: {
        type: Object,
        required: true
    },
    currentRange: {
        type: Number,
        default: 0
    },
    activeMode: {
        type: String,
        default: 'view'
    },
    categoryColours: {
        type: Object,
        default: () => []
    }
});

const svgRef = ref(null);
const resolvedColors = computed(() => {
    // if Streamlit didn’t send anything, fallback to defaults
    return (props.categoryColours && Object.keys(props.categoryColours).length === 4) ? props.categoryColours : defaultCategoryColours;
});

const { drawArrow } = useArrowChart();

const redraw = () => {
    if (svgRef.value) {
        drawArrow(svgRef.value, props.stats, props.currentRange, resolvedColors.value);
    }
}

const openEditor = () => {
    Streamlit.setComponentValue({ action: "open_data_editor", currentRange: props.currentRange })
}

onMounted(redraw);

watch(() => props.currentRange, redraw);
watch(() => props.stats, redraw, { deep: true });
watch(resolvedColors, redraw, { deep: true });
</script>

<template>
    <button v-if="activeMode === 'edit'" class="chart-edit-btn" @click.stop="openEditor"
        title="Diagrammdaten bearbeiten" aria-label="Diagrammdaten bearbeiten">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
                d="M12.2358 0.139355C12.1466 0.0501261 12.0255 0 11.8993 0C11.7731 0 11.6521 0.0501261 11.5628 0.139355L9.99501 1.70717L13.5238 5.23595L15.0916 3.66909C15.1359 3.62487 15.1711 3.57235 15.1951 3.51453C15.2191 3.4567 15.2314 3.39471 15.2314 3.3321C15.2314 3.2695 15.2191 3.20751 15.1951 3.14968C15.1711 3.09186 15.1359 3.03934 15.0916 2.99512L12.2358 0.139355ZM12.8508 5.90896L9.322 2.38018L3.1345 8.56768H3.33155C3.45778 8.56768 3.57884 8.61783 3.6681 8.70709C3.75736 8.79635 3.80751 8.91741 3.80751 9.04364V9.5196H4.28347C4.4097 9.5196 4.53076 9.56975 4.62002 9.65901C4.70928 9.74827 4.75943 9.86933 4.75943 9.99557V10.4715H5.23539C5.36163 10.4715 5.48269 10.5217 5.57195 10.6109C5.66121 10.7002 5.71135 10.8213 5.71135 10.9475V11.4235H6.18732C6.31355 11.4235 6.43461 11.4736 6.52387 11.5629C6.61313 11.6521 6.66328 11.7732 6.66328 11.8994V12.0965L12.8508 5.90896ZM5.74182 13.0179C5.72179 12.9647 5.71147 12.9082 5.71135 12.8513V12.3754H5.23539C5.10916 12.3754 4.9881 12.3252 4.89884 12.236C4.80958 12.1467 4.75943 12.0256 4.75943 11.8994V11.4235H4.28347C4.15724 11.4235 4.03617 11.3733 3.94691 11.284C3.85765 11.1948 3.80751 11.0737 3.80751 10.9475V10.4715H3.33155C3.20531 10.4715 3.08425 10.4214 2.99499 10.3321C2.90573 10.2429 2.85558 10.1218 2.85558 9.99557V9.5196H2.37962C2.32272 9.51949 2.2663 9.50917 2.21304 9.48914L2.04264 9.65859C1.99728 9.70426 1.96166 9.75867 1.93793 9.81851L0.0340846 14.5781C-0.00053745 14.6646 -0.0090129 14.7594 0.009709 14.8506C0.0284309 14.9419 0.0735268 15.0257 0.139406 15.0916C0.205285 15.1574 0.289051 15.2025 0.380318 15.2212C0.471584 15.24 0.566339 15.2315 0.652835 15.1969L5.41245 13.293C5.47229 13.2693 5.52669 13.2337 5.57237 13.1883L5.74182 13.0179Z"
                fill="#F3F3F3" />
        </svg>
    </button>
    <div ref="chartContainer" class="arrow-chart" :style="{
        transform: `scaleX(${scaleRange(props.currentRange)})`,
        transformOrigin: 'right center'
    }">
        <svg ref="svgRef" class="svg" :class="{ 'is-edit': activeMode === 'edit' }"></svg>
    </div>
</template>

<style scoped>
.arrow-chart {
    height: 100%;
    width: 100%;
    position: relative;
    transition: transform 0.8s ease-in-out;
}

.svg.is-edit {
    border: 1px dashed #808080;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
}

.chart-edit-btn {
    position: absolute;
    bottom: 10%;
    right: -10px;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #010080;
    color: #F3F3F3;
    border: none;
    place-items: center;
    cursor: pointer;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.40);
    z-index: 5;
    pointer-events: auto !important;
}


.chart-edit-btn:focus {
    outline: none;
}

.chart-edit-btn svg {
    display: block;
}

.svg {
    width: 100%;
    height: 15%;
    position: absolute;
    bottom: 0;
}
</style>

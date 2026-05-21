<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import * as d3 from 'd3';
import EditableTextField from '@src/components/EditableTextField.vue';
import { Streamlit } from 'streamlit-component-lib';

const props = defineProps({
    data: { type: Array, default: () => [] },
    activeMode: { type: String, default: 'view' },
    categoryColours: { type: Object, default: () => ({}) },
    categoryNames: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['pieSliceSelected']);

const arcs = ref([]);
const selectedIndex = ref(0);
const radius = 170;
const expandedRadius = 180;
const colors = computed(() => {
    return (props.categoryColours?.length)
        ? props.categoryColours
        : ['#52AE32', '#63BEDD'];
});
const labels = ['Anfragen automatisiert beantwortet', 'an Servicepersonal weitergeleitet'];
const arcGenerator = d3.arc().innerRadius(0).outerRadius(radius);
const expandedArcGenerator = d3.arc().innerRadius(0).outerRadius(expandedRadius);

const openEditor = () => {
    Streamlit.setComponentValue({ action: "open_data_editor", chartNumber: 3 });
};

function changePart(index) {
    selectedIndex.value = index;

    const sliceData = {
        index: index,
        percentage: arcs.value[index]?.data?.Percentage || 0
    };

    emit('pieSliceSelected', sliceData);
}

watch(() => props.data, (newData) => {
    if (!newData || newData.length === 0) return;
    const pie = d3.pie().value(d => +d.Percentage);
    arcs.value = pie(newData);
}, { immediate: true });
</script>

<template>
    <div class="pie-chart-wrapper" :class="{ 'is-edit': activeMode === 'edit' }">
        <button v-if="activeMode === 'edit'" class="chart-edit-btn" @click.stop="openEditor"
            title="Diagrammdaten bearbeiten" aria-label="Diagrammdaten bearbeiten">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                    d="M12.2358 0.139355C12.1466 0.0501261 12.0255 0 11.8993 0C11.7731 0 11.6521 0.0501261 11.5628 0.139355L9.99501 1.70717L13.5238 5.23595L15.0916 3.66909C15.1359 3.62487 15.1711 3.57235 15.1951 3.51453C15.2191 3.4567 15.2314 3.39471 15.2314 3.3321C15.2314 3.2695 15.2191 3.20751 15.1951 3.14968C15.1711 3.09186 15.1359 3.03934 15.0916 2.99512L12.2358 0.139355ZM12.8508 5.90896L9.322 2.38018L3.1345 8.56768H3.33155C3.45778 8.56768 3.57884 8.61783 3.6681 8.70709C3.75736 8.79635 3.80751 8.91741 3.80751 9.04364V9.5196H4.28347C4.4097 9.5196 4.53076 9.56975 4.62002 9.65901C4.70928 9.74827 4.75943 9.86933 4.75943 9.99557V10.4715H5.23539C5.36163 10.4715 5.48269 10.5217 5.57195 10.6109C5.66121 10.7002 5.71135 10.8213 5.71135 10.9475V11.4235H6.18732C6.31355 11.4235 6.43461 11.4736 6.52387 11.5629C6.61313 11.6521 6.66328 11.7732 6.66328 11.8994V12.0965L12.8508 5.90896ZM5.74182 13.0179C5.72179 12.9647 5.71147 12.9082 5.71135 12.8513V12.3754H5.23539C5.10916 12.3754 4.9881 12.3252 4.89884 12.236C4.80958 12.1467 4.75943 12.0256 4.75943 11.8994V11.4235H4.28347C4.15724 11.4235 4.03617 11.3733 3.94691 11.284C3.85765 11.1948 3.80751 11.0737 3.80751 10.9475V10.4715H3.33155C3.20531 10.4715 3.08425 10.4214 2.99499 10.3321C2.90573 10.2429 2.85558 10.1218 2.85558 9.99557V9.5196H2.37962C2.32272 9.51949 2.2663 9.50917 2.21304 9.48914L2.04264 9.65859C1.99728 9.70426 1.96166 9.75867 1.93793 9.81851L0.0340846 14.5781C-0.00053745 14.6646 -0.0090129 14.7594 0.009709 14.8506C0.0284309 14.9419 0.0735268 15.0257 0.139406 15.0916C0.205285 15.1574 0.289051 15.2025 0.380318 15.2212C0.471584 15.24 0.566339 15.2315 0.652835 15.1969L5.41245 13.293C5.47229 13.2693 5.52669 13.2337 5.57237 13.1883L5.74182 13.0179Z"
                    fill="#F3F3F3" />
            </svg>
        </button>
        <svg viewBox="-180 -180 370 370" height="100%" width="100%">
            <g>
                <!-- non-selected slices are getting rendered first -->
                <path v-for="(arc, index) in arcs" :key="`normal-${index}`" v-show="selectedIndex !== index"
                    :d="arcGenerator(arc)" :fill="colors[index]" stroke="none" stroke-width="0" filter="grayscale(1)"
                    :style="{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }" @click="changePart(index)" />
                <!-- selected slice is rendered last to appear on top -->
                <path v-for="(arc, index) in arcs" :key="`selected-${index}`" v-show="selectedIndex === index"
                    :d="expandedArcGenerator(arc)" :fill="colors[index]" filter="drop-shadow(-5px 8px 0px #FFF)" :style="{
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }" @click="changePart(index)" />
                <!-- Labels -->
                <g v-for="(arc, index) in arcs" :key="`label-${index}`">
                    <foreignObject :x="arcGenerator.centroid(arc)[0] - 90" :y="arcGenerator.centroid(arc)[1] - 40"
                        width="150" height="80" style="pointer-events: none;">
                        <div class="label-container">
                            <div class="percentage-text">
                                {{ arc.data.Percentage }}%
                            </div>
                            <div class="description-text">
                                <EditableTextField :model-value="labels[index]" :active-mode="activeMode"
                                    @update:model-value="val => labels[index] = val" :rows="2" :width="'100%'"
                                    :font-size="'10px'" :line-height="1.3" :padding="'0'" :font-weight="'400'"
                                    :border-radius="'8px'" />
                            </div>
                        </div>
                    </foreignObject>
                </g>
            </g>
        </svg>
    </div>
</template>

<style scoped>
.pie-chart-wrapper {
    position: relative;
    height: 100%;
    width: 100%;
}

.pie-chart-wrapper.is-edit {
    border: 1px dashed #808080;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
}

g {
    width: 100%;
    height: 100%;
}

/* non-selected slices on hover get original color */
path[filter="grayscale(1)"]:hover {
    filter: grayscale(0);
}

/* selected slice always has shadow */
path[filter="url(#expandedDropShadow)"]:hover {
    filter: url(#expandedDropShadow);
}

.label-container {
    background-color: white;
    border-radius: 8px;
    padding-left: 10px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
}

.percentage-text {
    font-size: 24px;
    font-weight: 700;
    color: black;
}

.description-text {
    font-size: 12px;
    font-weight: 400;
    color: black;
    line-height: 1.3;
}

.chart-edit-btn {
    position: absolute;
    right: 5%;
    top: -22px;
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
</style>
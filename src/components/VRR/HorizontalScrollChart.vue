<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useScroll, useElementBounding } from '@vueuse/core'
import ArrowBubbleChart from './ArrowBubbleChart.vue'
import Timeline from './Timeline.vue'
import EditableTextField from '@src/components/EditableTextField.vue'

const props = defineProps({
    // How many additional year panels to create
    additionalPanels: {
        type: Number,
        default: 1
    },
    yearShift: {
        type: Number,
        default: 1
    },
    wrapperHeight: {
        type: String,
        default: '300vh'
    },
    showProgress: {
        type: Boolean,
        default: true
    },
    // Scroll sensitivity (lower = more sensitive)
    scrollSensitivity: {
        type: Number,
        default: 0.3
    },
    firstChartData: {
        type: Object,
        default: null
    },
    secondChartData: {
        type: Array,
        default: () => []
    },
    categoryNames: { type: Object, default: () => ({}) },
    activeMode: { type: String, default: 'view' },
    categoryColours: { type: Array, default: () => [] }
})

// Get all other props to pass to ArrowBubbleChart
const chartProps = computed(() => {
    const { additionalPanels, yearShift, wrapperHeight, showProgress, scrollSensitivity, ...rest } = props
    return rest
})

const textField = ref('Auf Basis der gesammelten Erfahrungen werden folgende Ziele verfolgt:\n\nAufbau eines vollautomatisierten KI-Chatbots inkl. LLM als nächste Entwicklungsstufe\n\nVernetzte, KI-gestützte Serviceplattform')

const containerRef = ref()
const scrollX = ref(0)

const { y: scrollY } = useScroll(window)

const { top: containerTop, height: containerHeight } = useElementBounding(containerRef)

const panelCount = computed(() => props.additionalPanels + 1)

const scrollProgress = computed(() => {
    if (!containerTop.value || !containerHeight.value) return 0

    const scrollStart = containerTop.value + window.innerHeight * props.scrollSensitivity
    const scrollEnd = containerTop.value + containerHeight.value - window.innerHeight * (1 - props.scrollSensitivity)

    if (scrollY.value < scrollStart) return 0
    if (scrollY.value > scrollEnd) return 1

    return (scrollY.value - scrollStart) / (scrollEnd - scrollStart)
})

watch(scrollProgress, (progress) => {
    // Each panel is 100vw, so total scroll = (number of panels - 1) * viewport width
    const maxScroll = window.innerWidth * (props.additionalPanels)
    scrollX.value = progress * maxScroll
}, { immediate: true })

watch(() => props.secondChartData, (val) => {
    console.log('secondChartData in HorizontalScrollChart:', val)
}, { immediate: true })

const handleResize = () => {
    const maxScroll = window.innerWidth * (props.additionalPanels)
    scrollX.value = scrollProgress.value * maxScroll
}

onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

defineExpose({
    scrollProgress,
    currentPanelIndex: computed(() => Math.floor(scrollProgress.value * panelCount.value))
})
</script>

<template>
    <div ref="containerRef" class="horizontal-scroll-wrapper" :style="{ height: wrapperHeight }">
        <div class="horizontal-scroll-container">
            <div class="horizontal-content" :style="{ transform: `translateX(-${scrollX}px)` }">
                <div v-for="panelIndex in panelCount" :key="`panel-${panelIndex}`" class="chart-panel">
                    <div class="timeline-wrapper" :style="{ width: '100%' }">
                        <div v-if="panelIndex === 1">
                            <ArrowBubbleChart v-if="panelIndex === 1" v-bind="chartProps" :chart-number="2"
                                :second-chart-data="secondChartData" :categoryNames="categoryNames"
                                :category-colours="props.categoryColours" :activeMode="activeMode"
                                :years="[2022, 2023, 2024, 2025]" :height="'45vh'" :bubble-position="[28, 53, 78]"
                                :timeline-start="25" :percentage-shift="25" :bubble-gap="2" :margin-top="0" />
                            <div class="mehrwert-bg-img">
                                <img id="theo" src="@img/VRR/Characters/Theo.svg" alt="Theo" />
                                <img id="orange-tram" src="@img/VRR/Transport/TramOrange.svg" alt="Orange Tram" />
                            </div>
                        </div>
                        <div v-if="panelIndex === 2" class="panel-content">
                            <div class="content-above-timeline">
                                <div class="section-wrapper">
                                    <img id="waving-robot" src="@img/VRR/Robot/Waving.svg" alt="Waving Robot">
                                    <div class="coloured-space">
                                        <div class="white-space">
                                            <EditableTextField :model-value="textField"
                                                @update:model-value="val => textField = val" :active-mode="activeMode"
                                                :rows="8" :width="'100%'" :font-size="'24px'" :line-height="1.2"
                                                :text-align="'left'" :font-weight="'normal'" :padding="'3vh'" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="timeline-at-bottom">
                                <Timeline :years="[2026, 2027, 2028]" :start-point="25" :markers-gap="25" />
                            </div>
                            <div class="bg-theresa">
                                <img id="theresa" src="@img/VRR/Characters/Theresa.svg" alt="Theresa" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.horizontal-scroll-wrapper {
    position: relative;
    width: 100%;
}

.horizontal-scroll-container {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    z-index: 10;
}

.horizontal-content {
    display: flex;
    height: 100%;
    will-change: transform;
    transition: transform 0.1s ease-out;
}

.timeline-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 45vh;
    width: 100%;
}

.panel-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 45vh;
    width: 100%;
}

.content-above-timeline {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 2;
}

.timeline-at-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    z-index: 1;
}

.chart-panel {
    min-width: 100vw;
    width: 100vw;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.panel-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
}

.default-bg {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: #ccc;
}

.mehrwert-bg-img {
    position: relative;
    width: 100%;
    height: 30vh;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: -25vh;
}

.mehrwert-bg-img #orange-tram,
.mehrwert-bg-img #theo {
    opacity: 0.08;
    height: 100%;
}

.section-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coloured-space {
    width: 40%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    padding: 20px 20px;
    background-image: linear-gradient(rgba(255, 255, 255, 0.75), rgba(115, 245, 70, 0.75), rgba(114, 219, 255, 0.75));
    border-radius: 20px;
    pointer-events: none;
    z-index: 3;
}

.white-space {
    width: 95%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 20px;
    padding: 0px 20px;
}

#waving-robot {
    position: absolute;
    top: -20%;
    left: 22%;
    height: 80%;
    z-index: 2;
    transform: rotate(-40deg);
}

.bg-theresa {
    position: absolute;
    top: 0;
    right: 5%;
    height: 60%;
    z-index: 2;
}

#theresa {
    transform: rotateY(180deg);
    opacity: 0.1;
    z-index: 1;
}
</style>
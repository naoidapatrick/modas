<script setup>
import * as d3 from 'd3'
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import MapSVG from '@img/Thuringia/Map_svg.svg'

// Props
const props = defineProps({
    csvData: {
        type: Array,
        default: () => []
    },
    colorFill: {
        type: String,
        default: '#006F45'
    },
    colorStroke: {
        type: String,
        default: '#e3dbc3'
    }
})

const width = 1360
const height = 1065

// Refs for DOM elements
const mapSvg = ref(null)
const mapGroup = ref(null)
const dataGroup = ref(null)

// Reactive state
const projection = ref(null)

// Setup projection for Thüringen
const setupProjection = () => {
    projection.value = d3.geoMercator()
        .center([10.87, 51.33])
        .scale(24800)
}

// Load SVG content from file or string
const loadSVGContent = async () => {
    console.log('Loading SVG content from:', MapSVG)

    if (!MapSVG || !mapGroup.value) {
        console.warn('No SVG content or mapGroup not ready')
        return
    }

    try {
        let svgContent = MapSVG

        // If it looks like a file path, fetch it
        if (MapSVG.includes('.svg')) {
            console.log('Fetching SVG file from:', MapSVG)
            const response = await fetch(MapSVG)
            if (!response.ok) {
                throw new Error(`Failed to load SVG: ${response.status}`)
            }
            svgContent = await response.text()
        }

        // Load the SVG content into the map group
        d3.select(mapGroup.value).html(svgContent)
        console.log('SVG content loaded successfully')

    } catch (error) {
        console.error('Error loading SVG:', error)
    }
}

// Plot data points as drop markers
const plotDataPoints = () => {
    console.log('Plotting data points. Data length:', props.csvData?.length)
    
    if (!props.csvData || props.csvData.length === 0) {
        console.log('No data to plot')
        return
    }
    
    // Clear previous points
    d3.select(dataGroup.value).selectAll('*').remove()

    // Create drop-shaped markers
    const markers = d3.select(dataGroup.value)
        .selectAll('.townhall-point')
        .data(props.csvData)
        .enter()
        .append('g')
        .attr('class', 'townhall-point')
        .attr('transform', d => {
            const coords = projection.value([d.longitude, d.latitude])
            return coords ? `translate(${coords[0]}, ${coords[1]})` : 'translate(0, 0)'
        })

    markers.append('g')
        .attr('class', 'drop-marker')
        .attr('transform', 'scale(0)')
        .html(d => `
      <path d="M0,-15 C-6,-15 -10,-11 -10,-5 C-10,2.5 0,15 0,15 S10,2.5 10,-5 C10,-11 6,-15 0,-15 Z" 
            fill="${props.colorFill}" 
            stroke="${props.colorStroke}" 
            stroke-width="1.5"
            filter="url(#drop-shadow-${d.id})"/>
      <circle cx="0" cy="-5" r="3" fill="${props.colorStroke}"/>
    `)

    // animate appearance
    markers.select('.drop-marker')
        .transition()
        .duration(400)
        .delay((d, i) => i * 3)
        .attr('transform', 'scale(1.2)')
}

// Initialize the map
const initializeMap = async () => {
    try {
        setupProjection()

        await loadSVGContent()

        plotDataPoints()
    } catch (error) {
        console.error('Error initializing map:', error)
    }
}

// Watchers
watch(() => props.csvData, () => {
    console.log('CSV Data changed:', props.csvData?.length)
    if (props.csvData && props.csvData.length > 0) {
        plotDataPoints()
    }
}, { deep: true })

watch(() => MapSVG, async () => {
    if (mapGroup.value) {
        await loadSVGContent()
    }
})

onMounted(() => {
    initializeMap()
})
</script>

<template>
    <div class="map-container">
        <svg ref="mapSvg" class="map-svg" :viewBox="`0 0 ${width} ${height}`" preserveAspectRatio="xMidYMid meet">
            <g ref="mapGroup"></g>
            <g ref="dataGroup"></g>
        </svg>
    </div>
</template>

<style scoped>
.map-container {
    position: relative;
    width: 100%;
    height: 100%;
}

.map-svg {
    /* width: 100%; */
    height: 100%;
}
</style>
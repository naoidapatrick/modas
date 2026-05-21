<script setup>
import { computed } from 'vue';
import Timeline from './Timeline.vue';
import BubbleLabel from './BubbleLabel.vue';
import { Streamlit } from 'streamlit-component-lib';

const props = defineProps({
    chartNumber: {
        type: Number,
        default: 1,
        validator: (value) => [1, 2].includes(value)
    },
    years: {
        type: Array,
        default: () => [2022, 2023, 2024, 2025]
    },
    height: {
        type: String,
        default: '60vh'
    },
    bubblePosition: {
        type: Array,
        default: () => [15, 39, 65]
    },
    timelineStart: {
        type: Number,
        default: 10
    },
    percentageShift: {
        type: Number,
        default: 25
    },
    bubbleGap: {
        type: Number,
        default: 1
    },
    marginTop: {
        type: String,
        default: '0'
    },
    firstChartData: {
        type: Object,
        default: null
    },
    secondChartData: {
        type: Array,
        default: () => []
    },
    categoryNames: {
        type: Object,
        default: () => ({})
    },
    activeMode: {
        type: String,
        default: 'view'
    },
    categoryColours: {
        type: Array,
        default: () => []
    }
});

const openEditor = () => {
    Streamlit.setComponentValue({ action: "open_data_editor", chartNumber: props.chartNumber });
};

const chartData = computed(() => {
    return generateChart(props.chartNumber);
});

const firstChartData = computed(() => {
    return props.firstChartData;
});

const secondChartData = computed(() => {
    return props.secondChartData;
});

const bubbleColorPalette = computed(() => {
    const colours = props.categoryColours?.length ? props.categoryColours : [
        '#001C0C', '#004F22', '#43A86B', 'rgba(0, 28, 12, 0.9)'
    ];
    const borderRadius = [40, 12, 8, 25];
    return colours.map((color, i) => ({
        color,
        borderRadius: borderRadius[i] ?? 8
    }));
});

const categoryIndexMap = computed(() => {
    return Object.keys(props.categoryNames).reduce((map, cat, i) => {
        map[cat] = i % bubbleColorPalette.value.length;
        return map;
    }, {});
});

const getBubbleLabel = (type) => props.categoryNames[type] ?? type;
const getBubbleColor = (type) => bubbleColorPalette.value[categoryIndexMap.value[type] ?? 0].color;
const getNumberFontSize = (bubbleHeight) => {
    const minFont = 0.8;
    const maxFont = 4.5;
    const minHeight = 2;
    const maxHeight = 25;

    const scaled = minFont + ((bubbleHeight - minHeight) / (maxHeight - minHeight)) * (maxFont - minFont);
    return Math.max(minFont, Math.min(maxFont, scaled)) + 'vw';
};
const getBorderRadius = (color) => {
    const config = bubbleColorPalette.value.find(c => c.color === color);
    return config?.borderRadius ?? 8;
};

const getBubbleSize = (value) => {
    const minSize = 2;
    const maxSize = 25;
    const minValue = 0;
    let maxValue = 310000;

    if (value === 0) return 0;
    if (value < minValue) value = minValue;

    // Scale by area for proportional representation
    // Area = π * r² = π * (diameter/2)²
    // So diameter = 2 * sqrt(area/π)

    // First, scale the value to get proportional area
    const minArea = Math.PI * Math.pow(minSize / 2, 2);
    const maxArea = Math.PI * Math.pow(maxSize / 2, 2);

    const scaledArea = minArea + ((value - minValue) / (maxValue - minValue)) * (maxArea - minArea);

    // Convert area back to diameter
    const diameter = 2 * Math.sqrt(scaledArea / Math.PI);

    return Math.max(minSize, Math.min(maxSize, Math.round(diameter * 10) / 10));
};

const labelPositions = computed(() => {
    return Object.keys(props.categoryNames).reduce((positions, key) => {
        const bubble = chartData.value.find(b => b.categoryKey === key);
        if (bubble) {
            positions[key] = bubble.position.y + (bubble.height / 2);
        }
        return positions;
    }, {});
});

const generateChart = (chartNumber) => {
    // Chart configuration based on type
    const chartConfigs = {
        1: {
            data: firstChartData.value?.statsByCat,
            dataItems: firstChartData.value ? Object.keys(firstChartData.value.statsByCat).map(cat => ({
                key: cat,
                data: firstChartData.value.statsByCat[cat]
            })) : [],
            years: props.years,
            getValue: (dataItem, year) => dataItem.data[`total${year}`],
            getLabel: (dataItem) => getBubbleLabel(dataItem.key),
            getColor: (dataItem) => getBubbleColor(dataItem.key),
            getFontSize: (dataItem) => getNumberFontSize(dataItem.key)
        },
        2: {
            data: secondChartData.value,
            dataItems: [...new Set(secondChartData.value?.map(d => d.category) || [])],
            years: props.years,
            getValue: (category, year) => {
                const dataPoint = secondChartData.value?.find(d => d.year === year && d.category === category);
                return dataPoint ? dataPoint.value : 0;
            },
            getLabel: (category) => getBubbleLabel(category),
            getColor: (category) => getBubbleColor(category),
            getFontSize: (category) => getNumberFontSize(category)
        }
    };

    const config = chartConfigs[chartNumber];
    if (!config || !config.data) return [];

    const bubbles = [];
    let bubbleId = 1;

    const columnHeights = [0, 0, 0];
    const baselineY = 2;

    // Generate bubbles for each data item and year
    config.dataItems.forEach((dataItem) => {
        config.years.forEach((year, yearIndex) => {
            const value = config.getValue(dataItem, year, yearIndex);

            // Skip creating bubble if value is 0
            if (value === 0) return;

            const bubbleHeight = getBubbleSize(value);

            bubbles.push({
                id: bubbleId++,
                number: value,
                categoryKey: typeof dataItem === 'string' ? dataItem : dataItem.key,
                value: value,
                height: bubbleHeight,
                position: {
                    x: props.bubblePosition[yearIndex],
                    y: columnHeights[yearIndex] + baselineY
                },
                color: config.getColor(dataItem),
                fontSize: config.getFontSize(dataItem)
            });

            // Update cumulative height for the column
            columnHeights[yearIndex] += bubbleHeight * props.bubbleGap + 0.5;
        });
    });
    return bubbles;
};
</script>

<template>
    <div class="arrow-bubble-chart" :style="{ height: props.height, marginTop: props.marginTop }">
        <div class="chart-container" :class="{ 'is-edit': activeMode === 'edit' }">
            <button v-if="activeMode === 'edit'" class="chart-edit-btn" @click.stop="openEditor"
                title="Diagrammdaten bearbeiten" aria-label="Diagrammdaten bearbeiten">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path
                        d="M12.2358 0.139355C12.1466 0.0501261 12.0255 0 11.8993 0C11.7731 0 11.6521 0.0501261 11.5628 0.139355L9.99501 1.70717L13.5238 5.23595L15.0916 3.66909C15.1359 3.62487 15.1711 3.57235 15.1951 3.51453C15.2191 3.4567 15.2314 3.39471 15.2314 3.3321C15.2314 3.2695 15.2191 3.20751 15.1951 3.14968C15.1711 3.09186 15.1359 3.03934 15.0916 2.99512L12.2358 0.139355ZM12.8508 5.90896L9.322 2.38018L3.1345 8.56768H3.33155C3.45778 8.56768 3.57884 8.61783 3.6681 8.70709C3.75736 8.79635 3.80751 8.91741 3.80751 9.04364V9.5196H4.28347C4.4097 9.5196 4.53076 9.56975 4.62002 9.65901C4.70928 9.74827 4.75943 9.86933 4.75943 9.99557V10.4715H5.23539C5.36163 10.4715 5.48269 10.5217 5.57195 10.6109C5.66121 10.7002 5.71135 10.8213 5.71135 10.9475V11.4235H6.18732C6.31355 11.4235 6.43461 11.4736 6.52387 11.5629C6.61313 11.6521 6.66328 11.7732 6.66328 11.8994V12.0965L12.8508 5.90896ZM5.74182 13.0179C5.72179 12.9647 5.71147 12.9082 5.71135 12.8513V12.3754H5.23539C5.10916 12.3754 4.9881 12.3252 4.89884 12.236C4.80958 12.1467 4.75943 12.0256 4.75943 11.8994V11.4235H4.28347C4.15724 11.4235 4.03617 11.3733 3.94691 11.284C3.85765 11.1948 3.80751 11.0737 3.80751 10.9475V10.4715H3.33155C3.20531 10.4715 3.08425 10.4214 2.99499 10.3321C2.90573 10.2429 2.85558 10.1218 2.85558 9.99557V9.5196H2.37962C2.32272 9.51949 2.2663 9.50917 2.21304 9.48914L2.04264 9.65859C1.99728 9.70426 1.96166 9.75867 1.93793 9.81851L0.0340846 14.5781C-0.00053745 14.6646 -0.0090129 14.7594 0.009709 14.8506C0.0284309 14.9419 0.0735268 15.0257 0.139406 15.0916C0.205285 15.1574 0.289051 15.2025 0.380318 15.2212C0.471584 15.24 0.566339 15.2315 0.652835 15.1969L5.41245 13.293C5.47229 13.2693 5.52669 13.2337 5.57237 13.1883L5.74182 13.0179Z"
                        fill="#F3F3F3" />
                </svg>
            </button>
            <Timeline :years="props.years" :start-point="props.timelineStart" :markers-gap="props.percentageShift" />

            <div class="category-labels">
                <div v-if="props.chartNumber === 2">
                    <BubbleLabel v-for="(position, catKey) in labelPositions" :key="catKey"
                        :text="getBubbleLabel(catKey)" :color="getBubbleColor(catKey)" :fontSize="`20px`"
                        :position="position" :spacing-factor="0.8" />
                </div>
                <div v-else class="stats-labels">
                    <div v-for="(position, catKey) in labelPositions" :key="catKey">
                        <BubbleLabel :text="getBubbleLabel(catKey)" :color="getBubbleColor(catKey)" :fontSize="`20px`"
                            :position="position" :spacing-factor="0.8" />
                    </div>
                </div>
            </div>
        </div>
        <div v-for="bubble in chartData" :key="bubble.id" class="bubble" :style="{
            left: bubble.position.x + '%',
            bottom: bubble.position.y + 'vh',
            width: getBubbleSize(bubble.value / 1.5) + 'vw',
            height: bubble.height + 'vh',
            backgroundColor: bubble.color,
            borderRadius: getBorderRadius(bubble.color) + 'px'
        }">
            <div class="bubble-number" :style="{ fontSize: getNumberFontSize(bubble.height) }">
                {{ bubble.number }}
            </div>
        </div>
    </div>
</template>

<style scoped>
.arrow-bubble-chart {
    width: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chart-container {
    width: 100%;
    height: 100%;
    position: relative;
}

.chart-container.is-edit {
    border: 1px dashed #808080;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.15);
}

.bubble {
    position: absolute;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    z-index: 3;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 0.85px solid rgba(217, 217, 217, 1);
}

.bubble-number {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 0.2rem;
    line-height: 1;
}

.category-labels {
    position: absolute;
    left: 0;
    bottom: 5%;
    display: flex;
    flex-direction: column;
    z-index: 2;
    padding-left: 1rem;
    width: 23%;
}

.stats-labels {
    position: relative;
    width: 100%;
    height: 100%;
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
<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    activeMode: { type: String, default: 'view' },
    defaultGradient: {
        type: Object,
        default: () => ({
            angle: 180,
            stops: [
                { color: '#c5b0ff', position: 0 },
                { color: '#ffffff', position: 100 },
            ]
        })
    },
    background: Object,
});

const emit = defineEmits(['mode-change', 'update:background'])

const setActive = (tileName) => {
    emit('mode-change', tileName);
}

const showGradientPicker = ref(false);
const gradientConfig = ref({ ...props.defaultGradient, stops: props.defaultGradient.stops.map(s => ({ ...s })) });

const buildGradient = (config) => {
    const stops = config.stops
        .map(s => `${s.color} ${s.position}%`)
        .join(', ');
    return `linear-gradient(${config.angle}deg, ${stops})`;
};

const applyGradient = () => {
    const gradient = buildGradient(gradientConfig.value);
    const container = document.querySelector('.story-container');
    if (container) container.style.backgroundImage = gradient;

    let styleTag = document.getElementById('dynamic-backdrop');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-backdrop';
        document.head.appendChild(styleTag);
    }
    styleTag.textContent = `
        .thuringia-app:fullscreen::backdrop {
            background: ${gradient} !important;
        }
    `;
};

const resetGradient = () => {
    gradientConfig.value = { ...props.defaultGradient, stops: props.defaultGradient.stops.map(s => ({ ...s })) };
};

watch(gradientConfig, () => applyGradient(), { deep: true });

watch(() => props.background, (bg) => {
    if (bg?.type !== 'texture') return
    const container = document.querySelector('.scrollying-section')
    if (container) container.style.setProperty('--bg-tint', bg.tint)
}, { deep: true })

watch(() => props.activeMode, (mode) => {
    if (mode !== 'edit') showGradientPicker.value = false;
});

</script>

<template>
    <div class="side-menu" :style="{ overflow: activeMode === 'edit' ? 'visible' : 'hidden' }">
        <span class="view-mode-tile" :class="{ 'is-active': activeMode === 'view' }" @click="setActive('view')">
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="38" viewBox="0 0 50 38" fill="none">
                <path
                    d="M7.8125 35.9375C7.8125 35.5231 7.97712 35.1257 8.27015 34.8326C8.56317 34.5396 8.9606 34.375 9.375 34.375H40.625C41.0394 34.375 41.4368 34.5396 41.7299 34.8326C42.0229 35.1257 42.1875 35.5231 42.1875 35.9375C42.1875 36.3519 42.0229 36.7493 41.7299 37.0424C41.4368 37.3354 41.0394 37.5 40.625 37.5H9.375C8.9606 37.5 8.56317 37.3354 8.27015 37.0424C7.97712 36.7493 7.8125 36.3519 7.8125 35.9375ZM43.7219 3.125L43.7969 3.12812C44.3803 3.17088 44.9505 3.32244 45.4781 3.575C45.8571 3.75187 46.1827 4.02569 46.4219 4.36875C46.6312 4.68125 46.875 5.23438 46.875 6.25V24.9719L46.8719 25.0469C46.8291 25.6303 46.6776 26.2005 46.425 26.7281C46.2481 27.1071 45.9743 27.4327 45.6313 27.6719C45.3188 27.8812 44.7656 28.125 43.75 28.125H6.27813L6.20313 28.1219C5.61973 28.0791 5.0495 27.9276 4.52188 27.675C4.14289 27.4981 3.81733 27.2243 3.57812 26.8813C3.36875 26.5688 3.125 26.0156 3.125 25V6.27812L3.12813 6.20312C3.17088 5.61973 3.32244 5.0495 3.575 4.52188C3.75187 4.14289 4.02569 3.81733 4.36875 3.57812C4.68125 3.36875 5.23438 3.125 6.25 3.125H43.7219ZM43.75 0H6.25C0 0 0 6.25 0 6.25V25C0 31.25 6.25 31.25 6.25 31.25H43.75C50 31.25 50 25 50 25V6.25C50 0 43.75 0 43.75 0Z"
                    fill="none" />
            </svg>
        </span>
        <span class="edit-mode-tile" :class="{ 'is-active': activeMode === 'edit' }" @click="setActive('edit');">
            <svg width="46" height="46" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M45.3179 4.50123C45.6098 4.79411 45.7738 5.1908 45.7738 5.60435C45.7738 6.01791 45.6098 6.41459 45.3179 6.70748L42.0585 9.96998L35.8085 3.71998L39.0679 0.457479C39.3609 0.164555 39.7582 0 40.1726 0C40.5869 0 40.9842 0.164555 41.2772 0.457479L45.3179 4.4981V4.50123ZM39.8491 12.1762L33.5991 5.92623L12.3085 27.22C12.1365 27.3919 12.007 27.6017 11.9304 27.8325L9.41474 35.3762C9.36911 35.5138 9.36264 35.6613 9.39603 35.8023C9.42942 35.9433 9.50137 36.0722 9.60382 36.1746C9.70628 36.2771 9.83521 36.349 9.97621 36.3824C10.1172 36.4158 10.2647 36.4093 10.4022 36.3637L17.946 33.8481C18.1765 33.7724 18.3862 33.644 18.5585 33.4731L39.8491 12.1762Z"
                    fill="none" />
                <path
                    d="M0 40.6262C0 41.8694 0.49386 43.0617 1.37294 43.9408C2.25201 44.8199 3.4443 45.3137 4.6875 45.3137H39.0625C40.3057 45.3137 41.498 44.8199 42.3771 43.9408C43.2561 43.0617 43.75 41.8694 43.75 40.6262V21.8762C43.75 21.4618 43.5854 21.0644 43.2924 20.7714C42.9993 20.4783 42.6019 20.3137 42.1875 20.3137C41.7731 20.3137 41.3757 20.4783 41.0826 20.7714C40.7896 21.0644 40.625 21.4618 40.625 21.8762V40.6262C40.625 41.0406 40.4604 41.438 40.1674 41.7311C39.8743 42.0241 39.4769 42.1887 39.0625 42.1887H4.6875C4.2731 42.1887 3.87567 42.0241 3.58265 41.7311C3.28962 41.438 3.125 41.0406 3.125 40.6262V6.25122C3.125 5.83682 3.28962 5.43939 3.58265 5.14637C3.87567 4.85334 4.2731 4.68872 4.6875 4.68872H25C25.4144 4.68872 25.8118 4.5241 26.1049 4.23108C26.3979 3.93805 26.5625 3.54062 26.5625 3.12622C26.5625 2.71182 26.3979 2.31439 26.1049 2.02137C25.8118 1.72834 25.4144 1.56372 25 1.56372H4.6875C3.4443 1.56372 2.25201 2.05758 1.37294 2.93666C0.49386 3.81573 0 5.00802 0 6.25122V40.6262Z"
                    fill="none" />
            </svg>
        </span>

        <!-- BG colour tile — only visible in edit mode -->
        <span v-if="activeMode === 'edit'" class="bg-colour-tile" :class="{ 'is-active': showGradientPicker }"
            @click="showGradientPicker = !showGradientPicker" title="Hintergrundverlauf">
            <svg xmlns="http://www.w3.org/2000/svg" width="85" height="86" viewBox="0 0 85 86" fill="none">
                <path
                    d="M35.5364 14.2553C32.6739 10.024 29.7427 6.45526 27.0989 3.98651C25.7855 2.70199 24.2903 1.61748 22.6614 0.76776C21.3052 0.117759 19.1614 -0.51349 17.1489 0.64276C14.8552 1.97401 14.4802 4.58026 14.4614 6.24276C14.4427 8.14276 14.8614 10.3928 15.5427 12.7678C16.7677 17.0615 19.0177 22.3178 22.0114 27.7803L1.53644 48.2553C-0.194806 49.9865 -0.144805 52.3553 0.173945 53.9928C0.517695 55.7615 1.34269 57.699 2.42394 59.6365C4.59894 63.5553 8.17394 68.1428 12.5864 72.5615C17.0052 76.9803 21.5927 80.549 25.5114 82.724C27.4489 83.8053 29.3864 84.6303 31.1552 84.974C32.7927 85.2865 35.1552 85.3428 36.8927 83.6115L71.9864 48.5178C72.7239 50.124 72.5614 51.7178 72.2989 54.3865C72.1114 56.2115 71.8739 58.5428 71.8427 61.7365V62.5053H71.8614C71.9924 64.0669 72.7054 65.5224 73.8589 66.5832C75.0124 67.6441 76.5224 68.2328 78.0896 68.2328C79.6567 68.2328 81.1667 67.6441 82.3202 66.5832C83.4738 65.5224 84.1867 64.0669 84.3177 62.5053H84.3364V62.149C84.3424 61.905 84.334 61.6608 84.3114 61.4178C83.9677 53.6053 79.9364 44.3053 72.6864 39.5803C72.3018 38.6504 71.8615 37.7446 71.3677 36.8678C69.1864 32.9553 65.6177 28.3678 61.1989 23.949C56.7802 19.5303 52.1927 15.9553 48.2739 13.7803C46.3364 12.7053 44.3989 11.8803 42.6302 11.5303C40.9927 11.2178 38.6302 11.1678 36.8927 12.899L35.5364 14.2553ZM22.8364 8.54901C25.2177 10.774 28.1114 14.3115 31.0302 18.749L26.6302 23.1553C24.2427 18.6115 22.5052 14.3928 21.5489 11.0428C21.1307 9.67291 20.8563 8.26322 20.7302 6.83651C21.301 7.21151 22.0031 7.78234 22.8364 8.54901ZM25.2989 33.3303C28.6739 38.6553 32.2177 43.124 35.3427 46.0365C35.6431 46.3164 35.9957 46.5344 36.3803 46.678C36.765 46.8216 37.1741 46.888 37.5844 46.8735C37.9947 46.859 38.3982 46.7638 38.7717 46.5934C39.1453 46.423 39.4816 46.1807 39.7614 45.8803C40.0413 45.5799 40.2593 45.2273 40.4029 44.8426C40.5465 44.458 40.613 44.0488 40.5985 43.6385C40.584 43.2282 40.4888 42.8248 40.3184 42.4512C40.1479 42.0777 39.9056 41.7414 39.6052 41.4615C36.7739 38.824 33.2489 34.3615 29.8302 28.7928L36.6302 21.9928C36.9677 22.7469 37.3489 23.5073 37.7739 24.274C39.9552 28.1928 43.5239 32.7803 47.9427 37.199C52.3552 41.6178 56.9427 45.1865 60.8677 47.3615C61.6302 47.7907 62.3906 48.1719 63.1489 48.5053L32.7677 78.8928L32.3427 78.8303C31.4864 78.6615 30.2052 78.1803 28.5427 77.2553C25.2677 75.4303 21.1302 72.2553 17.0052 68.1303C12.8802 64.0053 9.70519 59.8803 7.88019 56.5928C6.96144 54.9365 6.47394 53.6553 6.31144 52.799L6.24894 52.374L25.2989 33.3303ZM43.2364 21.2365C42.5871 20.1367 42.081 18.9584 41.7302 17.7303C42.5739 17.9365 43.7552 18.4178 45.2427 19.2365C48.5177 21.0615 52.6552 24.2365 56.7802 28.3615C59.5927 31.174 61.9677 33.9928 63.7677 36.549C61.5308 36.396 59.2838 36.5879 57.1052 37.1178C55.455 35.7468 53.87 34.2994 52.3552 32.7803C48.2302 28.6553 45.0614 24.5178 43.2427 21.2365H43.2364Z"
                    fill="black" />
            </svg>

        </span>
        <!-- <span class="export-tile" :class="{ 'is-active': activeMode === 'export' }" @click="setActive('export')">
            <svg width="38" height="50" viewBox="0 0 38 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M4.6875 18.75C4.2731 18.75 3.87567 18.9146 3.58265 19.2076C3.28962 19.5007 3.125 19.8981 3.125 20.3125V45.3125C3.125 45.7269 3.28962 46.1243 3.58265 46.4174C3.87567 46.7104 4.2731 46.875 4.6875 46.875H32.8125C33.2269 46.875 33.6243 46.7104 33.9174 46.4174C34.2104 46.1243 34.375 45.7269 34.375 45.3125V20.3125C34.375 19.8981 34.2104 19.5007 33.9174 19.2076C33.6243 18.9146 33.2269 18.75 32.8125 18.75H26.5625C26.1481 18.75 25.7507 18.5854 25.4576 18.2924C25.1646 17.9993 25 17.6019 25 17.1875C25 16.7731 25.1646 16.3757 25.4576 16.0826C25.7507 15.7896 26.1481 15.625 26.5625 15.625H32.8125C34.0557 15.625 35.248 16.1189 36.1271 16.9979C37.0061 17.877 37.5 19.0693 37.5 20.3125V45.3125C37.5 46.5557 37.0061 47.748 36.1271 48.6271C35.248 49.5061 34.0557 50 32.8125 50H4.6875C3.4443 50 2.25201 49.5061 1.37294 48.6271C0.49386 47.748 0 46.5557 0 45.3125V20.3125C0 19.0693 0.49386 17.877 1.37294 16.9979C2.25201 16.1189 3.4443 15.625 4.6875 15.625H10.9375C11.3519 15.625 11.7493 15.7896 12.0424 16.0826C12.3354 16.3757 12.5 16.7731 12.5 17.1875C12.5 17.6019 12.3354 17.9993 12.0424 18.2924C11.7493 18.5854 11.3519 18.75 10.9375 18.75H4.6875Z"
                    fill="none" />
                <path
                    d="M17.6457 0.456235C17.7909 0.310725 17.9633 0.195279 18.1531 0.116509C18.3429 0.0377386 18.5465 -0.00280762 18.752 -0.00280762C18.9575 -0.00280762 19.161 0.0377386 19.3508 0.116509C19.5407 0.195279 19.7131 0.310725 19.8582 0.456235L29.2332 9.83123C29.5266 10.1246 29.6914 10.5226 29.6914 10.9375C29.6914 11.3524 29.5266 11.7503 29.2332 12.0437C28.9398 12.3371 28.5419 12.502 28.127 12.502C27.7121 12.502 27.3141 12.3371 27.0207 12.0437L20.3145 5.33436V32.8125C20.3145 33.2269 20.1499 33.6243 19.8568 33.9173C19.5638 34.2104 19.1664 34.375 18.752 34.375C18.3376 34.375 17.9401 34.2104 17.6471 33.9173C17.3541 33.6243 17.1895 33.2269 17.1895 32.8125V5.33436L10.4832 12.0437C10.3379 12.189 10.1655 12.3042 9.97567 12.3829C9.78586 12.4615 9.58242 12.502 9.37697 12.502C8.96205 12.502 8.56412 12.3371 8.27072 12.0437C8.12545 11.8985 8.01021 11.726 7.93159 11.5362C7.85297 11.3464 7.8125 11.1429 7.8125 10.9375C7.8125 10.5226 7.97733 10.1246 8.27072 9.83123L17.6457 0.456235Z"
                    fill="none" />
            </svg>
        </span> -->
        <span class="presenter-tile" :class="{ 'is-active': activeMode === 'presenter' }"
            @click="setActive('presenter')" title="Presenter view">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M8 3H5.5C4.67 3 4 3.67 4 4.5V7" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" />
                <path d="M16 3h2.5c.83 0 1.5.67 1.5 1.5V7" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" />
                <path d="M8 21H5.5c-.83 0-1.5-.67-1.5-1.5V17" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" />
                <path d="M16 21h2.5c.83 0 1.5-.67 1.5-1.5V17" stroke="currentColor" stroke-width="1.8"
                    stroke-linecap="round" />
                <path d="M9.5 9l5 3-5 3V9Z" fill="currentColor" />
            </svg>
        </span>

        <Transition name="panel-slide">
            <div v-if="showGradientPicker" class="gradient-picker-panel">
                <div class="gradient-picker-header">
                    <span>{{ background?.type === 'texture' ? 'Hintergrundfarbe' : 'Hintergrundverlauf' }}</span>
                    <button class="gradient-close" @click="showGradientPicker = false">✕</button>
                </div>

                <!-- Texture tint mode (Dresden) -->
                <template v-if="background?.type === 'texture'">
                    <div class="gradient-preview" :style="{ background: background.tint }" />
                    <div class="gradient-stop-row">
                        <div class="stop-left">
                            <label class="stop-swatch-label">
                                <span class="stop-swatch" :style="{ background: background.tint }" />
                                <input type="color" :value="background.tint"
                                    @input="e => emit('update:background', { ...background, tint: e.target.value })"
                                    class="stop-color-input" />
                            </label>
                            <span class="stop-hex">{{ background.tint }}</span>
                        </div>
                    </div>
                    <div class="gradient-row">
                        <label class="gradient-label">Deckkraft</label>
                        <div class="gradient-angle-row">
                            <input type="range" min="0" max="1" step="0.01" :value="background.opacity"
                                @input="e => emit('update:background', { ...background, opacity: parseFloat(e.target.value) })"
                                class="gradient-range" />
                            <span class="gradient-angle-val">{{ Math.round(background.opacity * 100) }}%</span>
                        </div>
                    </div>
                </template>

                <!-- Normal gradient mode -->
                <template v-else>
                    <div class="gradient-preview" :style="{ background: buildGradient(gradientConfig) }" />
                    <div class="gradient-row">
                        <label class="gradient-label">Winkel</label>
                        <div class="gradient-angle-row">
                            <input type="range" min="0" max="360" v-model.number="gradientConfig.angle"
                                class="gradient-range" />
                            <span class="gradient-angle-val">{{ gradientConfig.angle }}°</span>
                        </div>
                    </div>
                    <div class="gradient-stops">
                        <div v-for="(stop, i) in gradientConfig.stops" :key="i" class="gradient-stop-row">
                            <div class="stop-left">
                                <label class="stop-swatch-label" :title="`Stop ${i + 1} colour`">
                                    <span class="stop-swatch" :style="{ background: stop.color }" />
                                    <input type="color" :value="stop.color" @input="stop.color = $event.target.value"
                                        class="stop-color-input" />
                                </label>
                                <span class="stop-hex">{{ stop.color }}</span>
                            </div>
                            <div class="stop-right">
                                <input type="range" min="0" max="100" v-model.number="stop.position"
                                    class="gradient-range stop-pos-range" />
                                <span class="stop-pos-val">{{ stop.position }}%</span>
                            </div>
                        </div>
                    </div>
                    <button class="gradient-reset" @click="resetGradient">Auf Standardwerte zurücksetzen</button>
                </template>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
.side-menu {
    height: fit-content;
    width: fit-content;
    position: fixed;
    right: 0;
    top: 5vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 24px 0 0 24px;
    border: 1.5px solid #010080;
    background: #F3F3F3;
    z-index: 100;
    cursor: pointer;
    transition: all 0.3s ease;
}

.side-menu svg {
    width: 40px;
    height: 40px;
    margin: 16px;
}

.side-menu path {
    fill: #010080;
}

span.is-active {
    background-color: #010080;
}

span.is-active path {
    fill: #F3F3F3;
}

/* Gradient picker panel */
.gradient-picker-panel {
    position: absolute;
    right: calc(100% + 12px);
    top: 0;
    width: 290px;
    background: white;
    border: 1.5px solid #e8e8e8;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
    display: flex;
    flex-direction: column;
    gap: 14px;
    cursor: default;
    font-family: 'Albert Sans', sans-serif;
}

.gradient-picker-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 14px;
    color: #222;
}

.gradient-close {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
    color: #888;
    line-height: 1;
    padding: 0;
}

.gradient-close:hover {
    color: #222;
}

.gradient-preview {
    height: 48px;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
}

.gradient-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.gradient-label {
    font-size: 11px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.gradient-angle-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.gradient-range {
    flex: 1;
    accent-color: #010080;
}

.gradient-angle-val {
    font-size: 13px;
    color: #444;
    min-width: 34px;
    text-align: right;
}

.gradient-stops {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.gradient-stop-row {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px 12px;
    background: #f9f9f9;
    border-radius: 8px;
    border: 1px solid #efefef;
}

.stop-left {
    display: flex;
    align-items: center;
    gap: 10px;
}

.stop-swatch-label {
    position: relative;
    cursor: pointer;
}

.stop-swatch {
    display: block;
    width: 26px;
    height: 26px;
    border-radius: 6px;
    border: 1.5px solid #ddd;
}

.stop-color-input {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;
}

.stop-hex {
    font-size: 12px;
    color: #555;
    font-family: monospace;
}

.stop-right {
    display: flex;
    align-items: center;
    gap: 8px;
}

.stop-pos-range {
    flex: 1;
    accent-color: #010080;
}

.stop-pos-val {
    font-size: 12px;
    color: #666;
    min-width: 30px;
    text-align: right;
}

.gradient-reset {
    width: 100%;
    padding: 8px 0;
    font-size: 13px;
    background: none;
    border: 1px dashed #ccc;
    border-radius: 7px;
    color: #888;
    cursor: pointer;
}

.gradient-reset:hover {
    color: #333;
    border-color: #999;
}

/* Slide-in transition */
.panel-slide-enter-active,
.panel-slide-leave-active {
    transition: opacity 0.18s ease, transform 0.18s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
    opacity: 0;
    transform: translateX(8px);
}
</style>
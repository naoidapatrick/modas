<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useTranslations } from '@composables/Dresden/useTranslations.js'
import mapSvgRaw from '@img/Dresden/map.svg?raw'

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
})

const emit = defineEmits(['update:modelValue'])

const mapHost = ref(null)
const { getTranslation } = useTranslations()

function getRegionNumber(groupId) {
    return groupId.replace('region-', '')
}

function getDistrictId(groupId) {
    return `district-${getRegionNumber(groupId)}`
}

function syncRegionState() {
    const host = mapHost.value

    if (!host) {
        return
    }

    const regionGroups = host.querySelectorAll('g[id^="region-"]')

    regionGroups.forEach((group) => {
        const isSelected = getDistrictId(group.id) === props.modelValue
        const regionNumber = getRegionNumber(group.id)

        group.classList.add('map-region')
        group.classList.toggle('is-selected', isSelected)
        group.setAttribute('role', 'button')
        group.setAttribute('tabindex', '0')
        group.setAttribute(
            'aria-label',
            getTranslation('city_part_name', { number: regionNumber }),
        )
        group.setAttribute('aria-pressed', String(isSelected))
    })
}

function selectRegion(group) {
    emit('update:modelValue', getDistrictId(group.id))
}

function findRegionGroup(target) {
    if (!(target instanceof Element)) {
        return null
    }

    return target.closest('g[id^="region-"]')
}

function handleClick(event) {
    const group = findRegionGroup(event.target)

    if (!group) {
        return
    }

    selectRegion(group)
}

function handleKeydown(event) {
    const group = findRegionGroup(event.target)

    if (!group || !['Enter', ' '].includes(event.key)) {
        return
    }

    event.preventDefault()
    selectRegion(group)
}

onMounted(async () => {
    await nextTick()
    syncRegionState()
    mapHost.value?.addEventListener('click', handleClick)
    mapHost.value?.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
    mapHost.value?.removeEventListener('click', handleClick)
    mapHost.value?.removeEventListener('keydown', handleKeydown)
})

watch(() => props.modelValue, syncRegionState)
</script>

<template>
    <div ref="mapHost" class="dresden-map-host" v-html="mapSvgRaw" />
</template>

<style scoped>

.dresden-map-host :deep(.dresden-map) {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
}

.dresden-map-host :deep(.map-region) {
    cursor: pointer;
    outline: none;
}

.dresden-map-host :deep(.map-region > path:first-of-type) {
    fill: rgba(255, 255, 255, 0.35);
    transition:
        fill 0.18s ease,
        stroke 0.18s ease,
        stroke-width 0.18s ease;
}

.dresden-map-host :deep(.map-region:hover > path:first-of-type),
.dresden-map-host :deep(.map-region:focus-visible > path:first-of-type) {
    fill: rgba(255, 183, 3, 0.22);
    stroke: var(--orange-dark);
    stroke-width: 4;
}

.dresden-map-host :deep(.map-region.is-selected > path:first-of-type) {
    fill: rgba(255, 183, 3, 0.34);
    stroke: var(--orange-dark);
    stroke-width: 4.5;
}

.dresden-map-host :deep(.map-region:hover > path:last-of-type),
.dresden-map-host :deep(.map-region:focus-visible > path:last-of-type),
.dresden-map-host :deep(.map-region.is-selected > path:last-of-type) {
    fill: var(--orange-dark);
}
</style>

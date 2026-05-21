<script setup>
import { computed, onBeforeUnmount, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useTranslations } from '@composables/Dresden/useTranslations.js'
import {
    accessibilityHappinessStory,
    accessibilityRoadStory,
    conclusionStory,
    othersAcceptanceInfo,
    conclusionSummaryInfo,
    conclusionTransportUsage,
    othersAnswersStory,
    othersBikeSharingInfo,
    othersEbikesInfo,
    safetyDetailsStory,
    storyScenes,
} from '../../../data/storyData.js'
import ConclusionTransportUsage from '@components/Dresden/ConclusionTransportUsage.vue'
import DresdenMap from '@components/Dresden/DresdenMap.vue'
import SpeechBubbleContent from '@components/Dresden/SpeechBubbleContent.vue'
import StoryInfoBox from '@components/Dresden/StoryInfoBox.vue'
import TransportationOptionCard from '@components/Dresden/TransportationOptionCard.vue'
import EditableTextField from '@src/components/EditableTextField.vue';
import SideMenu from '@src/components/SideMenu.vue';

import bikeImage from '@img/Dresden/bike.png'
import busImage from '@img/Dresden/bus.png'
import carImage from '@img/Dresden/car.png'
import endCarImage from '@img/Dresden/end-car.png'
import peopleWalkingImage from '@img/Dresden/people-walking.png'
import riderImage from '@img/Dresden/rider.png'
import tree1Image from '@img/Dresden/tree1.png'
import tree2Image from '@img/Dresden/tree2.png'
import tree3Image from '@img/Dresden/tree3.png'
import tree4Image from '@img/Dresden/tree4.png'
import tree5Image from '@img/Dresden/tree5.png'
import tramImage from '@img/Dresden/tram.png'
import manBikeImage from '@img/Dresden/man-bike.svg'
import manCarImage from '@img/Dresden/man-car.svg'
import manTramImage from '@img/Dresden/man-tram.svg'
import manImage from '@img/Dresden/man.png'
import manWalkImage from '@img/Dresden/man-walk.svg'
import walkImage from '@img/Dresden/walk.png'
import womanBikeImage from '@img/Dresden/woman-bike.svg'
import womanCarImage from '@img/Dresden/woman-car.svg'
import womanTramImage from '@img/Dresden/woman-tram.svg'
import womanImage from '@img/Dresden/woman.png'
import womanWalkImage from '@img/Dresden/woman-walk.svg'
import boyBikeImage from '@img/Dresden/boy-bike.svg'
import boyCarImage from '@img/Dresden/boy-car.svg'
import boyTramImage from '@img/Dresden/boy-tram.svg'
import boyImage from '@img/Dresden/boy.png'
import boyWalkImage from '@img/Dresden/boy-walk.svg'
import arrowIcon from '@img/Dresden/arrow.svg'

const props = defineProps({
    data: { type: Array, default: () => [] },
    mode: { type: String, default: 'view' },
    columnLabelMap: { type: Object, default: () => ({}) },
    categoryColours: { type: Object, default: () => ({}) },
});

const scrollingSection = ref(null)
const activeStorySectionId = ref('')
const storySectionVisibility = reactive({})
const storySectionIntersecting = reactive({})
const storySectionSide = reactive({})
const fullyVisibleItems = reactive({})
let sectionScrollLockTimeout = null
let storySectionObserver = null
let fullyVisibleItemObserver = null
const { getTranslation, setTranslation } = useTranslations()

const chartData = ref(null)
const activeMode = ref('view');
const isPresenting = ref(false);
const editModeActive = ref(true);
const bgTintColor = ref('rgba(255, 255, 255, 0)')
const bgTintOpacity = ref(0.3)

const dresdenBackground = computed(() => ({
    type: 'texture',
    tint: bgTintColor.value,
    opacity: bgTintOpacity.value,
}))

const headers = ref({
    section1: getTranslation('intro_title'),
    section2: getTranslation('choose_character_title'),
    section3: getTranslation('choose_city_title'),
    section4: getTranslation('choose_transportation_title'),
})

const texts = ref({
    section1: getTranslation('intro_subtitle_line_1'),
})

const treeImages = {
    tree1: tree1Image,
    tree2: tree2Image,
    tree3: tree3Image,
    tree4: tree4Image,
    tree5: tree5Image,
}

const conclusionImages = {
    tram: tramImage,
    car: carImage,
    bike: bikeImage,
    'end-car': endCarImage,
    'people-walking': peopleWalkingImage,
    rider: riderImage,
}

const storyCharacterTransportationImages = {
    man: {
        bike: manBikeImage,
        car: manCarImage,
        bus: manTramImage,
        walk: manWalkImage,
    },
    woman: {
        bike: womanBikeImage,
        car: womanCarImage,
        bus: womanTramImage,
        walk: womanWalkImage,
    },
    boy: {
        bike: boyBikeImage,
        car: boyCarImage,
        bus: boyTramImage,
        walk: boyWalkImage,
    },
}

const scrollingSetupOptions = {
    characters: [
        {
            id: 'man',
            labelKey: 'character_man',
            image: manImage,
        },
        {
            id: 'woman',
            labelKey: 'character_woman',
            image: womanImage,
        },
        {
            id: 'boy',
            labelKey: 'character_boy',
            image: boyImage,
        },
    ],
    cityParts: Array.from({ length: 17 }, (_, index) => {
        const number = index + 1

        return {
            id: `district-${number}`,
            label: String(number),
            number,
        }
    }),
    transportation: [
        {
            id: 'bike',
            labelKey: 'transportation_bike',
            image: bikeImage,
        },
        {
            id: 'car',
            labelKey: 'transportation_car',
            image: carImage,
        },
        {
            id: 'bus',
            labelKey: 'transportation_bus',
            image: busImage,
        },
        {
            id: 'walk',
            labelKey: 'transportation_walk',
            image: walkImage,
        },
    ],
}

const selectedScrollingSetup = reactive({
    characterId: scrollingSetupOptions.characters[0].id,
    cityPartId: scrollingSetupOptions.cityParts[0].id,
    transportationId: scrollingSetupOptions.transportation[0].id,
})

const activeScrollingSetup = computed(() => ({
    character: scrollingSetupOptions.characters.find(
        ({ id }) => id === selectedScrollingSetup.characterId,
    ),
    cityPart: scrollingSetupOptions.cityParts.find(
        ({ id }) => id === selectedScrollingSetup.cityPartId,
    ),
    transportation: scrollingSetupOptions.transportation.find(
        ({ id }) => id === selectedScrollingSetup.transportationId,
    ),
}))

const activeStoryCharacterTransportationImage = computed(() => {
    const characterImages =
        storyCharacterTransportationImages[selectedScrollingSetup.characterId]

    return characterImages?.[selectedScrollingSetup.transportationId] ?? null
})

function resolveStorySceneMetrics(scene) {
    const transportMetrics =
        scene.metricsByTransportation[selectedScrollingSetup.transportationId] ??
        scene.metricsByTransportation.bike

    const districtMetrics =
        transportMetrics[selectedScrollingSetup.cityPartId] ?? transportMetrics.default

    return {
        ...districtMetrics,
        dissatisfied_total:
            (districtMetrics.dissatisfied ?? 0) +
            (districtMetrics.very_dissatisfied ?? 0),
        unsafe_total:
            (districtMetrics.rather_unsafe ?? 0) +
            (districtMetrics.very_unsafe ?? 0),
    }
}

function buildTowerSegments(scene, metrics) {
    const colorByMetric = {
        very_satisfied: 'var(--blue)',
        satisfied: 'var(--mint)',
        neutral: 'var(--yellow)',
        dissatisfied: 'var(--orange-soft)',
        very_dissatisfied: 'var(--orange-light)',
        no_answer: 'var(--taupe-light)',
    }

    return scene.metricOrder.map((key) => ({
        key,
        value: metrics[key],
        height: `${metrics[key]}%`,
        color: colorByMetric[key],
    }))
}

const accessibilityHappinessMetrics = computed(() =>
    resolveStorySceneMetrics(accessibilityHappinessStory),
)

const accessibilityRoadMetrics = computed(() =>
    resolveStorySceneMetrics(accessibilityRoadStory),
)

const accessibilityHappinessTowerSegments = computed(() =>
    buildTowerSegments(
        accessibilityHappinessStory,
        accessibilityHappinessMetrics.value,
    ),
)

const accessibilityRoadTowerSegments = computed(() =>
    buildTowerSegments(accessibilityRoadStory, accessibilityRoadMetrics.value),
)

const safetyDetailsMetrics = computed(() =>
    resolveStorySceneMetrics(safetyDetailsStory),
)

const safetyDetailsTitleParams = computed(() => ({
    transportGroup: getTranslation(
        `transport_group_${selectedScrollingSetup.transportationId}`,
    ),
    transportContext: getTranslation(
        `transport_context_${selectedScrollingSetup.transportationId}`,
    ),
}))

const safetyTreeItems = computed(() =>
    safetyDetailsStory.treeItems.map((item) => ({
        ...item,
        image: treeImages[item.imageKey],
        value: safetyDetailsMetrics.value[item.metricKey],
    })),
)

const othersEbikesMetrics = computed(() =>
    resolveStorySceneMetrics(othersEbikesInfo),
)

const othersBikeSharingMetrics = computed(() =>
    resolveStorySceneMetrics(othersBikeSharingInfo),
)

const othersAcceptanceMetrics = computed(() =>
    resolveStorySceneMetrics(othersAcceptanceInfo),
)

const conclusionSummaryMetrics = computed(() =>
    resolveStorySceneMetrics(conclusionSummaryInfo),
)

const conclusionTransportItems = computed(() =>
    conclusionTransportUsage.map((item) => ({
        ...item,
        image: conclusionImages[item.assetKey ?? item.imageKey],
        alt: getTranslation(item.labelKey),
    })),
)

const activeStoryScene = computed(
    () => storyScenes[activeStorySectionId.value] ?? accessibilityHappinessStory,
)

const activeStorySceneMetrics = computed(() =>
    resolveStorySceneMetrics(activeStoryScene.value),
)

const activeStorySceneTitleParams = computed(() => ({
    transportGroup: getTranslation(
        `transport_group_${selectedScrollingSetup.transportationId}`,
    ),
    transportMode: getTranslation(
        `transport_mode_${selectedScrollingSetup.transportationId}`,
    ),
    transportContext: getTranslation(
        `transport_context_${selectedScrollingSetup.transportationId}`,
    ),
    transportWithArticle: getTranslation(
        `transport_with_article_${selectedScrollingSetup.transportationId}`,
    ),
}))

const activeStoryCharacterTransportationAlt = computed(() => {
    const characterLabel = activeScrollingSetup.value.character?.labelKey
        ? getTranslation(activeScrollingSetup.value.character.labelKey)
        : ''
    const transportationLabel = activeScrollingSetup.value.transportation?.labelKey
        ? getTranslation(activeScrollingSetup.value.transportation.labelKey)
        : ''

    return getTranslation('story_character_transport_alt', {
        character: characterLabel,
        transportation: transportationLabel,
    })
})

const visibleStorySectionIds = computed(() =>
    Object.entries(storySectionIntersecting)
        .filter(([, isIntersecting]) => isIntersecting)
        .map(([sectionId]) => sectionId),
)

const hasVisibleStorySection = computed(
    () => visibleStorySectionIds.value.length > 0,
)

const activeStoryVisibilityBucket = computed(
    () => storySectionVisibility[activeStorySectionId.value] ?? 0,
)

const hasActiveStorySection = computed(
    () => activeStoryVisibilityBucket.value >= 50 && Boolean(activeStorySectionId.value),
)

const activeStorySectionSide = computed(
    () => storySectionSide[activeStorySectionId.value] ?? 'center',
)

function normalizeWheelDelta(event) {
    let delta = event.deltaY || event.deltaX

    if (delta === 0) {
        return 0
    }

    if (event.deltaMode === 1) {
        delta *= 16
    } else if (event.deltaMode === 2) {
        delta *= window.innerWidth
    }

    return delta
}

function handleSectionWheel(event) {
    const element = scrollingSection.value

    if (!element || element.scrollWidth <= element.clientWidth) {
        return
    }

    const delta = normalizeWheelDelta(event)

    if (delta === 0) {
        return
    }

    event.preventDefault()

    if (sectionScrollLockTimeout) {
        return
    }

    element.scrollBy({
        left: Math.sign(delta) * element.clientWidth,
        behavior: 'smooth',
    })

    sectionScrollLockTimeout = window.setTimeout(() => {
        sectionScrollLockTimeout = null
    }, 450)
}

function getStorySectionVisibilityBucket(ratio) {
    const percentage = Math.floor(ratio * 100)

    if (percentage < 20) {
        return 0
    }

    return Math.min(100, Math.floor(percentage / 10) * 10)
}

function getStorySectionViewportSide(entry) {
    if (!entry.rootBounds) {
        return 'center'
    }

    const sectionWidth = entry.boundingClientRect.width
    const viewportWidth = entry.rootBounds.width

    if (sectionWidth <= viewportWidth * 1.05) {
        return 'center'
    }

    const viewportCenter =
        entry.rootBounds.left + entry.rootBounds.width / 2
    const relativeCenter =
        (viewportCenter - entry.boundingClientRect.left) / sectionWidth

    if (relativeCenter <= 0.34) {
        return 'left'
    }

    if (relativeCenter >= 0.66) {
        return 'right'
    }

    return 'center'
}

function getStorySectionClasses(sectionId) {
    const visibilityBucket = storySectionVisibility[sectionId] ?? 0
    const isActiveSection =
        activeStorySectionId.value === sectionId && visibilityBucket >= 50
    const sectionSide = storySectionSide[sectionId] ?? 'center'

    return {
        'story-section--active': isActiveSection,
        [`active-${visibilityBucket}`]: visibilityBucket >= 20,
        [`active-side-${sectionSide}`]: isActiveSection,
    }
}

function getCharacterStateClasses() {
    const activeSection = activeStorySectionId.value
    const visibilityBucket = activeStoryVisibilityBucket.value
    const transportationId = selectedScrollingSetup.transportationId

    return {
        [`character-wrapper--${activeSection}`]:
            hasActiveStorySection.value && Boolean(activeSection),
        [`character-wrapper--transportation-${transportationId}`]:
            hasActiveStorySection.value && Boolean(transportationId),
        [`active-${visibilityBucket}`]:
            hasActiveStorySection.value && visibilityBucket >= 20,
        [`active-side-${activeStorySectionSide.value}`]:
            hasActiveStorySection.value,
    }
}

function getScrollingSectionStateClasses() {
    const activeSection = activeStorySectionId.value
    const visibilityBucket = activeStoryVisibilityBucket.value

    return {
        [`scrollying-section--active-${activeSection}`]:
            hasActiveStorySection.value && Boolean(activeSection),
        [`active-${visibilityBucket}`]:
            hasActiveStorySection.value && visibilityBucket >= 20,
        [`active-side-${activeStorySectionSide.value}`]:
            hasActiveStorySection.value,
    }
}

function getFullyVisibleItemClasses(itemId) {
    return {
        'is-fully-in-view': Boolean(fullyVisibleItems[itemId]),
    }
}


function scrollToCharacterSection() {
    const container = scrollingSection.value
    const targetSection = container?.querySelector('.choose-character-section')

    if (!container || !targetSection) {
        return
    }

    const previousScrollBehavior = container.style.scrollBehavior

    container.style.scrollBehavior = 'auto'
    container.scrollLeft = targetSection.offsetLeft

    requestAnimationFrame(() => {
        container.style.scrollBehavior = previousScrollBehavior
    })
}

function observeStorySections() {
    if (!scrollingSection.value) {
        return
    }

    const visibleRatios = new Map()

    storySectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const sectionId = entry.target.dataset.storySection

                if (!sectionId) {
                    return
                }

                storySectionIntersecting[sectionId] = entry.isIntersecting
                storySectionVisibility[sectionId] = getStorySectionVisibilityBucket(
                    entry.intersectionRatio,
                )
                storySectionSide[sectionId] = getStorySectionViewportSide(entry)

                if (entry.isIntersecting) {
                    visibleRatios.set(sectionId, entry.intersectionRatio)
                    return
                }

                visibleRatios.delete(sectionId)
            })

            let nextActiveSectionId = activeStorySectionId.value
            let highestRatio = 0

            visibleRatios.forEach((ratio, sectionId) => {
                if (ratio > highestRatio) {
                    highestRatio = ratio
                    nextActiveSectionId = sectionId
                }
            })

            if (highestRatio >= 0.5) {
                activeStorySectionId.value = nextActiveSectionId
                return
            }

            activeStorySectionId.value = ''
        },
        {
            root: scrollingSection.value,
            threshold: [0, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        },
    )

    scrollingSection.value
        .querySelectorAll(':scope > section[data-story-section]')
        .forEach((section) => {
            storySectionVisibility[section.dataset.storySection] = 0
            storySectionIntersecting[section.dataset.storySection] = false
            storySectionSide[section.dataset.storySection] = 'center'
            storySectionObserver?.observe(section)
        })
}

function observeFullyVisibleItems() {
    if (!scrollingSection.value) {
        return
    }

    fullyVisibleItemObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const itemId = entry.target.dataset.fullVisibilityItem

                if (!itemId) {
                    return
                }

                fullyVisibleItems[itemId] = entry.intersectionRatio >= 0.999
            })
        },
        {
            root: scrollingSection.value,
            threshold: [0, 1],
        },
    )

    scrollingSection.value
        .querySelectorAll('[data-full-visibility-item]')
        .forEach((element) => {
            const itemId = element.dataset.fullVisibilityItem

            if (!itemId) {
                return
            }

            fullyVisibleItems[itemId] = false
            fullyVisibleItemObserver?.observe(element)
        })
}

const handleModeChange = (newMode) => {
    if (newMode === "presenter") {
        activeMode.value = "view";
        const storyContainer = document.querySelector('.vrr-app');
        if (storyContainer?.requestFullscreen) {
            storyContainer.requestFullscreen();
            isPresenting.value = true;
        }
    } else {
        activeMode.value = newMode;
    }
};

const exitPresenter = () => {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    }
    isPresenting.value = false;
    activeMode.value = "view";
};

// watch(() => props.data, (newData) => {
//     if (!newData || newData.length === 0) return;
//     chartData.value = loadData(newData);
// }, { immediate: true });

onMounted(() => {
    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            isPresenting.value = false;
        }
    })

    scrollingSection.value?.addEventListener('wheel', handleSectionWheel, {
        passive: false,
    })

    observeStorySections()
    observeFullyVisibleItems()
})

onBeforeUnmount(() => {
    if (sectionScrollLockTimeout) {
        window.clearTimeout(sectionScrollLockTimeout)
        sectionScrollLockTimeout = null
    }

    scrollingSection.value?.removeEventListener('wheel', handleSectionWheel)
    storySectionObserver?.disconnect()
    storySectionObserver = null
    fullyVisibleItemObserver?.disconnect()
    fullyVisibleItemObserver = null
})

onUnmounted(() => {
    document.removeEventListener("fullscreenchange", () => { });
});
</script>

<template>
    <SideMenu v-if="!isPresenting" :active-mode="activeMode" :background="dresdenBackground"
        @mode-change="handleModeChange"
        @update:background="val => { bgTintColor = val.tint; bgTintOpacity = val.opacity }" />
    <button v-if="isPresenting" class="exit-presenter" @click="exitPresenter">Präsentationsansicht beenden</button>
    <section ref="scrollingSection" class="scrollying-section" :class="getScrollingSectionStateClasses()"
        :style="{ '--bg-tint': bgTintColor, '--bg-tint-opacity': bgTintOpacity }" :data-active-story-section="hasActiveStorySection ? activeStorySectionId : undefined
            " :data-active-story-visibility="hasActiveStorySection ? activeStoryVisibilityBucket : undefined
                " :data-active-story-side="hasActiveStorySection ? activeStorySectionSide : undefined
                    ">
        <section class="intro-section">
            <div class="intro-section__content">
                <h1>
                    <EditableTextField :model-value="headers.section1"
                        @update:model-value="val => headers.section1 = val" :active-mode="activeMode" :rows="1"
                        :width="`75vw`" :font-size="'7vh'" :line-height="1" :padding="'0vh'" :font-weight="400"
                        :text-align="'center'" :text-transform="'uppercase'" :letter-spacing="'0.08em'" />
                </h1>
                <h2>
                    <EditableTextField :model-value="texts.section1" @update:model-value="val => texts.section1 = val"
                        :active-mode="activeMode" :rows="5" :width="`80rem`" :font-size="'2.5vw'" :line-height="1.35"
                        :padding="'0vh'" :font-weight="400" :text-align="'center'" :text-transform="'uppercase'"
                        :letter-spacing="'0.06em'" />
                </h2>
                <div class="intro-section__cta">
                    <label>{{ getTranslation('intro_cta') }}</label>
                    <img :src="arrowIcon" alt="" aria-hidden="true" class="intro-section__arrow">
                </div>
            </div>
        </section>

        <section class="choose-character-section">
            <div class="selection-section__content">
                <h1>
                    <EditableTextField :model-value="headers.section2"
                        @update:model-value="val => headers.section2 = val" :active-mode="activeMode" :rows="1"
                        :width="`75vw`" :font-size="'7vh'" :line-height="1" :padding="'0vh'" :font-weight="400"
                        :text-align="'center'" :text-transform="'uppercase'" :letter-spacing="'0.08em'" />
                </h1>
                <div class="character-grid" role="list" :aria-label="getTranslation('choose_character_aria_label')">
                    <button v-for="character in scrollingSetupOptions.characters" :key="character.id" type="button"
                        class="character-card" :class="{
                            'character-card--active':
                                selectedScrollingSetup.characterId === character.id,
                        }" @click="selectedScrollingSetup.characterId = character.id">
                        <img :src="character.image" :alt="getTranslation(character.labelKey)"
                            class="character-card__image">
                    </button>
                </div>
            </div>
        </section>
        <section class="choose-city-section">
            <div class="selection-section__content">
                <h1>
                    <EditableTextField :model-value="headers.section3"
                        @update:model-value="val => headers.section3 = val" :active-mode="activeMode" :rows="1"
                        :width="`75vw`" :font-size="'7vh'" :line-height="1" :padding="'0vh'" :font-weight="400"
                        :text-align="'center'" :text-transform="'uppercase'" :letter-spacing="'0.08em'" />
                </h1>
                <DresdenMap v-model="selectedScrollingSetup.cityPartId" class="city-map" />

                <div class="city-selection-character">
                    <div class="city-selection--speech-bubble">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 228 106" fill="none">
                            <path
                                d="M20 2.5H193.217C202.882 2.50003 210.717 10.335 210.717 20V63.7695C210.717 67.2709 211.529 70.6944 213.046 73.8252C215.48 78.85 219.522 87.4086 222.363 94.5273C223.708 97.8965 224.73 100.816 225.212 102.852C216.262 100.072 198.578 93.3114 190.977 90.3701C188.362 89.3585 185.593 88.8369 182.785 88.8369H20C10.335 88.8369 2.5 81.0019 2.5 71.3369V20C2.5 10.335 10.335 2.5 20 2.5Z"
                                fill="white" stroke="#456990" stroke-width="5" />
                        </svg>
                        <label>{{ getTranslation('choose_city_prompt') }}</label>
                    </div>
                    <img :src="activeScrollingSetup.character?.image"
                        :alt="getTranslation(activeScrollingSetup.character?.labelKey)">
                </div>
            </div>
        </section>
        <section class="choose-transportation-section">
            <div class="selection-section__content">
                <h1>
                    <EditableTextField :model-value="headers.section4"
                        @update:model-value="val => headers.section4 = val" :active-mode="activeMode" :rows="1"
                        :width="`75vw`" :font-size="'7vh'" :line-height="1" :padding="'0vh'" :font-weight="400"
                        :text-align="'center'" :text-transform="'uppercase'" :letter-spacing="'0.08em'" />
                </h1>
                <div class="transportation-grid" role="list"
                    :aria-label="getTranslation('choose_transportation_aria_label')">
                    <TransportationOptionCard v-for="(transportation, index) in scrollingSetupOptions.transportation"
                        :key="transportation.id" :option="transportation" :class="index % 2 == 0 ? 'even' : 'odd'"
                        :selected="selectedScrollingSetup.transportationId === transportation.id
                            " @select="
                                selectedScrollingSetup.transportationId = transportation.id
                                " />
                </div>
            </div>
        </section>



        <!-- Character in Story -->
        <div v-if="hasActiveStorySection" class="character-wrapper" :class="getCharacterStateClasses()">
            <img v-if="activeStoryCharacterTransportationImage" :src="activeStoryCharacterTransportationImage"
                :alt="activeStoryCharacterTransportationAlt" class="story-character-transportation">
            <article class="speech-bubble">
                <svg class="speech-bubble-bottom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 213 114" fill="none">
                    <path
                        d="M24.3809 108.27C-53.8085 145.629 85.6407 -11.3606 34.3418 -26.0945C-16.957 -40.8284 240.039 -50.5256 210.651 -26.0945C181.262 -1.66349 102.57 70.9105 24.3809 108.27Z"
                        fill="white" />
                </svg>
                <SpeechBubbleContent :title-key="activeStoryScene.titleKey" :title-params="activeStorySceneTitleParams"
                    :lines="activeStoryScene.bubble" :metrics="activeStorySceneMetrics" :active-mode="activeMode"
                    :edit-mode-active="editModeActive" />
            </article>
        </div>



        <!-- Story -->
        <section class="accessibility-happiness-section" :class="getStorySectionClasses('accessibility-happiness')"
            :data-story-active="activeStorySectionId === 'accessibility-happiness' &&
                activeStoryVisibilityBucket >= 50
                " data-story-section="accessibility-happiness">
            <div class="building-image-wrapper">
                <img src="@img/Dresden/building.png" alt="" class="building-image" />

                <ul class="building-metrics-list">
                    <li v-for="metric in accessibilityHappinessTowerSegments" :key="metric.key"
                        class="building-metrics-list__item" :style="{
                            height: metric.height,
                            backgroundColor: `color-mix(in srgb, ${metric.color} 80%, transparent)`,
                        }">
                        {{ metric.value }}%
                    </li>
                </ul>
            </div>
        </section>

        <section class="accessibility-road-section" :class="getStorySectionClasses('accessibility-road')"
            :data-story-active="activeStorySectionId === 'accessibility-road' &&
                activeStoryVisibilityBucket >= 50
                " data-story-section="accessibility-road">
            <div class="building-image-wrapper">
                <img src="@img/Dresden/building.png" alt="" class="building-image" />

                <ul class="building-metrics-list">
                    <li v-for="metric in accessibilityRoadTowerSegments" :key="metric.key"
                        class="building-metrics-list__item" :style="{
                            height: metric.height,
                            backgroundColor: `color-mix(in srgb, ${metric.color} 80%, transparent)`,
                        }">
                        {{ metric.value }}%
                    </li>
                </ul>
            </div>
        </section>

        <section class="safety-section" :class="getStorySectionClasses('safety')" :data-story-active="activeStorySectionId === 'safety' &&
            activeStoryVisibilityBucket >= 50
            " data-story-section="safety">
            <div class="trees-wrapper">
                <div v-for="treeItem in safetyTreeItems" :key="treeItem.id" class="tree-wrapper"
                    :class="`tree-wrapper--${treeItem.id}`">
                    <img :src="treeItem.image" alt="" class="tree" />
                    <h3 class="tree-value" :class="`tree-value--${treeItem.tone}`">
                        {{ treeItem.value }}%
                    </h3>
                </div>

                <div class="trees-info white-info-box">
                    <SpeechBubbleContent :title-key="safetyDetailsStory.titleKey"
                        :title-params="safetyDetailsTitleParams" :lines="safetyDetailsStory.bubble"
                        :metrics="safetyDetailsMetrics" />
                </div>
            </div>
        </section>

        <section class="others-question-section" :class="getStorySectionClasses('others-question')" :data-story-active="activeStorySectionId === 'others-question' &&
            activeStoryVisibilityBucket >= 50
            " data-story-section="others-question">
            <img src="@img/Dresden/cloud.png" alt="" class="cloud-image cloud-1" />
            <img src="@img/Dresden/cloud.png" alt="" class="cloud-image cloud-2" />
            <div class="traffic-light-wrapper">
                <img src="@img/Dresden/traffic-light.png" alt="" class="traffic-light" />
            </div>
            <div class="white-info-box cloud-info-box">
                <SpeechBubbleContent :title-key="othersAcceptanceInfo.titleKey" :lines="othersAcceptanceInfo.bubble"
                    :metrics="othersAcceptanceMetrics" />
            </div>
        </section>

        <section class="others-answers-section" :class="getStorySectionClasses('others-answers')" :data-story-active="activeStorySectionId === 'others-answers' &&
            activeStoryVisibilityBucket >= 50
            " data-story-section="others-answers">
            <div class="white-info-box info-box-top">
                <StoryInfoBox :blocks="othersEbikesInfo.blocks" :metrics="othersEbikesMetrics" />
            </div>
            <div class="white-info-box info-box-bottom">
                <StoryInfoBox :blocks="othersBikeSharingInfo.blocks" :metrics="othersBikeSharingMetrics" />
            </div>
        </section>

        <section class="conclusion-section" :class="getStorySectionClasses('conclusion')" :data-story-active="activeStorySectionId === 'conclusion' &&
            activeStoryVisibilityBucket >= 50
            " data-story-section="conclusion">
            <div class="white-info-box conclusion-summary-box">
                <StoryInfoBox :blocks="conclusionSummaryInfo.blocks" :metrics="conclusionSummaryMetrics" />
            </div>

            <div class="conclusion-transport-list">
                <ConclusionTransportUsage v-for="item in conclusionTransportItems" :key="item.id"
                    class="conclusion-transport-list__item" :class="[
                        `conclusion-transport-list__item--${item.id}`,
                        getFullyVisibleItemClasses(item.id),
                    ]" :image="item.image" :alt="item.alt" :value="item.value" :data-full-visibility-item="item.id"
                    :data-fully-visible="fullyVisibleItems[item.id] ? 'true' : 'false'" />
            </div>
        </section>

        <section class="end-section" :class="getStorySectionClasses('end')" :data-story-active="activeStorySectionId === 'end' &&
            activeStoryVisibilityBucket >= 50
            " data-story-section="end">
            <div class="end-cta-card">
                <h2>{{ getTranslation('end_cta_question') }}</h2>
                <button type="button" class="end-cta-card__button" @click.prevent.stop="scrollToCharacterSection">
                    <span>{{ getTranslation('end_cta_button') }}</span>
                    <img :src="arrowIcon" alt="" aria-hidden="true" class="end-cta-card__arrow">
                </button>
            </div>
        </section>
    </section>
</template>


<style>
.scrollying-section {
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    width: 100vw;
    height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
    overscroll-behavior: contain;
    touch-action: pan-x;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;

    background: url('@img/Dresden/bg.jpg') no-repeat;
    background-size: cover;
}

.scrollying-section>* {
    position: relative;
    z-index: 1;
}


.scrollying-section>section {
    flex: 0 0 100vw;
    min-width: 100vw;
    height: 100%;
    scroll-snap-align: start;
    scroll-snap-stop: always;

    display: flex;
    align-items: stretch;
    padding: 5vh 34px;
}

.scrollying-section::before {
    content: '';
    position: fixed;
    inset: 0;
    background-color: var(--bg-tint, transparent);
    opacity: var(--bg-tint-opacity, 0);
    pointer-events: none;
    z-index: 0;
    mix-blend-mode: multiply;
}


.intro-section__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 10vh;
}

/* .intro-section h2 {
    max-width: 64rem;
} */

.intro-section__cta {
    display: inline-flex;
    align-items: center;
    gap: 1rem;
    align-self: flex-end;
}

.intro-section__cta label {
    cursor: default;
}

.intro-section__arrow {
    width: 2.75rem;
    height: auto;
}





.selection-section__content {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    text-align: center;
}

.character-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: end;
    gap: 5vw;
    width: 100%;
    max-width: 70vw;
    padding: 5vh 0;
}

.character-card {
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    filter: drop-shadow(0 5px 15px color-mix(in srgb, var(--green), transparent 100%)) drop-shadow(0 0px 1px color-mix(in srgb, var(--blue-dark), transparent 100%));
    transition:
        transform 0.2s ease,
        filter 0.2s ease;
}

.character-card:hover,
.character-card:focus-visible,
.character-card--active {
    transform: translateY(-0.5rem) scale(1.1);
    filter: drop-shadow(0 5px 15px color-mix(in srgb, var(--green), transparent 0%)) drop-shadow(0 0px 1px color-mix(in srgb, var(--blue-dark), transparent 100%));
}

.character-card--active,
.character-card--active:hover {
    filter: drop-shadow(0 5px 15px color-mix(in srgb, var(--green), transparent 0%)) drop-shadow(0 0px 1px color-mix(in srgb, var(--blue-dark), transparent 0%));
}

.character-card__image {
    width: 100%;
    max-width: 25vw;
    max-height: 60vh;
    object-fit: contain;
}



.choose-city-section .selection-section__content {
    position: relative;
    gap: 8vh;
    justify-content: flex-start;
}

.city-map {
    width: 100%;
    max-height: 60vh;
}

.choose-city-section .selection-section__content .city-selection-character {
    position: absolute;
    bottom: 0px;
    right: 34px;
    height: 30vh;
}

.choose-city-section .selection-section__content .city-selection-character img {
    max-height: 100%;
}

.choose-city-section .selection-section__content .city-selection--speech-bubble {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate3d(-100%, -20%, 0);
}

.choose-city-section .selection-section__content .city-selection--speech-bubble svg {
    width: 15ch;
}

.choose-city-section .selection-section__content .city-selection--speech-bubble label {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 1.2rem;

    transform: translate3d(-50%, -60%, 0);
}




.choose-transportation-section {
    display: flex;
    align-items: stretch;
    justify-content: center;
    padding: 2.875rem 5rem 4rem;
}


.transportation-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2rem 3rem;
    width: 100%;
    max-width: 64rem;
    padding-bottom: 5vh;
}
</style>

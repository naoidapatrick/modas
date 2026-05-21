<script setup>
import { ref, computed, watch } from 'vue';
import { selectedColour, mapLayersConfig } from '@src/composables/utils.js';
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

const emit = defineEmits(['hallClick', 'layerToggle', 'searchCity']);
const mapUtils = useMapUtils();

const searchTerm = ref('');
const showSuggestions = ref(false);

// unique cities for suggestions
const uniqueCities = computed(() => {
    const cities = [...new Set(props.data.map(hall => hall.city))];
    return cities.sort();
});

// Filter suggestions based on search term
const filteredSuggestions = computed(() => {
    if (!searchTerm.value) {
        return [];
    }
    return uniqueCities.value.filter(city =>
        city.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
});

const visibleHalls = computed(() => {
    let filtered = props.data.filter(hall => {
        const layer = mapUtils.determineTownhallLayer(hall);
        return props.visibleLayers[layer];
    });

    if (searchTerm.value) {
        filtered = filtered.filter(hall =>
            hall.city.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
    }

    // sort alphabetically by city first, then by town hall name
    return filtered.sort((a, b) => {
        const cityCompare = a.city.localeCompare(b.city);
        if (cityCompare !== 0) return cityCompare;
        return a.townHall.localeCompare(b.townHall);
    });
});

const handleHallClick = (hall) => {
    const markerId = mapUtils.createMarkerId(hall);
    emit('hallClick', { hall, markerId });
};

// Search handlers
const handleSearchInput = () => {
    showSuggestions.value = searchTerm.value;

    if (searchTerm.value.length >= 2) {
        const matchingHalls = props.data.filter(hall =>
            hall.city.toLowerCase().includes(searchTerm.value.toLowerCase())
        );
        if (matchingHalls.length > 0) {
            emit('searchCity', {
                searchTerm: searchTerm.value,
                halls: matchingHalls
            });
        }
    }
};

const selectSuggestion = (city) => {
    searchTerm.value = city;
    showSuggestions.value = false;

    const cityHalls = props.data.filter(hall => hall.city === city);
    if (cityHalls.length > 0) {
        emit('searchCity', {
            searchTerm: city,
            halls: cityHalls
        });
    }
};

const clearSearch = () => {
    searchTerm.value = '';
    showSuggestions.value = false;
    emit('searchCity', { searchTerm: '', halls: [] });
};

// Watch for selected marker changes and scroll to it
watch(() => props.selectedMarkerId, (newSelectedId) => {
    if (newSelectedId) {
        const selectedElement = document.querySelector(`.hall-item[data-marker-id="${newSelectedId}"]`);
        if (selectedElement) {
            const container = selectedElement.closest('.hall-list-container');
            if (container) {
                const containerRect = container.getBoundingClientRect();
                const elementRect = selectedElement.getBoundingClientRect();

                // Only scroll if the element is not visible in the container
                const isVisible = elementRect.left >= containerRect.left &&
                    elementRect.right <= containerRect.right;

                if (!isVisible) {
                    const scrollLeft = container.scrollLeft + elementRect.left - containerRect.left - containerRect.width / 2 + elementRect.width / 2;

                    container.scrollTo({
                        left: scrollLeft,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }
});
</script>

<template>
    <div class="hall-list" :style="{ '--selectedColour': selectedColour }">
        <div class="hall-list-header">
            <div class="searchBar">
                <input type="text" placeholder="Stadt suchen..." v-model="searchTerm" @input="handleSearchInput" />

                <!-- Search suggestions dropdown -->
                <div v-if="showSuggestions && filteredSuggestions.length > 0" class="search-suggestions">
                    <div v-for="city in filteredSuggestions" :key="city" @click="selectSuggestion(city)"
                        class="suggestion-item">
                        {{ city }}
                    </div>
                </div>
            </div>
            <div class="hall-count">
                {{ visibleHalls.length }} von {{ data.length }} Rathäusern
            </div>
        </div>
        <div class="hall-list-container">
            <div v-for="hall in visibleHalls" :key="mapUtils.createMarkerId(hall)" class="hall-item"
                :class="{ 'selected': mapUtils.isSelected(hall, props.selectedMarkerId) }"
                :data-marker-id="mapUtils.createMarkerId(hall)" @click="handleHallClick(hall)">
                <div class="hall-details">
                    <h2>{{ hall.city }}</h2>
                    <h3>{{ `${hall.townHall}, ${hall.street}` }}</h3>
                    <p>{{ mapUtils.getDistanceText(hall) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hall-list {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 13px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    overflow: hidden;
}

.hall-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding: 0.5rem 1.5rem;
}

.searchBar {
    position: relative;
}

.searchBar input {
    padding: 0.3rem 1rem;
    padding-right: 2rem;
    border: 1px solid #ccc;
    border-radius: 20px;
    font-size: 0.9rem;
    background-color: white;
    color: #666;
}

.searchBar input:focus {
    outline: none;
    border-color: var(--selectedColour);
    border-width: 1.5px;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
}

.search-suggestions {
    position: absolute;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ccc;
    border-top: none;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 200px;
    overflow-y: auto;
}

.suggestion-item {
    padding: 0.5rem 1rem;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:hover {
    background: #f8f9fa;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.hall-count {
    padding: 0.5rem 1.5rem;
    font-size: 0.9rem;
    color: #666;
}

.hall-list-container {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: row;
    align-items: stretch;
}

.hall-item {
    padding: 10px 15px;
    border-right: 1px solid #f0f0f0;
    cursor: pointer;
    transition: all 0.2s ease;
    background: white;
    white-space: nowrap;
    width: 20%;
    flex-shrink: 0;
}

.hall-item:hover {
    background: #f8f9fa;
}

.hall-item.selected {
    background: #fdf2f8;
    border-left: 4px solid var(--selectedColour);
}

.hall-details {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.hall-details h2,
.hall-details h3,
.hall-details p {
    margin: 0;
    text-wrap: balance;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'General Sans';
    line-height: normal;
    letter-spacing: normal;
    text-transform: none;
    text-shadow: none;
    -webkit-text-stroke: 0px;
}

.hall-details h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
    font-weight: 700;
}

.hall-details h3 {
    margin: 0;
    font-size: 0.95rem;
    color: #555;
    font-weight: 500;
}

.hall-details p {
    margin: 0;
    font-size: 0.85rem;
    color: #777;
}

.hall-list-container::-webkit-scrollbar {
    width: 6px;
}

.hall-list-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.hall-list-container::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.hall-list-container::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* Mobile-specific scrollbar fixes */
@supports (-webkit-overflow-scrolling: touch) {
    .hall-list-container {
        -webkit-overflow-scrolling: touch;
    }
}

@media (max-width: 768px) {
    .hall-list-container {
        scrollbar-width: auto;
        -webkit-overflow-scrolling: touch;
    }

    .hall-list-container::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        display: block;
    }

    .hall-list-container::-webkit-scrollbar-thumb {
        background: #999;
    }

    .hall-list-header {
        padding: 0.2rem 1rem;
    }

    .searchBar input {
        padding: 0.2rem 0.8rem;
        font-size: 14px;
    }

    .hall-count {
        font-size: 12px;
        text-align: center;
    }

    .hall-item {
        width: 55%;
    }

    .suggestion-item {
        padding: 0.4rem 0.8rem;
        font-size: 14px;
    }

    .hall-item {
        border-width: 1.5px;
    }

    .hall-details h2 {
        font-size: 16px;
    }

    .hall-details h3 {
        font-size: 13px;
    }

    .hall-details p {
        font-size: 12px;
    }
}

@media (min-width: 2560px) {
    .hall-list {
        border-radius: 20px;
    }

    .hall-list-header {
        padding: 0.6rem 1.8rem;
        border-width: 2px;
    }

    .searchBar input {
        padding: 0.4rem 1.5rem;
        font-size: 22px;
        border-width: 1.8px;
        border-radius: 30px;
    }

    .searchBar input:focus {
        border-width: 2.2px;
    }

    .search-suggestions {
        border-width: 2px;
    }

    .suggestion-item {
        font-size: 20px;
        padding: 0.6rem 1.2rem;
        border-width: 2px;
    }

    .hall-count {
        font-size: 22px;
    }

    .hall-item {
        padding: 10px 20px;
        border-width: 3px;
    }

    .hall-details h2 {
        font-size: 24px;
    }

    .hall-details h3 {
        font-size: 19px;
    }

    .hall-details p {
        font-size: 18px;
    }
}

@media (min-width: 3440px) {
    .hall-list {
        border-radius: 20px;
    }

    .hall-list-header {
        padding: 1.2rem 2.2rem;
        border-width: 3px;
    }

    .searchBar input {
        padding: 0.6rem 1.5rem;
        font-size: 28px;
        border-width: 1.8px;
        border-radius: 30px;
    }

    .searchBar input:focus {
        border-width: 2.2px;
    }

    .search-suggestions {
        border-width: 2px;
    }

    .suggestion-item {
        font-size: 22px;
        padding: 0.8rem 1.2rem;
        border-width: 3px;
    }

    .hall-count {
        font-size: 26px;
    }

    .hall-item {
        padding: 15px 25px;
        border-width: 4px;
        width: 18%;
    }

    .hall-details h2 {
        font-size: 28px;
    }

    .hall-details h3 {
        font-size: 22px;
    }

    .hall-details p {
        font-size: 20px;
    }
}
</style>
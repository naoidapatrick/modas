<script setup>
import { useTranslations } from '@composables/Dresden/useTranslations.js'

defineProps({
    option: {
        type: Object,
        required: true,
    },
    selected: {
        type: Boolean,
        default: false,
    },
})

defineEmits(['select'])

const { getTranslation } = useTranslations()
</script>

<template>
    <button
        type="button"
        class="transportation-card"
        :class="{ 'transportation-card--selected': selected }"
        @click="$emit('select')"
    >
        <img
            :src="option.image"
            :alt="getTranslation(option.labelKey)"
            class="transportation-card__image"
        >
        <h3 class="transportation-card__label">{{ getTranslation(option.labelKey) }}</h3>
    </button>
</template>

<style scoped>
.transportation-card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    width: 100%;
    height: 25vh;
    max-height: 300px;
    padding: 1.5rem 2rem;
    border: 4px solid rgba(255, 255, 255, 0.9);
    border-radius: 1.625rem;
    background: rgba(255, 183, 3, 0.2);
    box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.08);
    cursor: pointer;
    transition:
        transform 0.18s ease,
        box-shadow 0.18s ease,
        border-color 0.18s ease;
}

.transportation-card.odd {
    align-items: flex-end;
}

.transportation-card:hover,
.transportation-card:focus-visible,
.transportation-card--selected {
    transform: translateY(-0.25rem);
    border-color: var(--yellow);
    box-shadow: 0 0.85rem 1.75rem rgba(0, 0, 0, 0.14);
}

.transportation-card__image {
    flex: 0 1 auto;
    width: auto;
    height: 14vh;
    object-fit: contain;
}

.transportation-card__label {
    font-size: 1.8rem;
    width: 100%;
    text-align: right;
}

.transportation-card.odd .transportation-card__label {
    text-align: left;
}

@media (max-width: 900px) {
    .transportation-card {
        height: 25vh;
        max-height: 300px;
        padding: 1.125rem 1.5rem 1rem;
    }

    .transportation-card__image {
        max-width: 9rem;
        max-height: 6.25rem;
    }
}
</style>

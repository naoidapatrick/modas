<script setup>
import EditableTextField from '@src/components/EditableTextField.vue';
import { ref, watch } from 'vue';

const props = defineProps({
    activeMode: { type: String, default: 'view' },
    modelValue: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);
</script>

<template>
    <div class="heading">
        <div>
            <EditableTextField :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
                :active-mode="activeMode" :font-size="'24px'" :line-height="1" :padding="'1vh'" :font-weight="'bold'"
                :rows="1" :width="'95%'" />
        </div>
    </div>
</template>

<style scoped>
.heading {
    width: 100%;
    height: fit-content;
    display: flex;
    position: sticky;
    top: 2vh;
    align-items: center;
    color: white;
    margin: 5% 0 5% 0;
    z-index: 12;
}

.heading>div {
    width: 60%;
    background-color: #760B5A;
    padding: 0.5rem 0 0.5rem 2rem;
    border-radius: 0 10px 10px 0;
    align-items: center;
    z-index: 2;
}
</style>
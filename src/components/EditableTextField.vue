<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    textContent: String,
    activeMode: String,
    rows: { type: Number, default: 7 },
    width: { type: String, default: '60%' },
    fontSize: { type: String, default: '36px' },
    lineHeight: { type: Number, default: '1.3' },
    padding: { type: String, default: '0vh' },
    textAlign: { type: String, default: 'left' },
    fontWeight: { type: String, default: 'normal' },
    borderRadius: { type: String, default: '12px' },
    textTransform: { type: String, default: 'none' },
    letterSpacing: { type: String, default: 'normal' }
});

const emit = defineEmits(['update:textContent']);
const textAreaRef = ref(null);

// Reset scroll to top when leaving edit mode
watch(() => props.activeMode, (newMode) => {
    if (newMode !== 'edit' && textAreaRef.value) {
        const el = textAreaRef.value.$el.querySelector('textarea');
        if (el) el.scrollTop = 0;
    }
});
</script>

<template>
    <v-textarea ref="textAreaRef" class="editable-text-comp" :text-content="textContent"
        @update:text-content="val => emit('update:textContent', val)" :readonly="activeMode !== 'edit'" variant="plain"
        hide-details no-resize :rows="rows" :style="{
            '--custom-font-size': fontSize,
            '--custom-width': width,
            '--rows': rows,
            '--custom-line-height': lineHeight,
            '--padding': padding,
            '--custom-text-align': textAlign,
            '--custom-font-weight': fontWeight,
            '--custom-border-radius': borderRadius,
            '--custom-text-transform': textTransform,
            '--custom-letter-spacing': letterSpacing
        }"></v-textarea>
</template>

<style scoped>
.editable-text-comp {
    width: var(--custom-width);
    pointer-events: auto;
}

.editable-text-comp :deep(.v-field) {
    min-height: calc(var(--rows, 15) * 1.3 * var(--custom-font-size)) !important;
    display: flex;
    padding: 5px;
    align-items: center;
    border-radius: var(--custom-border-radius);
    border: 1px solid transparent;
    transition: all 0.3s ease;
}

.editable-text-comp :deep(textarea) {
    width: 100%;
    height: auto !important;
    max-height: 60vh;
    font-size: var(--custom-font-size) !important;
    font-weight: var(--custom-font-weight) !important;
    text-align: var(--custom-text-align);
    line-height: var(--custom-line-height) !important;
    letter-spacing: var(--custom-letter-spacing);
    text-transform: var(--custom-text-transform);
}

.editable-text-comp:not(.v-input--readonly) :deep(.v-field) {
    background-color: rgba(255, 255, 255, 0.15) !important;
    border: 1px dashed #808080;
}

.editable-text-comp:not(.v-input--readonly) :deep(textarea) {
    overflow-y: auto !important;
    cursor: text !important;
}

.editable-text-comp :deep(.v-input__control) {
    height: fit-content;
    padding: var(--padding) 0 !important;
}

.editable-text-comp :deep(.v-field--variant-plain) {
    --v-field-padding-top: 0;
}
</style>

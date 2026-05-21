<script setup>
import EditableTextField from '@src/components/EditableTextField.vue';

defineProps({
    phaseTitle: {
        type: String,
        required: true
    },
    phaseDescription: {
        type: String,
        required: true
    },
    characterImage: {
        type: String,
        required: true
    },
    characterAlt: {
        type: String,
        required: true
    },
    phaseClass: {
        type: String,
        default: 'phase1'
    },
    activeMode: {
        type: String,
        default: 'view'
    }
});
</script>

<template>
    <div class="phase-card" :class="phaseClass">
        <div class="phase-text">
            <EditableTextField :model-value="phaseTitle" @update:model-value="$emit('update:phaseTitle', $event)"
                :active-mode="activeMode" :rows="1" :width="'100%'" :font-size="'32px'" :line-height="1.2"
                :padding="'0'" :font-weight="'bold'" />
            <EditableTextField :model-value="phaseDescription"
                @update:model-value="$emit('update:phaseDescription', $event)" :active-mode="activeMode" :rows="2"
                :width="'100%'" :font-size="'24px'" :line-height="1.5" :padding="'0'"
                :font-weight="'normal'" />
        </div>
        <img :src="characterImage" :alt="characterAlt">
    </div>
</template>

<style scoped>
.phase-card {
    height: 100%;
    width: 23%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 15px;
    overflow: hidden;
    box-sizing: border-box;
}

.phase1 {
    left: 28%;
}

.phase2 {
    right: 24%;
}

.phase-text {
    width: 100%;
    padding: 12px 24px;
    z-index: 100;
}

.phase-card img {
    position: absolute;
    bottom: 10%;
    width: 90%;
    max-height: 50%;
}
</style>
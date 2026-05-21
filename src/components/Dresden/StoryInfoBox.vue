<script setup>
import { computed } from 'vue'
import { useTranslations } from '@composables/Dresden/useTranslations.js'

const props = defineProps({
  blocks: {
    type: Array,
    default: () => [],
  },
  metrics: {
    type: Object,
    default: () => ({}),
  },
})

const { getTranslation } = useTranslations()

const resolvedBlocks = computed(() =>
  props.blocks.map((block) => ({
    ...block,
    segments: block.segments.map((segment) => {
      if (segment.type === 'metric') {
        return {
          ...segment,
          value: `${props.metrics[segment.key]} %`,
        }
      }

      return {
        ...segment,
        value: getTranslation(segment.key),
      }
    }),
  })),
)
</script>

<template>
  <div class="info-box-content">
    <template v-for="block in resolvedBlocks" :key="block.id">
      <p v-if="block.type === 'paragraph'" class="info-box-content__paragraph">
        <template v-for="(segment, index) in block.segments" :key="`${block.id}-${index}`">
          <strong v-if="segment.type === 'highlight'">{{ segment.value }}</strong>
          <span v-else>{{ segment.value }}</span>
        </template>
      </p>

      <div v-else class="info-box-content__bullet">
        <span class="info-box-content__bullet-mark">•</span>
        <p class="info-box-content__bullet-text">
          <template v-for="(segment, index) in block.segments" :key="`${block.id}-${index}`">
            <strong v-if="segment.type === 'highlight'">{{ segment.value }}</strong>
            <span v-else>{{ segment.value }}</span>
          </template>
        </p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.info-box-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-box-content__paragraph,
.info-box-content__bullet-text {
  margin: 0;
}

.info-box-content__paragraph,
.info-box-content__bullet {
  font-family: var(--font-family-display);
  line-height: 1.15;
  letter-spacing: 0.12em;
  color: var(--black);
}

.info-box-content__bullet {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
}

.info-box-content__bullet-mark {
  flex: 0 0 auto;
  line-height: 1;
  transform: translateY(0.15em);
}
</style>

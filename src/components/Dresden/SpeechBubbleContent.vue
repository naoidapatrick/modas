<script setup>
import { computed, ref } from 'vue'
import { useTranslations } from '@composables/Dresden/useTranslations.js'
import EditableTextField from '@src/components/EditableTextField.vue';

const props = defineProps({
  titleKey: {
    type: String,
    default: '',
  },
  titleParams: {
    type: Object,
    default: () => ({}),
  },
  lines: {
    type: Array,
    default: () => [],
  },
  metrics: {
    type: Object,
    required: true,
  },
  activeMode: {
    type: String,
    default: 'view',
  },
  editModeActive: {
    type: Boolean,
    default: false,
  },
})

const { getTranslation, setTranslation } = useTranslations()

const resolvedLines = computed(() =>
  props.lines.map((line) => ({
    ...line,
    segments: line.segments.map((segment) => {
      if (segment.type === 'metric') {
        return {
          ...segment,
          value: `${props.metrics[segment.key]}%`,
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
  <div class="speech-content">
    <p v-if="titleKey" class="speech-content__title">
      <EditableTextField v-if="editModeActive" :model-value="getTranslation(titleKey, titleParams)"
        @update:model-value="val => setTranslation(titleKey, val)" :active-mode="activeMode" :rows="3" :width="`100%`"
        :font-size="'1.2rem'" :line-height="1.35" :padding="'0vh'" :font-weight="400" :text-align="'left'"
        :text-transform="'none'" :letter-spacing="'0.1em'" />
      <span v-else>{{ getTranslation(titleKey, titleParams) }}</span>
    </p>

    <ul v-if="resolvedLines.length" class="speech-content__list">
      <li v-for="line in resolvedLines" :key="line.id" class="speech-content__item">
        <template v-for="(segment, index) in line.segments" :key="`${line.id}-${index}`">
          <span v-if="segment.type === 'highlight'" class="speech-content__highlight"
            :class="`speech-content__highlight--${segment.tone}`">
            {{ segment.value }}
          </span>
          <span v-else>{{ segment.value }}</span>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.speech-content {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.speech-content__title {
  white-space: pre-line;
}

.speech-content__list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin: 0;
  padding-left: 1.5rem;
  list-style: square;
}

.speech-content__item {
  font-family: var(--font-family-display);
  line-height: 1.35;
  letter-spacing: 0.12em;
  color: var(--black);
}

.speech-content__highlight {
  text-decoration-line: underline;
  text-decoration-thickness: 0.18em;
  text-underline-offset: 0.18em;
  text-decoration-skip-ink: none;
}

.speech-content__highlight--blue {
  text-decoration-color: var(--blue);
}

.speech-content__highlight--mint {
  text-decoration-color: var(--mint);
}

.speech-content__highlight--yellow {
  text-decoration-color: var(--yellow);
}

.speech-content__highlight--orange-soft {
  text-decoration-color: var(--orange-soft);
}

.speech-content__highlight--orange-light {
  text-decoration-color: var(--orange-light);
}

.speech-content__highlight--blush {
  text-decoration-color: var(--blush);
}

.speech-content__highlight--taupe-light {
  text-decoration-color: var(--taupe-light);
}
</style>

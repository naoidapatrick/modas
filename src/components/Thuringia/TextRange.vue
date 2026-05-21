<script setup>
import { useTextStats } from '@composables/Thuringia/useTextStats.js';
import { computed, toRef } from 'vue';
import { defaultCategoryColours, rangeKeyByRangeIndex } from '@src/composables/utils.js';
import { useColumnLabels } from '@composables/useColumnLabels.js';
import EditableTextField from '@src/components/EditableTextField.vue';

const props = defineProps({
  stats: Object,
  currentRange: Number,
  activeMode: String,
  columnLabelMap: { type: Object, default: () => ({}) },
});

const { showTextRange, hideAllTextRanges } = useTextStats(
  computed(() => props.stats),
  computed(() => props.currentRange)
);

const { col } = useColumnLabels(toRef(props, "columnLabelMap"));

const getTextString = (stopType) => {
  const rangeKey = rangeKeyByRangeIndex[props.currentRange] || "stops_within_300m";
  const colName = col(rangeKey, `${props.stats[rangeKey]}m`);

  return `Rathäuser haben ${stopType.text} im Umkreis von [${colName}].`;
}

const stopTypes = [
  { id: 'noStops', text: 'gar keine Haltestelle', color: defaultCategoryColours[0] },
  { id: 'oneStop', text: 'eine Haltestelle', color: defaultCategoryColours[1] },
  { id: 'twoStops', text: 'zwei Haltestellen', color: defaultCategoryColours[2] },
  { id: 'moreThanTwoStops', text: 'mehr als zwei Haltestellen', color: defaultCategoryColours[3] }
];

// Expose functions to parent component
defineExpose({
  showTextRange,
  hideAllTextRanges
});
</script>

<template>
  <div class="text-ranges">
    <div :id="`textRange${currentRange}`" class="textRange">
      <EditableTextField v-for="stopType in stopTypes" :key="stopType.id" :model-value="getTextString(stopType)"
        :active-mode="activeMode" :rows="1" width="70vw" font-size="18px" :line-height="1.3" :padding="`0px`"
        :text-align="`center`" />
    </div>
  </div>
</template>

<style scoped>
.text-ranges {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

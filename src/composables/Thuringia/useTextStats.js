import { computed } from 'vue';

export function useTextStats(stats, statsPercentages, currentRange) {

  const showTextRange = (rangeIndex) => {
    for (let i = 0; i < 3; i++) {
      const textElement = document.getElementById(`textRange${i}`);
      if (textElement) {
        if (i === rangeIndex) {
          textElement.style.display = 'block';
          textElement.style.opacity = '1';
        } else {
          textElement.style.display = 'none';
        }
      }
    }
  };

  const hideAllTextRanges = () => {
    for (let i = 0; i < 3; i++) {
      const textElement = document.getElementById(`textRange${i}`);
      if (textElement) {
        textElement.style.display = 'none';
      }
    }
  };

  const showHeaderRange = (rangeIndex) => {
    for (let i = 0; i < 3; i++) {
      const headerElement = document.getElementById(`headerRange${i}`);
      if (headerElement) {
        if (i === rangeIndex) {
          headerElement.style.opacity = '1';
        } else {
          headerElement.style.opacity = '0';
        }
      }
    }
  };

  const headerData = computed(() => [
    {
      distance: '0-100 Meter',
      stops: `${statsPercentages.value?.range0_100?.stopsInRangePercent ?? 0}`,
      noStops: `${statsPercentages.value?.range0_100?.noStopsPercent ?? 0}`
    },
    {
      distance: '101-200 Meter',
      stops: `${statsPercentages.value?.range101_200?.stopsInRangePercent ?? 0}`,
      noStops: `${statsPercentages.value?.range101_200?.noStopsPercent ?? 0}`
    },
    {
      distance: '201-300 Meter',
      stops: `${statsPercentages.value?.range201_300?.stopsInRangePercent ?? 0}`,
      noStops: `${statsPercentages.value?.range201_300?.noStopsPercent ?? 0}`
    }
  ]);

  return {
    showTextRange,
    hideAllTextRanges,
    showHeaderRange,
    headerData
  };
}

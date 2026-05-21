<script setup>
import infoWrapperSvg from '@img/Dresden/info-wrapper.svg'

defineProps({
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
})
</script>

<template>
  <div class="conclusion-transport-usage">
    <img :src="image" :alt="alt" class="conclusion-transport-usage__image">

    <div class="conclusion-transport-usage__badge">
      <img :src="infoWrapperSvg" alt="" aria-hidden="true" class="conclusion-transport-usage__badge-bg">
      <div class="conclusion-transport-usage__badge-content">
        <h4>{{ value }}%</h4>
        <div class="conclusion-transport-usage__progress">
          <div class="conclusion-transport-usage__progress-fill" :style="{ width: `${value}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.conclusion-transport-usage {
  position: absolute;
}

.conclusion-transport-usage__image {
  display: block;
  width: 100%;
  height: auto;
}

.conclusion-transport-usage__badge {
  position: absolute;
  left: 50%;
  top: 0;
  height: 100px;
  width: 150px;
  transform: translate(-50%, -100%);
}

.conclusion-transport-usage__badge-bg {
  display: block;
  width: 100%;
  height: 100%;
}

.conclusion-transport-usage__badge-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
}

.conclusion-transport-usage__badge-content h4 {
  font-size: 32px;
  margin-top: 8px;
  color: #000;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  font-weight: 400;
}

.conclusion-transport-usage__progress {
  width: 80%;
  height: 0.6rem;
  border: 2px solid var(--black);
  border-radius: 999px;
  background: white;
  overflow: hidden;
}

.conclusion-transport-usage__progress-fill {
  height: 100%;
  border-radius: 999px;
  background: var(--green);
}

.conclusion-transport-list__item--tram {
  width: 80%;
  max-width: 1200px;
  left: 0vw;
  bottom: 15px;
}

.conclusion-transport-list__item--tram .conclusion-transport-usage__badge {
  top: 30%;
  transform: translate(15%, -100%);
}

.conclusion-transport-list__item--car {
  width: 50%;
  max-width: 450px;
  left: 20%;
  bottom: 15px;
}

.conclusion-transport-list__item--bike {
  width: 40%;
  max-width: 200px;
  left: 50%;
  bottom: 15px;
}

.conclusion-transport-list__item--walkers {
  width: 50%;
  max-width: 400px;
  left: 60%;
  bottom: 15px;
}
</style>

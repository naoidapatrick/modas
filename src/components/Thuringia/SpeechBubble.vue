<script setup>
import { computed } from 'vue';
const props = defineProps({
    arrowRange: {
        type: Number,
        default: 0
    },
});

const speechBubbleImg = computed(() => {
    switch (props.arrowRange) {
        case 0:
            return './static/img/Thuringia/speechBubbles/speechbubble.svg';
        case 1:
            return './static/img/Thuringia/speechBubbles/speechbubble-1.svg';
        case 2:
            return './static/img/Thuringia/speechBubbles/speechbubble-2.svg';
    }
});
</script>

<template>
    <div class="speech-bubble">
        <img :src="speechBubbleImg" alt="Speech Bubble" />
    </div>

</template>

<style scoped>
.speech-bubble {
    position: relative;
    width: 100%;
    height: 100%;
}
img {
    position: absolute;
    width: 40%;
    right: 20%;
    bottom: 30%;
}

@media (max-width: 768px) {
    img {
        position: fixed;
        width: 25%;
        bottom: 12%;
        left: 15%;
    }
}

@media (min-width: 2560px) {
    img {
        bottom: 35%;
    }
}
</style>
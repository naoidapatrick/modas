<script setup>
defineProps({
    wrapperClass: {
        type: String,
        default: ''
    },
    colouredClass: {
        type: String,
        default: ''
    },
    whiteSpaceClass: {
        type: String,
        default: ''
    }
});
</script>

<template>
    <div class="section-wrapper" :class="wrapperClass">
        <slot name="background"></slot>
        <div class="coloured-space" :class="colouredClass">
            <div class="white-space" :class="whiteSpaceClass">
                <slot></slot>
            </div>
        </div>
        <slot name="extra"></slot>
    </div>
</template>

<style scoped>
.section-wrapper {
    position: relative;
    width: 100%;
}

.coloured-space {
    width: 55%;
    height: fit-content;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 30px 20px;
    background-image: linear-gradient(rgba(255, 255, 255, 0.75), rgba(115, 245, 70, 0.75), rgba(114, 219, 255, 0.75));
    border-radius: 20px;
    pointer-events: none;
    z-index: 3;
}

.white-space {
    width: 95%;
    height: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 7%;
    background-color: white;
    border-radius: 20px;
    padding: 40px;
}

.robot-form-wrapper {
    width: 60% !important;
    height: 100% !important;
}

.robot-form-coloured {
    width: 100%;
    transform: none;
    top: -10%;
    left: 0%;
}

.robot-form-white {
    height: 100%;
    flex-direction: column;
    background-color: rgba(255, 255, 255, 0.75);
    align-items: center;
    justify-content: center;
    gap: 2.5rem;
    pointer-events: auto;
}

.robot-chatbot-wrapper {
    margin-top: 10%;
}

.robot-coloured {
    width: 100%;
    height: fit-content;
}

.robot-white {
    padding: 0 10px;
}
</style>
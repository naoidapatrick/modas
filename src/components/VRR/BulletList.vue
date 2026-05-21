<script setup>
defineProps({
    title: {
        type: String,
        default: ''
    },
    items: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <h1 class="h1-list">
        <span v-if="title">{{ title }}</span>
        <ul>
            <li v-for="(item, index) in items" :key="index" v-html="item"></li>
        </ul>
    </h1>
</template>

<style scoped>
.h1-list {
    width: 100%;
    line-height: 1.8;
    text-wrap: wrap;
}

.h1-list li :deep(span) {
    font-weight: 400;
}

@media (max-width: 768px) {
    .h1-list :deep(li) {
        font-size: 18px;
    }

    .h1-list span {
        font-size: 20px;
    }
}
</style>
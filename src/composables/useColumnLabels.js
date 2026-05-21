import { computed } from "vue"

export function useColumnLabels(headerMapRef) {
    const col = (key, fallback) =>
        headerMapRef.value?.[key] || fallback || key

    return { col }
}
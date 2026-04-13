import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 视口宽度小于 breakpoint 时视为移动端（默认 768px）
 */
export function useMobile(breakpoint = 768) {
  const isMobile = ref(false)

  const update = () => {
    isMobile.value = typeof window !== 'undefined' && window.innerWidth < breakpoint
  }

  onMounted(() => {
    update()
    window.addEventListener('resize', update, { passive: true })
  })
  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })

  return { isMobile }
}

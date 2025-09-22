export function useScroll() {
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scrollToPlayoffs() {
    const playoffEl = document.querySelector('.week--playoffs')
    if (playoffEl) {
      playoffEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return { scrollToTop, scrollToPlayoffs }
}

const HEADER_OFFSET = 100;

export function scrollToSection(sectionId: string, behavior: ScrollBehavior = 'smooth') {
  if (sectionId === 'top') {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const el = document.getElementById(sectionId);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function scrollToSectionFromHash(hash: string) {
  const id = hash.replace(/^#/, '').trim();
  if (!id) return;
  requestAnimationFrame(() => {
    setTimeout(() => scrollToSection(id), 50);
  });
}

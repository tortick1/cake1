document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.masonry-item');
  const masonry = document.getElementById('masonry');
  const showMoreBtn = document.getElementById('showMoreBtn');
  const maxVisibleItems = 8;

  function scrollToElement(targetEl) {
    const offset = 40;
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }

  function updateVisibleItems() {
    if (!masonry) {
      return;
    }

    items.forEach((item, index) => {
      item.style.display = 'block';
      if (masonry.classList.contains('collapsed') && index >= maxVisibleItems) {
        item.classList.add('hidden');
      } else {
        item.classList.remove('hidden');
      }
    });

    if (showMoreBtn) {
      showMoreBtn.parentElement.style.display = items.length > maxVisibleItems ? '' : 'none';
    }
  }

  document.querySelectorAll('.fade-in').forEach((el) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    observer.observe(el);
  });

  if (showMoreBtn && masonry) {
    showMoreBtn.addEventListener('click', function () {
      masonry.classList.toggle('expanded');
      masonry.classList.toggle('collapsed');
      this.textContent = masonry.classList.contains('expanded') ? 'Приховати' : 'Показати всі роботи';
      updateVisibleItems();
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
      link.addEventListener('click', function (e) {
        const targetEl = document.getElementById(this.getAttribute('href').substring(1));
        if (targetEl) {
          e.preventDefault();
          scrollToElement(targetEl);
        }
      });
    }
  });

  updateVisibleItems();
});

/*
 * scripts.js
 *
 * У цьому файлі міститься функціонал для фільтрації галереї,
 * плавного з’явлення елементів при прокручуванні та інші
 * інтерактивні ефекти.
 */

document.addEventListener('DOMContentLoaded', function () {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.masonry-item');
  let activeFilter = 'all';

  // Fade in elements on scroll using IntersectionObserver
  const fadeElements = document.querySelectorAll('.fade-in');
  const options = {
    threshold: 0.2,
  };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, options);
  fadeElements.forEach((el) => {
    observer.observe(el);
  });

  // Show more/less functionality for the gallery
  const masonry = document.getElementById('masonry');
  const showMoreBtn = document.getElementById('showMoreBtn');
  const priceList = document.getElementById('priceList');
  const priceToggleBtn = document.getElementById('priceToggleBtn');
  const priceHideBtn = document.getElementById('priceHideBtn');
  const priceHeroBtn = document.querySelector('.price-hero-btn');

  function setPriceListExpanded(expanded) {
    if (!priceList || !priceToggleBtn) {
      return;
    }

    priceList.classList.toggle('collapsed', !expanded);
    priceToggleBtn.style.display = expanded ? 'none' : '';
  }

  function scrollToElement(targetEl) {
    const offset = 40;
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  }

  if (priceToggleBtn) {
    priceToggleBtn.addEventListener('click', function () {
      setPriceListExpanded(true);
    });
  }

  if (priceHideBtn) {
    priceHideBtn.addEventListener('click', function () {
      const targetEl = document.getElementById('price');
      setPriceListExpanded(false);
      if (targetEl) {
        scrollToElement(targetEl);
      }
    });
  }

  if (priceHeroBtn) {
    priceHeroBtn.addEventListener('click', function (e) {
      const targetEl = document.getElementById('price');
      if (targetEl) {
        e.preventDefault();
        setPriceListExpanded(true);
        scrollToElement(targetEl);
      }
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', function () {
      filterButtons.forEach((button) => button.classList.remove('active'));
      this.classList.add('active');
      activeFilter = this.getAttribute('data-filter') || 'all';

      if (masonry) {
        masonry.classList.add('collapsed');
        masonry.classList.remove('expanded');
      }
      if (showMoreBtn) {
        showMoreBtn.textContent = 'Показати всі роботи';
      }

      updateVisibleItems();
    });
  });

  if (showMoreBtn && masonry) {
    showMoreBtn.addEventListener('click', function () {
      masonry.classList.toggle('expanded');
      masonry.classList.toggle('collapsed');
      // Toggle button text
      if (masonry.classList.contains('expanded')) {
        this.textContent = 'Приховати';
      } else {
        this.textContent = 'Показати всі роботи';
      }
      // Оновити приховані елементи після зміни стану
      updateVisibleItems();
    });
  }

  // Smooth scrolling for internal anchor links (навігаційні кнопки)
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    // Exclude links that are just '#'
    if (link.getAttribute('href') && link.getAttribute('href') !== '#') {
      link.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          e.preventDefault();
          /*
           * Використовуємо scrollTo з обчисленим положенням, щоб уникнути
           * потенційних проблем із scrollIntoView та забезпечити плавний
           * перехід. Додаємо невеликий відступ зверху, щоб заголовок не
           * притискався до верхнього краю екрана.
           */
          scrollToElement(targetEl);
        }
      });
    }
  });
  /*
   * Відображення лише перших 8 елементів у згорнутому стані.
   */
  const maxVisibleItems = 8;
  function itemMatchesFilter(item) {
    const categories = item.getAttribute('data-category') || '';
    return activeFilter === 'all' || categories.split(/\s+/).includes(activeFilter);
  }

  function updateVisibleItems() {
    const visibleItems = Array.from(items).filter(itemMatchesFilter);

    items.forEach((item) => {
      item.style.display = 'none';
      item.classList.remove('hidden');
    });

    visibleItems.forEach((item, index) => {
      item.style.display = 'block';
      if (masonry.classList.contains('collapsed') && index >= maxVisibleItems) {
        item.classList.add('hidden');
      } else {
        item.classList.remove('hidden');
      }
    });

    if (showMoreBtn) {
      showMoreBtn.parentElement.style.display = visibleItems.length > maxVisibleItems ? '' : 'none';
    }
  }

  // Ініціалізуємо стан при завантаженні сторінки
  updateVisibleItems();

  // Спеціальний обробник для кнопки "Замовити торт" на першому екрані, якщо загальний селектор не спрацює
  const heroOrderBtn = document.querySelector('.hero a[href="#contact"]');
  if (heroOrderBtn) {
    heroOrderBtn.addEventListener('click', function (e) {
      const targetEl = document.getElementById('contact');
      if (targetEl) {
        e.preventDefault();
        scrollToElement(targetEl);
      }
    });
  }
});

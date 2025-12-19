document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach((dropdown, index) => {
    const trigger = dropdown.querySelector('.nav-dropdown-trigger');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    if (!trigger || !menu) return;

    // assign stable ids if not present
    const menuId = menu.id || `nav-dropdown-menu-${index}`;
    menu.id = menuId;
    trigger.setAttribute('aria-controls', menuId);
    trigger.setAttribute('aria-expanded', trigger.getAttribute('aria-expanded') || 'false');
    menu.setAttribute('aria-hidden', 'true');

    function open() {
      dropdown.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
    }

    function close() {
      dropdown.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    }

    // Toggle on click
    trigger.addEventListener('click', (e) => {
      const isOpen = dropdown.classList.contains('open');
      if (isOpen) {
        close();
      } else {
        open();
      }
    });

    // Keyboard support for trigger
    trigger.addEventListener('keydown', (e) => {
      const key = e.key;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        const isOpen = dropdown.classList.contains('open');
        if (isOpen) close(); else open();
      } else if (key === 'Escape' || key === 'Esc') {
        close();
        trigger.focus();
      }
    });

    // Close on Esc from the menu
    menu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        close();
        trigger.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        close();
      }
    });
  });
});

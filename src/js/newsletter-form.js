document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('#footer-newsletter-form, #post-newsletter-form, #newsletter-page-form');

  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitButton = form.querySelector('input[type="submit"]');
      const originalValue = submitButton.value;
      const statusId = form.id === 'footer-newsletter-form'
        ? 'footer-newsletter-status'
        : form.id === 'newsletter-page-form'
          ? 'newsletter-page-status'
          : 'post-newsletter-status';

      let statusEl = document.getElementById(statusId);
      if (!statusEl) {
        statusEl = document.createElement('p');
        statusEl.id = statusId;
        statusEl.style.cssText = 'margin-top: 0.75rem; font-size: 0.85rem; text-align: center;';
        form.parentNode.appendChild(statusEl);
      }

      submitButton.value = 'Subscribing...';
      submitButton.disabled = true;
      statusEl.textContent = '';
      statusEl.style.color = '#aaa';

      try {
        const formData = new FormData(form);
        formData.set('from_name', `Newsletter signup (${form.id})`);
        const data = Object.fromEntries(formData.entries());

        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
          statusEl.textContent = 'Thanks! You\'re subscribed.';
          statusEl.style.color = '#81C784';
          form.reset();
        } else {
          statusEl.textContent = result.message || 'Something went wrong. Try again later.';
          statusEl.style.color = '#ff5a5f';
        }
      } catch (err) {
        statusEl.textContent = 'Network error. Try again later.';
        statusEl.style.color = '#ff5a5f';
      } finally {
        submitButton.value = originalValue;
        submitButton.disabled = false;
      }
    });
  });
});
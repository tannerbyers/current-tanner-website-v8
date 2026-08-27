document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const statusEl = document.getElementById('contact-form-status');

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = contactForm.querySelector('input[type="submit"]');
    const originalValue = submitButton.value;
    
    submitButton.value = 'Sending...';
    submitButton.disabled = true;
    statusEl.textContent = '';
    statusEl.style.color = '#aaa';

    try {
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch(contactForm.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        statusEl.textContent = 'Message sent! I\'ll get back to you within 24-48 hours.';
        statusEl.style.color = '#81C784';
        contactForm.reset();
      } else {
        statusEl.textContent = result.message || 'Something went wrong. Try emailing me directly at programtanner@gmail.com';
        statusEl.style.color = '#ff5a5f';
      }
    } catch (err) {
      statusEl.textContent = 'Network error. Try emailing me directly at programtanner@gmail.com';
      statusEl.style.color = '#ff5a5f';
    } finally {
      submitButton.value = originalValue;
      submitButton.disabled = false;
    }
  });
});
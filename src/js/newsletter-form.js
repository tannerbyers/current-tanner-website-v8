document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form[name="newsletter-subscription"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const submitButton = form.querySelector('input[type="submit"]');
      const originalValue = submitButton.value;
      
      // Show optimistic success state immediately
      submitButton.value = '✓ Subscribed!';
      submitButton.disabled = true;
      
      // Create or update success message
      let successMsg = form.querySelector('.newsletter-success-message');
      if (!successMsg) {
        successMsg = document.createElement('p');
        successMsg.className = 'newsletter-success-message';
        form.parentNode.appendChild(successMsg);
      }
      successMsg.textContent = 'Thanks for subscribing! You\'ll hear from me soon.';
      
      // Netlify Forms handles the actual submission; we just need to provide UX feedback
      // Reset after 5 seconds
      setTimeout(() => {
        submitButton.value = originalValue;
        submitButton.disabled = false;
        successMsg.textContent = '';
      }, 5000);
    });
  });
});

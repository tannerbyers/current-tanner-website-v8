document.addEventListener('DOMContentLoaded', function() {
  const forms = document.querySelectorAll('form[name="newsletter-subscription"]');
  
  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitButton = form.querySelector('input[type="submit"]');
      const originalValue = submitButton.value;
      
      try {
        // Submit to Netlify Forms
        await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(formData)
        });
        
        // Show success state
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
        
        // Reset after 5 seconds
        setTimeout(() => {
          submitButton.value = originalValue;
          submitButton.disabled = false;
          successMsg.textContent = '';
        }, 5000);
        
      } catch (error) {
        console.error('Newsletter signup error:', error);
        submitButton.value = 'Error - try again';
        setTimeout(() => {
          submitButton.value = originalValue;
        }, 3000);
      }
    });
  });
});

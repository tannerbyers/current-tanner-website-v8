document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('form[name="contact"]');
  
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    const submitButton = contactForm.querySelector('input[type="submit"]');
    const originalValue = submitButton.value;
    
    // Show optimistic success state
    submitButton.value = '✓ Message sent!';
    submitButton.disabled = true;
    
    // Create or update success message
    let successMsg = contactForm.querySelector('.contact-form-success');
    if (!successMsg) {
      successMsg = document.createElement('p');
      successMsg.className = 'contact-form-success';
      contactForm.parentNode.appendChild(successMsg);
    }
    successMsg.textContent = 'Thanks for reaching out! I\'ll get back to you soon.';
    
    // Reset after 5 seconds
    setTimeout(() => {
      submitButton.value = originalValue;
      submitButton.disabled = false;
      successMsg.textContent = '';
    }, 5000);
  });
});

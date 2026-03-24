 // Add a preview mode toggle button
document.addEventListener('DOMContentLoaded', () => {
  const previewBtn = document.createElement('button');
  previewBtn.textContent = 'Toggle Preview Mode';
  previewBtn.style.position = 'fixed';
  previewBtn.style.bottom = '20px';
  previewBtn.style.right = '20px';
  previewBtn.style.zIndex = '9999';
  previewBtn.style.padding = '8px 16px';
  previewBtn.style.backgroundColor = '#333';
  previewBtn.style.color = 'white';
  previewBtn.style.border = 'none';
  previewBtn.style.borderRadius = '4px';
  previewBtn.style.cursor = 'pointer';
  previewBtn.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
  
  // Toggle preview mode and update button text
  previewBtn.addEventListener('click', () => {
    const url = new URL(window.location);
    if (url.searchParams.has('preview')) {
      url.searchParams.delete('preview');
      previewBtn.textContent = 'Enable Preview Mode';
    } else {
      url.searchParams.set('preview', 'true');
      previewBtn.textContent = 'Disable Preview Mode';
    }
    window.location.href = url.toString();
  });
  
  // Set initial button text based on URL
  if (window.location.search.includes('preview=true')) {
    previewBtn.textContent = 'Disable Preview Mode';
  }
  
  // Only show in development or when explicitly requested
  if (window.location.hostname === 'localhost' || 
      window.location.search.includes('showPreviewToggle=true')) {
    document.body.appendChild(previewBtn);
  }
});

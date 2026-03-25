/**
 * Image zoom functionality
 * Adds zoom buttons to post images and shows a modal with full-size image on click.
 */
document.addEventListener('DOMContentLoaded', function() {
  // Create modal container if it doesn't exist
  let modal = document.getElementById('image-zoom-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'image-zoom-modal';
    modal.className = 'image-zoom-modal';
    modal.innerHTML = `
      <span class="image-zoom-close" role="button" aria-label="Close zoomed image">&times;</span>
      <div class="image-zoom-content">
        <img id="zoomed-image" src="" alt="">
      </div>
    `;
    document.body.appendChild(modal);
    
    // Close modal when clicking on overlay
    modal.addEventListener('click', function() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Close modal when clicking the close button
    modal.querySelector('.image-zoom-close').addEventListener('click', function(e) {
      e.stopPropagation();
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
    
    // Prevent clicks on the image from closing the modal
    modal.querySelector('.image-zoom-content').addEventListener('click', function(e) {
      e.stopPropagation();
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // Add zoom buttons to all post images
  const postImageContainers = document.querySelectorAll('.post-image-container');
  postImageContainers.forEach(container => {
    // Skip if already has a zoom button
    if (container.querySelector('.post-image-zoom')) return;
    
    // Create zoom button
    const zoomBtn = document.createElement('button');
    zoomBtn.className = 'post-image-zoom';
    zoomBtn.innerHTML = '<i class="fas fa-search-plus"></i> Zoom';
    zoomBtn.setAttribute('aria-label', 'Zoom image');
    container.appendChild(zoomBtn);
    
    // Get the image element
    const img = container.querySelector('img');
    if (!img) return;
    
    // Function to open the modal with the full-size image
    const openZoom = function() {
      // Find the largest image source (original or highest resolution)
      let bestSrc = img.src;
      const sources = container.querySelectorAll('source');
      if (sources.length > 0) {
        // Try to get the highest resolution from srcset
        sources.forEach(source => {
          if (source.srcset) {
            const srcsetParts = source.srcset.split(',');
            // Sort by width and get the largest
            const sortedSrcs = srcsetParts
              .map(part => {
                const [url, width] = part.trim().split(' ');
                return { url, width: parseInt(width) };
              })
              .sort((a, b) => b.width - a.width);
            
            if (sortedSrcs.length > 0) {
              bestSrc = sortedSrcs[0].url;
            }
          }
        });
      }
      
      // Set the zoomed image source
      const zoomedImage = document.getElementById('zoomed-image');
      zoomedImage.src = bestSrc;
      zoomedImage.alt = img.alt || '';
      
      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    };
    
    // Open zoom on button click
    zoomBtn.addEventListener('click', openZoom);
    
    // Also open zoom on image click
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', openZoom);
    
    // Make the entire picture element clickable
    const picture = container.querySelector('picture');
    if (picture) {
      picture.style.cursor = 'zoom-in';
      picture.addEventListener('click', function(e) {
        // Only trigger if clicked directly on picture (not on img)
        if (e.target === picture) {
          openZoom();
        }
      });
    }
  });
});

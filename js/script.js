let projectsData = [];
let slideshowInterval;

// Fetch projects data and store it in a variable
fetch('projects.json')
  .then(response => response.json())
  .then(data => {
    // Sort projects by year and month, placing non-numeric years at the bottom
    const sortedProjects = data.sort((a, b) => {
      const isANumeric = !isNaN(a.year);
      const isBNumeric = !isNaN(b.year);

      if (!isANumeric && isBNumeric) return 1;
      if (isANumeric && !isBNumeric) return -1;
      if (!isANumeric && !isBNumeric) return a.year.localeCompare(b.year);

      // Compare by year and month
      if (a.year !== b.year) {
        return b.year.localeCompare(a.year);
      }
      return (b.month || 0) - (a.month || 0); // Handle missing months by assuming 0
    });

    projectsData = sortedProjects;
    const projectList = document.getElementById('project-list');

    let currentYear = '';
    let projectIndex = 0; // Sequential index for numbering

    projectList.innerHTML = sortedProjects.map((project, index) => {
      projectIndex += 1; // Increment the sequential number

      let yearDisplay = '';
      let line = '';
      if (project.year !== currentYear) {
        currentYear = project.year;
        yearDisplay = `<div class="project-year" data-year="${project.year}" style="flex: 1; text-align: left;">${project.year}</div>`;
        line = '<hr>';
      } else {
        yearDisplay = `<div class="project-year" data-year="${project.year}" style="flex: 1; text-align: left;"></div>`;
      }

      const formattedIndex = projectIndex.toString().padStart(3, '0'); // Format as 001, 002, etc.

      return `
        <div class="sidebar-item" 
             onmouseover="startSlideshow(${index}); highlightYear('${project.year}')" 
             onmouseout="stopSlideshow(); removeHighlight('${project.year}')">
          <a href="work.html?id=${project.id}" class="project-link">
            <div style="display: flex; align-items: center;">
              <!-- Year -->
              ${yearDisplay}
              <!-- Sequential Number -->
              <div style="flex: 0 0 1.5rem; margin-right: 0.7rem; text-align: left;">${formattedIndex}</div>
              <!-- Title -->
              <div style="flex: 2; text-align: left;">${project.title}</div>
              <!-- Type -->
              <div style="flex: 2; text-align: left;">${project.type}</div>
            </div>
          </a>
        </div>
      `;
    }).join('');
  });

// Function to highlight the year
function highlightYear(year) {
  const yearElements = document.querySelectorAll(`.project-year[data-year="${year}"]`);
  yearElements.forEach(element => element.classList.add('highlight'));
}

// Function to remove the highlight from the year
function removeHighlight(year) {
  const yearElements = document.querySelectorAll(`.project-year[data-year="${year}"]`);
  yearElements.forEach(element => element.classList.remove('highlight'));
}

function startSlideshow(index) {
  const gallery = document.getElementById('gallery-image');
  console.log(`Starting slideshow for project index: ${index}`);

  if (projectsData[index] && projectsData[index].media) {
    let currentMediaIndex = 0;
    const mediaItems = projectsData[index].media;

    // Function to show the current media item
    const showCurrentMedia = () => {
      const item = mediaItems[currentMediaIndex];
      if (item.type === 'image') {
        gallery.innerHTML = `<img src="${item.src}" alt="Project Image" class="active">`;
        clearInterval(slideshowInterval);
        slideshowInterval = setInterval(() => {
          currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
          showCurrentMedia();
        }, 2500);
      } else if (item.type === 'video') {
        const fileExtension = item.src.split('.').pop();
        const mimeType = fileExtension === 'webm' ? 'video/webm' : 'video/mp4';
        gallery.innerHTML = `<video autoplay muted class="active">
          <source src="${item.src}" type="${mimeType}">
          Your browser does not support the video tag.
        </video>`;
        const videoElement = gallery.querySelector('video');
        videoElement.addEventListener('ended', () => {
          currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
          showCurrentMedia();
        });
        clearInterval(slideshowInterval);
      }
    };

    showCurrentMedia();
  } else {
    console.error(`Media not found for project index: ${index}`);
    gallery.innerHTML = '<p>Preview not available.</p>';
  }
}

// Stop the slideshow
function stopSlideshow() {
  clearInterval(slideshowInterval);
}
// Add scroll indicator element
const projectDetails = document.querySelector('.project-details');
if (projectDetails) {
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  projectDetails.appendChild(scrollIndicator);

  // Handle scroll event
  projectDetails.addEventListener('scroll', () => {
    const atBottom = projectDetails.scrollHeight - projectDetails.scrollTop === projectDetails.clientHeight;
    projectDetails.classList.toggle('at-bottom', atBottom);
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const imageGallery = document.getElementById('image-gallery');
  const projectSection = document.querySelector('.sidebar');

  window.addEventListener('scroll', function() {
    const projectSectionTop = projectSection.getBoundingClientRect().top;
    const headerHeight = document.querySelector('.header').offsetHeight;

    if (projectSectionTop <= headerHeight) {
      imageGallery.classList.add('fixed');
    } else {
      imageGallery.classList.remove('fixed');
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const imageGallery = document.getElementById('gallery-image');
  let images = [];
  let slideshowInterval;

  // Fetch projects data and store image paths in an array
  fetch('projects.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(project => {
        project.media.forEach(mediaItem => {
          if (mediaItem.type === 'image' && !mediaItem.excludeFromIndex) {
            images.push(mediaItem.src);
          }
        });
      });

      // Start the slideshow
      if (images.length > 0) {
        let currentIndex = 0;

        function showRandomImage() {
          currentIndex = Math.floor(Math.random() * images.length);
          imageGallery.innerHTML = `<img src="${images[currentIndex]}" alt="Slideshow Image" class="active">`;
        }

        // Show the first random image
        showRandomImage();

        // Change image every 3 seconds
        slideshowInterval = setInterval(showRandomImage, 3000);
      }
    });

  // Function to stop the initial slideshow
  function stopSlideshow() {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
  }

  // Add hover event listeners to project elements
  const projectList = document.getElementById('project-list');
  projectList.addEventListener('mouseover', function(event) {
    if (event.target.closest('.sidebar-item')) {
      stopSlideshow();
    }
  });

  projectList.addEventListener('mouseout', function(event) {
    if (event.target.closest('.sidebar-item')) {
      // Optionally, you can restart the slideshow when the mouse leaves the project
      // slideshowInterval = setInterval(showRandomImage, 3000);
    }
  });
});
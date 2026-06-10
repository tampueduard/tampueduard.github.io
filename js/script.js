let projectsData = [];
let slideshowInterval;

// Fetch projects data and store it in a variable
fetch('js/projects.json')
  .then(response => response.json())
  .then(data => {
    // Sort projects by year and month, placing non-numeric years at the bottom
    const sortedProjects = data.sort((a, b) => {
      const isANumeric = !isNaN(a.year);
      const isBNumeric = !isNaN(b.year);

      if (!isANumeric && isBNumeric) return 1;
      if (isANumeric && !isBNumeric) return -1;
      if (!isANumeric && !isBNumeric) return a.year.localeCompare(b.year);

      if (a.year !== b.year) {
        return b.year.localeCompare(a.year);
      }
      return (b.month || 0) - (a.month || 0);
    });

    projectsData = sortedProjects;
    const projectList = document.getElementById('project-list');

    if (projectList) {
      let currentYear = '';
      let projectIndex = 0;

      projectList.innerHTML = sortedProjects.map((project, index) => {
        projectIndex += 1;

        let yearDisplay = '';
        let yearDisplayMobile = '';
        if (project.year !== currentYear) {
          currentYear = project.year;
          yearDisplay = `<div class="project-year" data-year="${project.year}">${project.year}</div>`;
          yearDisplayMobile = `<div class="project-year" data-year="${project.year}">${project.year}</div>`;
        } else {
          yearDisplay = `<div class="project-year" data-year="${project.year}"></div>`;
          yearDisplayMobile = `<div class="project-year" data-year="${project.year}"></div>`;
        }

        const formattedIndex = projectIndex.toString().padStart(3, '0');

        return `
          <div class="sidebar-item"
               onmouseover="startSlideshow(${index}); highlightYear('${project.year}')"
               onmouseout="stopSlideshow(); removeHighlight('${project.year}')">
            <a href="work.html?id=${project.id}" class="project-link">
              <div class="desktop sidebar-row">
                ${yearDisplay}
                <div class="project-title">${project.title}</div>
                <div class="project-type">${project.type}</div>
              </div>
              <div class="mobile">
                <div class="sidebar-row-mobile">
                  ${yearDisplayMobile}
                  <div class="project-title-mobile">${project.title} <g>${project.type}</g></div>
                </div>
              </div>
            </a>
          </div>
        `;
      }).join('');
    }
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
  const project = projectsData[index];
  if (!project) return;

  // Collect previewable items: media first, fall back to mainMedia
  const previewable = m =>
    m.type === 'image' ||
    m.type === 'vimeo' ||
    (m.type === 'video' && !m.src.includes('drive.google.com'));

  let items = (project.media || []).filter(previewable);
  if (items.length === 0) {
    items = (project.mainMedia || []).filter(previewable);
  }

  if (items.length === 0) {
    gallery.innerHTML = '';
    return;
  }

  let currentMediaIndex = 0;

  const showCurrentMedia = () => {
    const item = items[currentMediaIndex];
    const creditsHtml = item.credits
      ? `<div class="slideshow-credits" style="pointer-events:auto">${item.link ? `<a href="${item.link}" target="_blank">${item.credits}</a>` : item.credits}</div>`
      : '';

    if (item.type === 'image') {
      gallery.innerHTML = `<img src="${item.src}" alt="Project Image" class="active">${creditsHtml}`;
      clearInterval(slideshowInterval);
      slideshowInterval = setInterval(() => {
        currentMediaIndex = (currentMediaIndex + 1) % items.length;
        showCurrentMedia();
      }, 2500);

    } else if (item.type === 'vimeo') {
      // Use Vimeo thumbnail as a static preview image
      gallery.innerHTML = `<img src="https://vumbnail.com/${item.src}.jpg" alt="Project Image" class="active">${creditsHtml}`;
      clearInterval(slideshowInterval);
      slideshowInterval = setInterval(() => {
        currentMediaIndex = (currentMediaIndex + 1) % items.length;
        showCurrentMedia();
      }, 2500);

    } else if (item.type === 'video') {
      const mimeType = item.src.endsWith('.webm') ? 'video/webm' : 'video/mp4';
      gallery.innerHTML = `<video autoplay muted loop playsinline class="active">
        <source src="${item.src}" type="${mimeType}">
      </video>${creditsHtml}`;
      const videoEl = gallery.querySelector('video');
      videoEl.addEventListener('ended', () => {
        currentMediaIndex = (currentMediaIndex + 1) % items.length;
        showCurrentMedia();
      });
      clearInterval(slideshowInterval);

    } else if (item.type === 'google-drive-video') {
      gallery.innerHTML = `<iframe class="google-drive-video active"
        src="${item.src}" width="auto" height="auto"
        allow="autoplay" frameborder="0"
        sandbox="allow-top-navigation allow-scripts allow-forms"
        allowfullscreen></iframe>${creditsHtml}`;
      clearInterval(slideshowInterval);
    }
  };

  showCurrentMedia();
}

// Stop the slideshow
function stopSlideshow() {
  clearInterval(slideshowInterval);
}

// Scroll indicator on work/project pages
const projectDetails = document.querySelector('.project-details');
if (projectDetails) {
  const scrollIndicator = document.createElement('div');
  scrollIndicator.className = 'scroll-indicator';
  projectDetails.appendChild(scrollIndicator);

  projectDetails.addEventListener('scroll', () => {
    const atBottom = projectDetails.scrollHeight - projectDetails.scrollTop === projectDetails.clientHeight;
    projectDetails.classList.toggle('at-bottom', atBottom);
  });
}

document.addEventListener('DOMContentLoaded', function () {

  /* --- Custom Cursor (all pages) --- */
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  cursor.style.left = '-10px';
  cursor.style.top  = '-10px';
  cursor.style.opacity = '0';

  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; });
  document.addEventListener('mouseover',  (e) => { if (e.target.tagName === 'IFRAME') cursor.style.opacity = '0'; });
  document.addEventListener('mousedown',  () => { cursor.classList.add('pressed'); });
  document.addEventListener('mouseup',    () => { cursor.classList.remove('pressed'); });

  /* --- Homepage-only code --- */
  const imageGallery = document.getElementById('gallery-image');
  if (!imageGallery) return;

  let images = []; // { src, title, year, id }
  let slideshowInterval;

  // Persistent gallery project tag — shows which project the background image belongs to
  const galleryTag = document.createElement('a');
  galleryTag.className = 'gallery-project-tag';
  galleryTag.innerHTML = '<span class="gallery-tag-year"></span><span class="gallery-tag-title"></span>';
  document.body.appendChild(galleryTag);

  const tagYearEl  = galleryTag.querySelector('.gallery-tag-year');
  const tagTitleEl = galleryTag.querySelector('.gallery-tag-title');

  let tagTypingTimeout = null;

  // Typewriter effect for gallery title
  function typeGalleryTitle(element, newText) {
    if (tagTypingTimeout) clearTimeout(tagTypingTimeout);
    const typeSpeed  = 28;
    const eraseSpeed = 18;
    const current    = element.textContent;

    function erase(len) {
      if (len === 0) { type(0); return; }
      element.textContent = current.substring(0, len - 1);
      tagTypingTimeout = setTimeout(() => erase(len - 1), eraseSpeed);
    }

    function type(i) {
      if (i > newText.length) return;
      element.textContent = newText.substring(0, i);
      tagTypingTimeout = setTimeout(() => type(i + 1), typeSpeed);
    }

    if (current === '') {
      type(0);
    } else {
      erase(current.length);
    }
  }

  function showRandomImage() {
    if (images.length === 0) return;
    const item = images[Math.floor(Math.random() * images.length)];
    if (imageGallery) imageGallery.innerHTML = `<img src="${item.src}" alt="${item.title}" class="active">`;
    galleryTag.href = `work.html?id=${item.id}`;
    tagYearEl.textContent = item.year;
    typeGalleryTitle(tagTitleEl, item.title);
  }

  // Fetch projects and collect image entries with metadata
  fetch('js/projects.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(project => {
        [...(project.media || []), ...(project.mainMedia || [])].forEach(mediaItem => {
          if (mediaItem.type === 'image' && !mediaItem.excludeFromIndex) {
            images.push({ src: mediaItem.src, title: project.title, year: project.year, id: project.id });
          }
        });
      });

      if (images.length > 0) {
        showRandomImage();
        slideshowInterval = setInterval(showRandomImage, 3000);
      }
    });

  function stopBackgroundSlideshow() {
    if (slideshowInterval) {
      clearInterval(slideshowInterval);
      slideshowInterval = null;
    }
  }

  // Hover events for project list
  const projectList = document.getElementById('project-list');
  if (projectList) {
    projectList.addEventListener('mouseover', function (event) {
      const item = event.target.closest('.sidebar-item');
      if (!item) return;
      if (item.contains(event.relatedTarget)) return;
      stopBackgroundSlideshow();
      galleryTag.style.visibility = 'hidden';
    });

    projectList.addEventListener('mouseout', function (event) {
      const item = event.target.closest('.sidebar-item');
      if (!item) return;
      if (item.contains(event.relatedTarget)) return;
      galleryTag.style.visibility = 'visible';
      showRandomImage();
      slideshowInterval = setInterval(showRandomImage, 3000);
    });
  }

  /* --- Typing Effect for Tags --- */
  const tags = ["composer", "performer", "new media artist"];
  const tagIds = ['current-tag', 'current-tag-mobile'];
  tagIds.forEach(id => {
    const tagElement = document.getElementById(id);
    if (!tagElement) return;

    let tagIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 30;
    const holdTime  = 3000;

    tagElement.textContent = tags[0];

    function typeEffect() {
      const currentTag = tags[tagIndex];

      if (isDeleting) {
        tagElement.textContent = currentTag.substring(charIndex);
        charIndex++;
        if (charIndex > currentTag.length) {
          isDeleting = false;
          tagIndex = (tagIndex + 1) % tags.length;
          charIndex = 1;
          setTimeout(typeEffect, 150);
        } else {
          setTimeout(typeEffect, typeSpeed);
        }
      } else {
        tagElement.textContent = currentTag.substring(currentTag.length - charIndex);
        charIndex++;
        if (charIndex > currentTag.length) {
          isDeleting = true;
          charIndex = 1;
          setTimeout(typeEffect, holdTime);
        } else {
          setTimeout(typeEffect, typeSpeed);
        }
      }
    }
    setTimeout(() => {
      isDeleting = true;
      charIndex = 1;
      typeEffect();
    }, holdTime);
  });
});

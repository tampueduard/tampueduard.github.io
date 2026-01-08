let currentMediaIndex = 0;
let mediaItems = [];

// Get query parameter (e.g., ?id=8)
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');
console.log("Project ID:", projectId);

// Fetch project details from JSON
fetch('../projects.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log("Project data:", data);
        const project = data.find(item => item.id == projectId);

        if (project) {
            console.log("Project found:", project);

            // Populate project details
            document.getElementById('work-title').textContent = project.title;
            document.getElementById('work-description').innerHTML = `
                <h3>${project.year}<br>
                ${project.type || ''}</h3> ${project.typeDetails ? `<h style="font-style: italic">${project.typeDetails}</h>` : ''}
            `;

            if (project.link) {
                document.getElementById('work-link').href = project.link;
                document.getElementById('work-link').textContent = "View Project";
            } else {
                document.getElementById('work-link').style.display = 'none';
            }

            // Load and render Markdown content or fallback to plain text
            const contentElement = document.getElementById('work-content');
            if (project.contentFile) {
                fetch(project.contentFile)
                    .then(response => response.text())
                    .then(markdown => {
                        contentElement.innerHTML = marked.parse(markdown); // Use a Markdown parser like Marked.js
                    })
                    .catch(error => {
                        console.error('Error loading Markdown file:', error);
                        contentElement.textContent = 'Failed to load project details.';
                    });
            } else if (project.content) {
                contentElement.textContent = project.content;
            }

            if (project.contentFile) {
                fetch(project.contentFile)
                    .then(response => response.text())
                    .then(markdown => {
                        let parsedHTML = marked.parse(markdown);

                        // Convert footnote references (e.g., [^1]) into clickable elements
                        parsedHTML = parsedHTML.replace(/\[\^(\d+)\]/g, (match, num) => {
                            return `<sup id="fnref-${num}"><a href="#fn-${num}" class="footnote-ref" onclick="scrollToFootnote(event, '${num}')">${num}</a></sup>`;
                        });

                        // Convert footnote definitions (e.g., [^1]: Explanation)
                        parsedHTML = parsedHTML.replace(/\[\^(\d+)\]:\s(.+)/g, (match, num, text) => {
                            return `<div id="fn-${num}" class="footnote">
                        <sup>${num}</sup> ${text} 
                        <a href="#fnref-${num}" class="footnote-back" onclick="scrollBackToText(event, '${num}')">&#x21A9;</a>
                    </div>`;
                        });

                        contentElement.innerHTML = parsedHTML;
                        // Add target="_blank" to all links
                        const links = contentElement.querySelectorAll('a');
                        links.forEach(link => {
                            link.target = "_blank";
                            link.rel = "noopener noreferrer"; // Security best practice
                        });

                        // Find all iframes inside the content and wrap them in a responsive container
                        const iframes = contentElement.querySelectorAll('iframe');
                        iframes.forEach(iframe => {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'responsive-iframe-container';
                            iframe.parentNode.insertBefore(wrapper, iframe);
                            wrapper.appendChild(iframe);
                        });

                        // ** Attach click event to Markdown images to use the modal **
                        const markdownImages = contentElement.querySelectorAll('img');
                        markdownImages.forEach((img, index) => {
                            img.classList.add('clickable-image'); // Add a class for styling
                            img.addEventListener('click', () => {
                                openModalForMarkdown(img.src);
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Error loading Markdown file:', error);
                        contentElement.textContent = 'Failed to load project details.';
                    });
            }

            // Load media
            if (project.media) {
                mediaItems = project.media;
            }

            // Render main media element
            const mainMediaContainer = document.getElementById('main-media-container');
            console.log("Main media container:", mainMediaContainer);
            console.log("Project main media:", project.mainMedia);

            if (mainMediaContainer && project.mainMedia && project.mainMedia.length > 0) {
                const mainMedia = project.mainMedia[0]; // Access the first item in the array
                console.log("Rendering main media:", mainMedia);

                if (mainMedia.type === "image") {
                    const img = document.createElement('img');
                    img.src = mainMedia.src;
                    img.alt = project.title;
                    img.style.width = "100%"; // Ensure the image scales correctly
                    mainMediaContainer.appendChild(img);

                } else if (mainMedia.type === "video") {
                    const video = document.createElement('video');
                    video.src = mainMedia.src;
                    video.controls = true;
                    video.playsInline = true; // Ensure inline playback on mobile
                    video.style.width = "100%"; // Ensure the video scales
                    video.style.height = "auto"; // Maintain aspect ratio
                    mainMediaContainer.appendChild(video);

                } else if (mainMedia.type === "youtube") {
                    const iframeContainer = document.createElement('div');
                    iframeContainer.className = "responsive-iframe-container";

                    const iframe = document.createElement('iframe');
                    // Add playsinline parameter for iOS
                    const separator = mainMedia.src.includes('?') ? '&' : '?';
                    iframe.src = `${mainMedia.src}${separator}playsinline=1`;
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen";
                    iframe.allowFullscreen = true;

                    iframeContainer.appendChild(iframe);
                    mainMediaContainer.appendChild(iframeContainer);

                } else if (mainMedia.type === "spotify") {
                    const iframe = document.createElement('iframe');
                    iframe.src = mainMedia.src;
                    iframe.style.width = "100%";
                    iframe.style.height = "352px"; // Fixed height for better desktop/mobile display
                    iframe.style.border = "0";
                    iframe.style.display = "block";
                    iframe.allow = "encrypted-media";
                    iframe.allowFullscreen = true;
                    iframe.loading = "lazy";

                    mainMediaContainer.appendChild(iframe);

                } else if (mainMedia.type === "google-drive-video") {
                    // Handle Google Drive embedded video
                    const iframeContainer = document.createElement('div');
                    iframeContainer.className = "responsive-iframe-container";

                    const iframe = document.createElement('iframe');
                    iframe.src = mainMedia.src;
                    iframe.style.width = "100%";
                    iframe.style.height = "100%";
                    iframe.allow = "autoplay; fullscreen";
                    iframe.frameBorder = "0";
                    iframe.allowFullscreen = true;

                    iframeContainer.appendChild(iframe);
                    mainMediaContainer.appendChild(iframeContainer);

                } else {
                    console.log("Unsupported main media type:", mainMedia.type);
                }
            } else {
                console.error("Main media is missing or not properly structured.");
            }

            // Render gallery
            const galleryContainer = document.getElementById('gallery-container');

            if (project.media && project.media.length > 0) {
                mediaItems = project.media.filter(mediaItem => !mediaItem.exclude); // Filter out excluded items

                mediaItems.forEach((mediaItem, index) => {
                    let mediaElement;
                    const mediaWrapper = document.createElement('div');

                    // Check if the image should be full-width (16:9 aspect ratio)
                    if (mediaItem.full === 1) {
                        mediaWrapper.className = 'gallery-item full-aspect-container';
                    } else {
                        mediaWrapper.className = 'gallery-item';
                    }

                    if (mediaItem.type === 'image') {
                        mediaElement = document.createElement('img');
                        mediaElement.src = mediaItem.src;
                        mediaElement.loading = "lazy";
                        mediaElement.addEventListener('click', () => {
                            openModal(index, 'image');
                        });

                    } else if (mediaItem.type === 'video') {
                        mediaElement = document.createElement('video');
                        mediaElement.src = mediaItem.src;
                        mediaElement.loop = true;
                        mediaElement.muted = true;
                        mediaElement.autoplay = true;
                        mediaElement.playsInline = true;
                        mediaElement.addEventListener('click', () => {
                            openModal(index, 'video');
                        });

                    } else if (mediaItem.type === 'google-drive-video') {
                        // Create a div container for the iframe
                        const iframeContainer = document.createElement('div');
                        iframeContainer.className = 'gallery-item responsive-iframe-container';

                        // Create the Google Drive iframe
                        mediaElement = document.createElement('iframe');
                        mediaElement.src = mediaItem.src;
                        mediaElement.allow = "autoplay; fullscreen";
                        mediaElement.frameBorder = "0";
                        mediaElement.className = 'responsive-media';
                        mediaElement.allowFullscreen = true;

                        // Append iframe to container
                        iframeContainer.appendChild(mediaElement);
                        galleryContainer.appendChild(iframeContainer);
                        return; // Exit function to prevent double append
                    }

                    // Append media to wrapper, then wrapper to gallery
                    mediaWrapper.appendChild(mediaElement);
                    galleryContainer.appendChild(mediaWrapper);
                });

            } else {
                console.log("No media items found for this project.");
            }

            // Suggest another work
            const otherProjects = data.filter(p => p.id != projectId);
            if (otherProjects.length > 0) {
                const randomProject = otherProjects[Math.floor(Math.random() * otherProjects.length)];
                const nextContainer = document.getElementById('next-project-container');
                if (nextContainer) {
                    nextContainer.innerHTML = `
                        <div>Next Project</div>
                        <a href="work.html?id=${randomProject.id}">${randomProject.title} &rarr;</a>
                    `;
                }
            }
        } else {
            console.error("Project not found");
            document.getElementById('work-title').textContent = 'Project not found';
        }
    })
    .catch(error => {
        console.error('Error fetching project details:', error);
        document.getElementById('work-title').textContent = 'Error loading project details';
    });

// Function to open the modal and display the media
function openModal(index, type) {
    currentMediaIndex = index;

    // Create modal structure
    const modal = document.createElement('div');
    modal.id = 'media-modal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <img id="modal-image" class="modal-image" src="" alt="Expanded Image">
            <video id="modal-video" class="modal-video" controls></video>
            <button id="prev-media" class="arrow left">&larr;</button>
            <button id="next-media" class="arrow right">&rarr;</button>
            <span id="close-modal" class="close">close</span>
        </div>
    `;

    // Append modal to body
    document.body.appendChild(modal);

    const modalImage = document.getElementById('modal-image');
    const modalVideo = document.getElementById('modal-video');

    if (type === 'image') {
        modalImage.src = mediaItems[index].src;
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
    } else if (type === 'video') {
        modalVideo.src = mediaItems[index].src;
        modalVideo.style.display = 'block';
        modalImage.style.display = 'none';
        modalVideo.play();
    }

    modal.style.display = 'flex'; // Change to 'flex' to use Flexbox centering

    // Close the modal when the close button is clicked
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
        modal.remove(); // Remove modal from DOM
        modalVideo.pause(); // Pause the video when closing the modal
    });

    // Close the modal when clicking outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal.remove(); // Remove modal from DOM
            modalVideo.pause(); // Pause the video when closing the modal
        }
    });

    // Navigate to the previous media item
    document.getElementById('prev-media').addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
        updateModalContent();
    });

    // Navigate to the next media item
    document.getElementById('next-media').addEventListener('click', () => {
        currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
        updateModalContent();
    });

    // Navigate using keyboard arrows
    window.addEventListener('keydown', handleKeydown);

    function handleKeydown(event) {
        if (event.key === 'ArrowLeft') {
            currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
            updateModalContent();
        } else if (event.key === 'ArrowRight') {
            currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
            updateModalContent();
        } else if (event.key === 'Escape') {
            modal.style.display = 'none';
            modal.remove(); // Remove modal from DOM
            modalVideo.pause(); // Pause the video when closing the modal
            window.removeEventListener('keydown', handleKeydown); // Remove event listener
        }
    }

    // Swipe gestures
    let touchStartX = 0;
    let touchEndX = 0;

    modal.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    modal.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe Left -> Next
            currentMediaIndex = (currentMediaIndex + 1) % mediaItems.length;
            updateModalContent();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe Right -> Previous
            currentMediaIndex = (currentMediaIndex - 1 + mediaItems.length) % mediaItems.length;
            updateModalContent();
        }
    }

    function updateModalContent() {
        if (mediaItems[currentMediaIndex].type === 'image') {
            modalImage.src = mediaItems[currentMediaIndex].src;
            modalImage.style.display = 'block';
            modalVideo.style.display = 'none';
            modalVideo.pause();
        } else if (mediaItems[currentMediaIndex].type === 'video') {
            modalVideo.src = mediaItems[currentMediaIndex].src;
            modalVideo.style.display = 'block';
            modalImage.style.display = 'none';
            modalVideo.play();
        }
    }
}

function openModalForMarkdown(imageSrc) {
    // Check if modal already exists
    let modal = document.getElementById('media-modal');
    if (!modal) {
        // Create modal structure
        modal = document.createElement('div');
        modal.id = 'media-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span id="close-modal" class="close">&times;</span>
                <img id="modal-image" class="modal-image" src="" alt="Expanded Image">
            </div>
        `;

        // Append modal to body
        document.body.appendChild(modal);

        // Add close functionality
        document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
            modal.remove(); // Remove modal from DOM
        });

        // Close the modal when clicking outside of the modal content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                modal.remove(); // Remove modal from DOM
            }
        });

        // Allow closing with Escape key
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
                modal.remove();
            }
        });
    }

    // Update modal image and display it
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
}

// Function to scroll to footnote smoothly
function scrollToFootnote(event, num) {
    event.preventDefault(); // Prevent default link behavior
    const footnote = document.getElementById(`fn-${num}`);
    if (footnote) {
        footnote.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Function to scroll back to the reference
function scrollBackToText(event, num) {
    event.preventDefault(); // Prevent default link behavior
    const ref = document.getElementById(`fnref-${num}`);
    if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  function moveCursor(x, y) {
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }
  document.addEventListener('mousemove', (e) => {
    moveCursor(e.clientX, e.clientY); 
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('pressed'); 
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('pressed'); 
  });
});
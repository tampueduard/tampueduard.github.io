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
                        const parsedHTML = marked.parse(markdown); // Use Marked.js or your Markdown parser
                        contentElement.innerHTML = parsedHTML;

                        // Add target="_blank" to all links
                        const links = contentElement.querySelectorAll('a');
                        links.forEach(link => {
                            link.target = "_blank";
                            link.rel = "noopener noreferrer"; // Security best practice
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
                    video.style.width = "100%"; // Ensure the video scales
                    mainMediaContainer.appendChild(video);
                } else if (mainMedia.type === "youtube") {
                    const iframeContainer = document.createElement('div');
                    iframeContainer.className = "responsive-iframe-container";
                    const iframe = document.createElement('iframe');
                    iframe.src = mainMedia.src;
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;
                    iframeContainer.appendChild(iframe);
                    mainMediaContainer.appendChild(iframeContainer);
                } else if (mainMedia.type === "spotify") {
                    const iframeContainer = document.createElement('div');
                    iframeContainer.className = "responsive-spotify-container";

                    const iframe = document.createElement('iframe');
                    iframe.src = mainMedia.src;
                    iframe.allow = "encrypted-media";

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
                mediaItems = project.media;
                project.media.forEach((mediaItem, index) => {
                    let mediaElement;
                    if (mediaItem.type === 'image') {
                        mediaElement = document.createElement('img');
                        mediaElement.src = mediaItem.src;
                        mediaElement.className = 'gallery-item';
                        mediaElement.addEventListener('click', () => {
                            openModal(index, 'image');
                        });
                    } else if (mediaItem.type === 'video') {
                        mediaElement = document.createElement('video');
                        mediaElement.src = mediaItem.src;
                        mediaElement.loop = true;
                        mediaElement.muted = true;
                        mediaElement.autoplay = true;
                        mediaElement.className = 'gallery-item';
                        mediaElement.addEventListener('click', () => {
                            openModal(index, 'video');
                        });
                    }
                    galleryContainer.appendChild(mediaElement);
                });
            } else {
                console.log("No media items found for this project.");
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
            <span id="close-modal" class="close">&times;</span>
            <img id="modal-image" class="modal-image" src="" alt="Expanded Image">
            <video id="modal-video" class="modal-video" controls></video>
            <button id="prev-media" class="arrow left">&larr;</button>
            <button id="next-media" class="arrow right">&rarr;</button>
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
let currentMediaIndex = 0;
let mediaItems = [];

// Get query parameter (e.g., ?id=8)
const urlParams = new URLSearchParams(window.location.search);
const projectId = urlParams.get('id');

// Fetch project details from JSON
fetch('projects.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const project = data.find(item => item.id == projectId);

        if (project) {
            // Populate project details
            document.getElementById('work-title').textContent = project.title;
            document.getElementById('work-subtitle').innerHTML =
                `${project.year}${project.place ? ` &mdash; ${project.place}` : ''}`;
            document.getElementById('work-details').innerHTML =
                `${project.type}${project.typeDetails ? `<br>${project.typeDetails}` : ''}`;

            if (project.link) {
                document.getElementById('work-link').href = project.link;
                document.getElementById('work-link').textContent = "View Project";
            } else {
                document.getElementById('work-link').style.display = 'none';
            }

            // Load and render Markdown content
            const contentElement = document.getElementById('work-content');
            if (project.contentFile) {
                fetch(project.contentFile)
                    .then(response => response.text())
                    .then(markdown => {
                        let parsedHTML = marked.parse(markdown);

                        // Convert footnote references (e.g., [^1])
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

                        // Open all links in new tab
                        const links = contentElement.querySelectorAll('a');
                        links.forEach(link => {
                            link.target = "_blank";
                            link.rel = "noopener noreferrer";
                        });

                        // Wrap iframes in responsive container
                        const iframes = contentElement.querySelectorAll('iframe');
                        iframes.forEach(iframe => {
                            const wrapper = document.createElement('div');
                            wrapper.className = 'responsive-iframe-container';
                            iframe.parentNode.insertBefore(wrapper, iframe);
                            wrapper.appendChild(iframe);
                        });

                        // Make Markdown images clickable
                        const markdownImages = contentElement.querySelectorAll('img');
                        markdownImages.forEach(img => {
                            img.classList.add('clickable-image');
                            img.addEventListener('click', () => {
                                openModalForMarkdown(img.src);
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Error loading Markdown file:', error);
                        contentElement.textContent = 'Failed to load project details.';
                    });
            } else if (project.content) {
                contentElement.textContent = project.content;
            }

            // Load media
            if (project.media) {
                mediaItems = project.media;
            }

            // Render main media element
            const mainMediaContainer = document.getElementById('main-media-container');

            if (mainMediaContainer && project.mainMedia && project.mainMedia.length > 0) {
                const mainMedia = project.mainMedia[0];

                if (mainMedia.type === "image") {
                    const container = document.createElement('div');
                    container.className = 'responsive-media-container';
                    const img = document.createElement('img');
                    img.src = mainMedia.src;
                    img.alt = project.title;
                    container.appendChild(img);
                    mainMediaContainer.appendChild(container);

                } else if (mainMedia.type === "video") {
                    const container = document.createElement('div');
                    container.className = 'responsive-media-container';
                    const video = document.createElement('video');
                    video.src = mainMedia.src;
                    video.playsInline = true;
                    video.setAttribute('playsinline', '');
                    video.loop = true;
                    video.muted = (mainMedia.muted !== undefined) ? mainMedia.muted : true;
                    video.volume = 0.2;
                    video.controls = mainMedia.controls;
                    video.autoplay = true;
                    container.appendChild(video);
                    mainMediaContainer.appendChild(container);

                } else if (mainMedia.type === "youtube") {
                    const iframeContainer = document.createElement('div');
                    iframeContainer.className = "responsive-iframe-container";
                    const iframe = document.createElement('iframe');
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
                    iframe.style.height = "352px";
                    iframe.style.border = "0";
                    iframe.style.display = "block";
                    iframe.allow = "encrypted-media";
                    iframe.allowFullscreen = true;
                    iframe.loading = "lazy";
                    mainMediaContainer.appendChild(iframe);

                } else if (mainMedia.type === "google-drive-video") {
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
                }

                // Add credits if available
                if (mainMedia.credits) {
                    const creditsDiv = document.createElement('div');
                    creditsDiv.className = 'main-media-credits';
                    if (mainMedia.link) {
                        const creditLink = document.createElement('a');
                        creditLink.href = mainMedia.link;
                        creditLink.target = '_blank';
                        creditLink.textContent = mainMedia.credits;
                        creditsDiv.appendChild(creditLink);
                    } else {
                        creditsDiv.textContent = mainMedia.credits;
                    }
                    mainMediaContainer.appendChild(creditsDiv);
                }
            }

            // Render gallery
            const galleryContainer = document.getElementById('gallery-container');

            if (project.media && project.media.length > 0) {
                mediaItems = project.media.filter(mediaItem => !mediaItem.exclude);

                mediaItems.forEach((mediaItem, index) => {
                    let mediaElement;
                    const mediaWrapper = document.createElement('div');

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
                            openModal(index);
                        });

                    } else if (mediaItem.type === 'video') {
                        mediaElement = document.createElement('video');
                        mediaElement.src = mediaItem.src;
                        mediaElement.loop = true;
                        mediaElement.muted = true;
                        mediaElement.autoplay = true;
                        mediaElement.playsInline = true;
                        mediaElement.setAttribute('playsinline', '');
                        mediaElement.addEventListener('click', () => {
                            openModal(index);
                        });

                    } else if (mediaItem.type === 'google-drive-video') {
                        const iframeContainer = document.createElement('div');
                        iframeContainer.className = 'gallery-item responsive-iframe-container';

                        mediaElement = document.createElement('iframe');
                        mediaElement.src = mediaItem.src;
                        mediaElement.allow = "autoplay; fullscreen";
                        mediaElement.frameBorder = "0";
                        mediaElement.className = 'responsive-media';
                        mediaElement.allowFullscreen = true;

                        iframeContainer.appendChild(mediaElement);
                        galleryContainer.appendChild(iframeContainer);
                        return;
                    }

                    mediaWrapper.appendChild(mediaElement);
                    galleryContainer.appendChild(mediaWrapper);
                });
            }

            // Prev / Next navigation — sorted the same way as the index page
            const sortedData = [...data].sort((a, b) => {
                const isANumeric = !isNaN(a.year);
                const isBNumeric = !isNaN(b.year);
                if (!isANumeric && isBNumeric) return 1;
                if (isANumeric && !isBNumeric) return -1;
                if (!isANumeric && !isBNumeric) return a.year.localeCompare(b.year);
                if (a.year !== b.year) return b.year.localeCompare(a.year);
                return (b.month || 0) - (a.month || 0);
            });

            const currentIdx  = sortedData.findIndex(p => p.id == projectId);
            const prevProject = currentIdx > 0 ? sortedData[currentIdx - 1] : null;
            const nextProject = currentIdx < sortedData.length - 1 ? sortedData[currentIdx + 1] : null;

            const nextContainer = document.getElementById('next-project-container');
            if (nextContainer) {
                let html = '';
                if (prevProject) {
                    html += `
                        <a href="work.html?id=${prevProject.id}" class="project-nav prev-project">
                            <span class="project-nav-label">&larr; previous</span>
                            <span class="project-nav-title">${prevProject.title}</span>
                        </a>`;
                } else {
                    html += `<span></span>`;
                }
                if (nextProject) {
                    html += `
                        <a href="work.html?id=${nextProject.id}" class="project-nav next-project">
                            <span class="project-nav-label">next &rarr;</span>
                            <span class="project-nav-title">${nextProject.title}</span>
                        </a>`;
                }
                nextContainer.innerHTML = html;
            }
        } else {
            document.getElementById('work-title').textContent = 'Project not found';
        }
    })
    .catch(error => {
        console.error('Error fetching project details:', error);
        document.getElementById('work-title').textContent = 'Error loading project details';
    });

// ── Lightbox ──────────────────────────────────────────────────────────────────
function openModal(index) {
    currentMediaIndex = index;
    document.body.style.overflow = 'hidden';

    const lb = document.createElement('div');
    lb.id        = 'media-modal';
    lb.className = 'lightbox';
    lb.innerHTML = `
        <div class="lb-zone lb-prev" id="lb-prev"></div>
        <div class="lb-zone lb-next" id="lb-next"></div>
        <img   class="lb-media" id="lb-img" alt="">
        <video class="lb-media" id="lb-vid" loop playsinline></video>
        <div class="lb-bar">
            <span class="lb-credits" id="lb-credits"></span>
            <span class="lb-counter" id="lb-counter"></span>
        </div>
        <span class="lb-close" id="lb-close">close</span>
    `;
    document.body.appendChild(lb);

    const img      = lb.querySelector('#lb-img');
    const vid      = lb.querySelector('#lb-vid');
    const credits  = lb.querySelector('#lb-credits');
    const counter  = lb.querySelector('#lb-counter');
    const closeBtn = lb.querySelector('#lb-close');
    const prevZone = lb.querySelector('#lb-prev');
    const nextZone = lb.querySelector('#lb-next');
    const total    = mediaItems.length;

    function show(idx) {
        const item = mediaItems[idx];
        counter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

        if (item.credits) {
            credits.innerHTML = item.link
                ? `<a href="${item.link}" target="_blank">${item.credits}</a>`
                : item.credits;
            credits.style.visibility = 'visible';
        } else {
            credits.style.visibility = 'hidden';
        }

        img.style.opacity = '0';
        vid.style.opacity = '0';
        setTimeout(() => {
            if (item.type === 'image') {
                img.src = item.src;
                img.style.display = 'block';
                vid.style.display = 'none';
                vid.pause();
                const reveal = () => { img.style.opacity = '1'; };
                img.complete ? reveal() : (img.onload = reveal);
            } else if (item.type === 'video') {
                vid.src = item.src;
                vid.style.display = 'block';
                img.style.display = 'none';
                vid.play();
                vid.style.opacity = '1';
            }
        }, 160);
    }

    function go(dir) {
        currentMediaIndex = (currentMediaIndex + dir + total) % total;
        show(currentMediaIndex);
    }

    function close() {
        document.body.style.overflow = 'auto';
        vid.pause();
        lb.remove();
        window.removeEventListener('keydown', onKey);
    }

    show(index);

    prevZone.addEventListener('click', () => go(-1));
    nextZone.addEventListener('click', () => go(1));
    closeBtn.addEventListener('click', close);

    function onKey(e) {
        if (e.key === 'ArrowLeft')  go(-1);
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'Escape')     close();
    }
    window.addEventListener('keydown', onKey);

    // Touch: swipe horizontal → navigate, swipe down → close
    let tx = 0, ty = 0;
    lb.addEventListener('touchstart', e => {
        tx = e.changedTouches[0].screenX;
        ty = e.changedTouches[0].screenY;
    }, { passive: true });
    lb.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - tx;
        const dy = e.changedTouches[0].screenY - ty;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
            go(dx < 0 ? 1 : -1);
        } else if (dy > 80 && Math.abs(dy) > Math.abs(dx)) {
            close();
        }
    }, { passive: true });
}

function openModalForMarkdown(imageSrc) {
    let modal = document.getElementById('media-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id        = 'media-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span id="close-modal" class="close">&times;</span>
                <img id="modal-image" class="modal-image" src="" alt="Expanded Image">
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
            modal.remove();
        });

        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
                modal.remove();
            }
        });

        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
                modal.remove();
            }
        });
    }

    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageSrc;
    modal.style.display = 'flex';
}

// Scroll to footnote smoothly
function scrollToFootnote(event, num) {
    event.preventDefault();
    const footnote = document.getElementById(`fn-${num}`);
    if (footnote) {
        footnote.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Scroll back to the reference
function scrollBackToText(event, num) {
    event.preventDefault();
    const ref = document.getElementById(`fnref-${num}`);
    if (ref) {
        ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.custom-cursor')) return;

  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  function moveCursor(x, y) {
    cursor.style.left = x + 'px';
    cursor.style.top = y + 'px';
  }

  cursor.style.opacity = '0';

  document.addEventListener('mousemove', (e) => {
    cursor.style.opacity = '1';
    moveCursor(e.clientX, e.clientY);
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.tagName === 'IFRAME') {
      cursor.style.opacity = '0';
    }
  });

  document.addEventListener('mousedown', () => {
    cursor.classList.add('pressed');
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('pressed');
  });
});

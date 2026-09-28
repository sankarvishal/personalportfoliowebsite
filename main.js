/**
 * Sankar Vishal S — Portfolio Scripts
 * Handles Navigation, Mobile Drawer, Resume Modal, Lightbox, Code Tabs, Contact Form & Back to Top
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Mobile Menu Toggle ---
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!hamburgerBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- 2. Active Section Highlighting ---
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('nav.links a');

  if (sections.length > 0 && navLinks.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + currentId) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    sections.forEach(sec => observer.observe(sec));
  }

  // --- 3. Frontend Code Showcase Tabs ---
  const codeTabs = document.querySelectorAll('.code-tab');
  const codePanels = document.querySelectorAll('.code-panel');

  if (codeTabs.length > 0) {
    codeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        codeTabs.forEach(t => t.classList.remove('active'));
        codePanels.forEach(p => p.classList.remove('active'));

        tab.classList.add('active');
        const targetPanel = document.getElementById('tab-' + tab.dataset.tab);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  // --- 4. Resume Modal & Download ---
  const resumeModal = document.getElementById('resumeModal');
  const viewResumeBtns = document.querySelectorAll('.view-resume-trigger');
  const closeResumeBtn = document.getElementById('closeResume');
  const dlResumeBtns = document.querySelectorAll('.download-resume-trigger');

  const openResumeModal = () => {
    if (resumeModal) {
      resumeModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (closeResumeBtn) closeResumeBtn.focus();
    }
  };

  const closeResumeModal = () => {
    if (resumeModal) {
      resumeModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  viewResumeBtns.forEach(btn => btn.addEventListener('click', openResumeModal));
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResumeModal);

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) closeResumeModal();
    });
  }

  // Resume Download Handler
  const handleResumeDownload = (e) => {
    // If the element has a direct download href, let it trigger naturally
    const href = e.currentTarget.getAttribute('href');
    if (href && !href.startsWith('#')) {
      return; // Default anchor download proceeds
    }
    
    // Otherwise fallback to static PDF path
    const pdfPath = 'assets/Sankar_Vishal_S_Resume.pdf';
    const a = document.createElement('a');
    a.href = pdfPath;
    a.download = 'Sankar_Vishal_S_Resume.pdf';
    document.body.appendChild(a);
    try {
      a.click();
    } catch (err) {
      openResumeModal();
    } finally {
      document.body.removeChild(a);
    }
  };

  dlResumeBtns.forEach(btn => {
    btn.addEventListener('click', handleResumeDownload);
  });

  // --- 5. Image Lightbox Modal ---
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const closeLightboxBtn = document.getElementById('closeLightbox');

  const openLightbox = (src, alt, captionText) => {
    if (lightboxModal && lightboxImg) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || 'Preview';
      if (lightboxCaption) {
        lightboxCaption.textContent = captionText || alt || '';
      }
      lightboxModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (closeLightboxBtn) closeLightboxBtn.focus();
    }
  };

  const closeLightbox = () => {
    if (lightboxModal) {
      lightboxModal.classList.remove('open');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    }
  };

  if (closeLightboxBtn) closeLightboxBtn.addEventListener('click', closeLightbox);
  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  // Attach lightbox trigger to all gallery figures
  document.querySelectorAll('.gallery-scroll figure, [data-lightbox]').forEach(fig => {
    fig.addEventListener('click', () => {
      const img = fig.querySelector('img') || fig;
      const caption = fig.querySelector('figcaption');
      const captionText = caption ? caption.textContent.trim() : (img.alt || '');
      openLightbox(img.src, img.alt, captionText);
    });
  });

  // Global Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResumeModal();
      closeLightbox();
    }
  });

  // --- 6. Contact Form Email Pre-fill (mailto) ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('cf-name')?.value || '').trim();
      const email = (document.getElementById('cf-email')?.value || '').trim();
      const message = (document.getElementById('cf-message')?.value || '').trim();

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n—\nSender: ${name}\nEmail: ${email}`);
      window.location.href = `mailto:sankar82209@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  // --- 7. Back to Top Button ---
  const backTop = document.getElementById('backTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('show', window.scrollY > 450);
    }, { passive: true });

    backTop.addEventListener('click', () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }
});

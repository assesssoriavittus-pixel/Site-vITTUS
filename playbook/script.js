/* ═══════════════════════════════════════════════════════
   VITTUS PLAYBOOK — Landing Page JavaScript
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Configuration ──────────────────────────────────────
  const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwLJeTc0CT13wIyXQxEatE0zz1zT_3DdP8n855XnMp96ULNG-xoNjrZLh3-NohVev9mrQ/exec';
  const REDIRECT_URL = 'https://assesssoriavittus-pixel.github.io/quiz-vittus/agendamento.html';

  // ── DOM References ────────────────────────────────────
  const header = document.getElementById('header');
  const modal = document.getElementById('leadModal');
  const modalClose = document.getElementById('modalClose');
  const leadForm = document.getElementById('leadForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const submitBtn = document.getElementById('submitBtn');
  const openModalBtns = document.querySelectorAll('[data-open-modal]');
  const faqItems = document.querySelectorAll('.faq-item');
  const phoneInput = document.getElementById('phone');

  // ═══════════════════════════════════════════════════════
  // HEADER SCROLL EFFECT
  // ═══════════════════════════════════════════════════════
  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ═══════════════════════════════════════════════════════
  // MODAL — OPEN / CLOSE / FOCUS TRAP
  // ═══════════════════════════════════════════════════════
  const FOCUSABLE_SELECTORS = 'button, input, [tabindex]:not([tabindex="-1"]), a[href]';
  let previousFocusEl = null;

  function openModal() {
    previousFocusEl = document.activeElement;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Focus first input after animation
    setTimeout(() => {
      const firstInput = leadForm.querySelector('input');
      if (firstInput && !leadForm.hidden) firstInput.focus();
    }, 380);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Restore focus
    if (previousFocusEl) {
      setTimeout(() => previousFocusEl.focus(), 100);
    }
    // Reset form after close animation
    setTimeout(resetForm, 400);
  }

  // Open triggers
  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Close button
  modalClose.addEventListener('click', closeModal);

  // Close on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Focus Trap
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !modal.classList.contains('active')) return;

    const modalEl = modal.querySelector('.modal');
    const focusableEls = modalEl.querySelectorAll(FOCUSABLE_SELECTORS);
    if (focusableEls.length === 0) return;

    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
      }
    }
  });

  // ═══════════════════════════════════════════════════════
  // FORM — VALIDATION, PHONE MASK, SUBMISSION
  // ═══════════════════════════════════════════════════════
  function resetForm() {
    leadForm.reset();
    clearErrors();
    leadForm.hidden = false;
    modalSuccess.hidden = true;
    submitBtn.querySelector('.btn__text').hidden = false;
    submitBtn.querySelector('.btn__loading').hidden = true;
    submitBtn.disabled = false;
  }

  function clearErrors() {
    leadForm.querySelectorAll('input').forEach(input => {
      input.classList.remove('error');
    });
    leadForm.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
    });
  }

  function showError(field, message) {
    const input = leadForm.querySelector(`#${field}`);
    const errorEl = leadForm.querySelector(`[data-error="${field}"]`);
    if (input) input.classList.add('error');
    if (errorEl) errorEl.textContent = message;
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
  }

  // Brazilian phone mask: (00) 00000-0000
  function formatPhone(value) {
    const digits = value.replace(/\D/g, '');
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 11) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  phoneInput.addEventListener('input', (e) => {
    const cursorPos = e.target.selectionStart;
    const oldLen = e.target.value.length;
    e.target.value = formatPhone(e.target.value);
    const newLen = e.target.value.length;
    const diff = newLen - oldLen;
    e.target.setSelectionRange(cursorPos + diff, cursorPos + diff);
  });

  // ── Show Success & Redirect ───────────────────────────
  function showSuccessAndRedirect() {
    leadForm.hidden = true;
    modalSuccess.hidden = false;

    // Trigger the progress bar animation
    const progressBar = document.querySelector('.success-progress__bar');
    if (progressBar) {
      // Force reflow before adding class
      progressBar.offsetWidth;
      progressBar.classList.add('animate');
    }

    // Redirect after 3 seconds to scheduling page
    setTimeout(() => {
      window.location.href = REDIRECT_URL;
    }, 3000);
  }

  // ── Send to Google Sheets ─────────────────────────────
  function sendToGoogleSheets(data) {
    return fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  // ── Form Submit Handler ───────────────────────────────
  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = leadForm.querySelector('#name').value.trim();
    const email = leadForm.querySelector('#email').value.trim();
    const phone = leadForm.querySelector('#phone').value.trim();

    // Validation
    let hasError = false;

    if (!name || name.length < 3) {
      showError('name', 'Por favor, insira seu nome completo.');
      hasError = true;
    }

    if (!email || !validateEmail(email)) {
      showError('email', 'Por favor, insira um e-mail válido.');
      hasError = true;
    }

    if (!phone || !validatePhone(phone)) {
      showError('phone', 'Por favor, insira um WhatsApp válido.');
      hasError = true;
    }

    if (hasError) return;

    // Show loading state
    submitBtn.querySelector('.btn__text').hidden = true;
    submitBtn.querySelector('.btn__loading').hidden = false;
    submitBtn.disabled = true;

    // Prepare lead data
    const now = new Date();
    const leadData = {
      timestamp: now.toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      nome: name,
      email: email,
      telefone: phone,
      empresa: '',
      cnpj: '',
      segmento: 'Playbook',
      faturamento: '',
      investimento: ''
    };

    // Save to localStorage as backup
    try {
      const existingLeads = JSON.parse(localStorage.getItem('vittus_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('vittus_leads', JSON.stringify(existingLeads));
    } catch (err) {
      console.warn('localStorage save failed:', err);
    }

    // Execute submission to Google Sheets
    try {
      await sendToGoogleSheets(leadData);
    } catch (err) {
      console.warn('Submission error (non-blocking):', err);
    }

    // Always show success regardless of API outcomes
    showSuccessAndRedirect();
  });

  // ═══════════════════════════════════════════════════════
  // FAQ ACCORDION
  // ═══════════════════════════════════════════════════════
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      item.classList.toggle('active', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // ═══════════════════════════════════════════════════════
  // SCROLL REVEAL — IntersectionObserver
  // ═══════════════════════════════════════════════════════
  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
      }
    );

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }

  // ═══════════════════════════════════════════════════════
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ═══════════════════════════════════════════════════════
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

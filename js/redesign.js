const header = document.querySelector('.site-header');
const menuToggle = header.querySelector('.menu-toggle');
const navigation = header.querySelector('.site-nav');

header.classList.add('js-menu');
menuToggle.hidden = false;

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});
header.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    setMenu(false);
    menuToggle.focus();
  }
});

const footerVideo = document.querySelector('.footer-video');
if (footerVideo) {
  footerVideo.addEventListener('toggle', () => {
    const template = footerVideo.querySelector('template');
    if (footerVideo.open && template) {
      template.replaceWith(template.content);
    }
  });
}

const storyLinks = Array.from(document.querySelectorAll('.story-nav a'));
if (storyLinks.length && 'IntersectionObserver' in window) {
  function selectChapter(activeLink) {
    storyLinks.forEach((link) => {
      if (link === activeLink) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  selectChapter(storyLinks[0]);
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        selectChapter(storyLinks.find((link) => link.hash === '#' + entry.target.id));
      }
    }
  }, { rootMargin: '-28% 0px -48% 0px' });
  storyLinks.forEach((link) => observer.observe(document.getElementById(link.hash.slice(1))));
}

const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
  const picker = quoteForm.querySelector('.cover-picker');
  const summary = picker.querySelector('summary');
  const summaryText = picker.querySelector('[data-cover-summary]');
  const chips = quoteForm.querySelector('.cover-chips');
  const selectionStatus = quoteForm.querySelector('[data-cover-status]');
  const clear = picker.querySelector('[data-cover-clear]');
  const options = Array.from(picker.querySelectorAll('input[type="checkbox"]'));
  const search = picker.querySelector('[data-cover-search]');
  const groups = picker.querySelectorAll('.option-group');
  const noResults = picker.querySelector('[data-no-results]');
  const intents = Array.from(quoteForm.querySelectorAll('input[name="intent"]'));
  const businessFields = quoteForm.querySelector('[data-business-fields]');
  const params = new URLSearchParams(window.location.search);

  function renderSelection() {
    const selected = options.filter((option) => option.checked);
    summaryText.textContent = selected.length
      ? selected.length + (selected.length === 1 ? ' product selected' : ' products selected')
      : 'Choose insurance products';
    selectionStatus.textContent = summaryText.textContent;
    clear.disabled = selected.length === 0;
    chips.replaceChildren();
    for (const option of selected) {
      const label = option.labels[0].textContent.trim();
      const item = document.createElement('li');
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.textContent = label + ' ×';
      remove.setAttribute('aria-label', 'Remove ' + label);
      remove.addEventListener('click', () => {
        option.checked = false;
        renderSelection();
        (itemIndex < chips.children.length ? chips.children[itemIndex].firstElementChild : summary).focus();
      });
      const itemIndex = chips.children.length;
      item.append(remove);
      chips.append(item);
    }
  }

  function updateIntent() {
    const business = intents.some((option) => option.checked && option.value === 'business');
    businessFields.hidden = !business;
    businessFields.disabled = !business;
  }

  function filterOptions() {
    const query = search.value.trim().toLowerCase();
    for (const option of options) {
      const label = option.labels[0];
      label.hidden = !label.textContent.toLowerCase().includes(query);
    }
    for (const group of groups) {
      group.hidden = !group.querySelector('label:not([hidden])');
    }
    noResults.hidden = Array.from(groups).some((group) => !group.hidden);
  }

  function closePicker() {
    picker.open = false;
    summary.focus();
  }

  intents.forEach((option) => {
    option.checked = option.value === params.get('intent');
    option.addEventListener('change', updateIntent);
  });
  options.forEach((option) => {
    option.checked = params.getAll('cover').includes(option.dataset.coverId);
    option.addEventListener('change', renderSelection);
  });
  search.addEventListener('input', filterOptions);
  picker.addEventListener('toggle', () => {
    if (!picker.open) {
      search.value = '';
      filterOptions();
    }
  });
  clear.addEventListener('click', () => {
    options.forEach((option) => { option.checked = false; });
    renderSelection();
    search.focus();
  });
  picker.querySelector('[data-cover-done]').addEventListener('click', closePicker);
  picker.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && picker.open) {
      event.preventDefault();
      closePicker();
    }
  });
  document.addEventListener('click', (event) => {
    if (picker.open && !picker.contains(event.target)) picker.open = false;
  });

  updateIntent();
  renderSelection();
  quoteForm.querySelector('button[type="submit"]').disabled = false;
}

for (const field of document.querySelectorAll('.form-panel textarea[data-require-letter]')) {
  field.addEventListener('input', () => field.setCustomValidity(''));
  field.form.addEventListener('submit', (event) => {
    if (field.value !== '' && !/\p{L}/u.test(field.value)) {
      event.preventDefault();
      field.setCustomValidity('Enter a message containing at least one letter.');
      field.reportValidity();
    }
  });
}

const captchaPanel = document.querySelector('[data-recaptcha]');
// Add a public Google reCAPTCHA v2 Checkbox site key registered for ciansw.com.au.
const recaptchaSiteKey = '';
const recaptchaHosts = ['ciansw.com.au', 'www.ciansw.com.au'];

if (captchaPanel && recaptchaSiteKey && recaptchaHosts.includes(location.hostname)) {
  const form = captchaPanel.closest('form');
  const widget = captchaPanel.querySelector('[data-recaptcha-widget]');
  const status = captchaPanel.querySelector('[data-recaptcha-status]');
  const fallback = form.querySelector('[data-recaptcha-fallback]');
  let widgetId;

  function useHostedVerification() {
    widgetId = undefined;
    captchaPanel.hidden = true;
    fallback.hidden = false;
  }

  window.initCianswRecaptcha = () => {
    try {
      captchaPanel.hidden = false;
      widgetId = window.grecaptcha.render(widget, {
        sitekey: recaptchaSiteKey,
        size: widget.clientWidth < 304 ? 'compact' : 'normal',
        callback: () => { status.textContent = ''; },
        'expired-callback': () => { status.textContent = 'The check expired. Please complete it again.'; },
        'error-callback': useHostedVerification
      });
      fallback.hidden = true;
    } catch {
      useHostedVerification();
    }
  };

  form.addEventListener('submit', (event) => {
    if (!event.defaultPrevented && widgetId !== undefined && !window.grecaptcha.getResponse(widgetId)) {
      event.preventDefault();
      status.textContent = 'Please select “I’m not a robot” before submitting.';
    }
  });

  // FormSubmit verifies its own challenge. An inline token belongs to this site's key.
  form.addEventListener('formdata', (event) => {
    event.formData.delete('g-recaptcha-response');
  });

  const api = document.createElement('script');
  api.src = 'https://www.google.com/recaptcha/api.js?onload=initCianswRecaptcha&render=explicit';
  api.async = true;
  api.addEventListener('error', useHostedVerification);
  document.head.append(api);
}

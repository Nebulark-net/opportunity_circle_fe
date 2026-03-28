const ALLOWED_TAGS = new Set([
  'a',
  'b',
  'blockquote',
  'br',
  'code',
  'div',
  'em',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'hr',
  'i',
  'li',
  'ol',
  'p',
  'pre',
  'strong',
  'sub',
  'sup',
  'u',
  'ul',
]);

const BLOCKED_TAGS = new Set([
  'button',
  'embed',
  'form',
  'iframe',
  'img',
  'input',
  'link',
  'meta',
  'object',
  'script',
  'select',
  'style',
  'svg',
  'textarea',
]);

const ALLOWED_ATTRIBUTES = {
  a: new Set(['href', 'rel', 'target', 'title']),
};

const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

const isSafeUrl = (value) => {
  if (!value) return false;

  const normalized = value.trim();

  if (!normalized) return false;
  if (normalized.startsWith('#') || normalized.startsWith('/')) return true;

  try {
    const url = new URL(normalized, window.location.origin);
    return SAFE_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
};

const unwrapElement = (element) => {
  const parent = element.parentNode;

  if (!parent) {
    element.remove();
    return;
  }

  while (element.firstChild) {
    parent.insertBefore(element.firstChild, element);
  }

  element.remove();
};

const sanitizeElement = (element) => {
  const tagName = element.tagName.toLowerCase();

  Array.from(element.children).forEach(sanitizeElement);

  if (BLOCKED_TAGS.has(tagName)) {
    element.remove();
    return;
  }

  if (!ALLOWED_TAGS.has(tagName)) {
    unwrapElement(element);
    return;
  }

  Array.from(element.attributes).forEach((attribute) => {
    const name = attribute.name.toLowerCase();
    const value = attribute.value;
    const allowedForTag = ALLOWED_ATTRIBUTES[tagName] ?? new Set();

    if (name.startsWith('on') || name === 'style') {
      element.removeAttribute(attribute.name);
      return;
    }

    if (!allowedForTag.has(name)) {
      element.removeAttribute(attribute.name);
      return;
    }

    if ((name === 'href' || name === 'src') && !isSafeUrl(value)) {
      element.removeAttribute(attribute.name);
    }
  });

  if (tagName === 'a') {
    if (!element.getAttribute('href')) {
      element.removeAttribute('target');
      element.removeAttribute('rel');
      return;
    }

    if (element.getAttribute('target') === '_blank') {
      element.setAttribute('rel', 'noopener noreferrer');
    } else {
      element.removeAttribute('target');
      element.removeAttribute('rel');
    }
  }
};

export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') return '';

  if (typeof document === 'undefined') {
    return html.replace(/<[^>]*>/g, '');
  }

  const template = document.createElement('template');
  template.innerHTML = html;

  Array.from(template.content.children).forEach(sanitizeElement);

  return template.innerHTML;
};

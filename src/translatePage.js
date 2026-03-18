/**
 * Whole-page translation using backend /api/translate endpoint.
 * Copied from main frontend, adapted to use the Vite dev proxy.
 */

const SELECTORS =
  'h1, h2, h3, h4, h5, h6, p, a, span, button, li, label, td, th, option, div';

function shouldSkip(el) {
  if (!el || typeof el.closest !== 'function') return true;
  if (el.closest('script, style, noscript, [data-no-translate]')) return true;
  if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return true;
  if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return true;
  return false;
}

function getLeafTextElements(root = document.body) {
  const all = Array.from(root.querySelectorAll(SELECTORS));
  return all.filter((el) => {
    if (shouldSkip(el)) return false;
    const text = (el.innerText || '').trim();
    if (!text) return false;
    const nested = el.querySelectorAll(SELECTORS);
    return nested.length <= 1 && (!nested.length || nested[0] === el);
  });
}

export async function translatePage(targetLang) {
  if (!targetLang || targetLang === 'en' || targetLang === 'en-uk') return;

  const elements = getLeafTextElements();
  if (elements.length === 0) return;

  const texts = elements.map((el) => el.innerText.trim()).filter(Boolean);
  if (texts.length === 0) return;

  const apiUrl = ''; // use Vite proxy to /api
  try {
    const res = await fetch(`${apiUrl}/api/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts, target: targetLang }),
    });
    if (!res.ok) throw new Error(`Translate: ${res.status}`);
    const data = await res.json();
    const translations = data.translations || [];
    elements.forEach((el, i) => {
      if (translations[i] != null) el.innerText = translations[i];
    });
  } catch (err) {
    console.warn('Landing page translation failed:', err?.message);
  }
}


/* PYTHAI i18n — lang from localStorage or browser; brand terms & headlines stay EN. */
(function () {
  var stored = null; try { stored = localStorage.getItem('py_lang'); } catch (e) {}
  var nav = ((typeof navigator !== 'undefined' && navigator.language) || 'en').toLowerCase();
  var lang = (stored === 'de' || stored === 'en') ? stored : (nav.indexOf('de') === 0 ? 'de' : 'en');
  try { document.documentElement.lang = lang; } catch (e) {}
  window.PYi18n = {
    lang: lang,
    t: function (de, en) { return this.lang === 'de' ? de : en; },
    set: function (l) { try { localStorage.setItem('py_lang', l); } catch (e) {} if (l !== this.lang) location.reload(); }
  };
})();

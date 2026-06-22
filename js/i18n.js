/* PYTHAI i18n — lang from URL ?lang, cookie, localStorage or browser; brand terms & headlines stay EN.
   Persists in BOTH cookie and localStorage so the choice survives even when one store is blocked. */
(function () {
  function ck(k) { try { var m = document.cookie.match("(?:^|; )" + k + "=([^;]*)"); return m ? decodeURIComponent(m[1]) : null; } catch (e) { return null; } }
  function setck(k, v) { try { document.cookie = k + "=" + encodeURIComponent(v) + ";path=/;max-age=31536000;samesite=lax"; } catch (e) {} }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function valid(l) { return l === "de" || l === "en"; }

  var urlLang = null; try { urlLang = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  var nav = ((typeof navigator !== "undefined" && navigator.language) || "en").toLowerCase();
  var lang = valid(urlLang) ? urlLang
    : valid(lsGet("py_lang")) ? lsGet("py_lang")
    : valid(ck("py_lang")) ? ck("py_lang")
    : (nav.indexOf("de") === 0 ? "de" : "en");

  // Re-persist the resolved choice in both stores (heals a missing/blocked store).
  lsSet("py_lang", lang); setck("py_lang", lang);
  try { document.documentElement.lang = lang; } catch (e) {}

  window.PYi18n = {
    lang: lang,
    t: function (de, en) { return this.lang === "de" ? de : en; },
    set: function (l) {
      if (!valid(l)) return;
      lsSet("py_lang", l); setck("py_lang", l);
      if (l === this.lang) return;
      this.lang = l;
      // Reload with the lang in the URL as a final fallback, so the switch always takes effect.
      try { var u = new URL(location.href); u.searchParams.set("lang", l); location.replace(u.toString()); }
      catch (e) { location.reload(); }
    }
  };
})();

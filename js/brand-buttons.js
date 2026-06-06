/* PYTHAI — give all DS Buttons the oracle serif (brand CTAs). Loaded after ds-bundle. */
(function () {
  var ns = window.PYTHAIDesignSystem_df6467;
  if (!ns || !ns.Button || ns.__serifPatched) return;
  var Base = ns.Button;
  ns.Button = function (props) {
    props = props || {};
    var merged = Object.assign({}, props, {
      style: Object.assign({ fontFamily: 'var(--font-oracle)', fontWeight: 600, letterSpacing: '0.03em' }, props.style || {})
    });
    return React.createElement(Base, merged);
  };
  ns.__serifPatched = true;
})();

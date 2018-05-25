declare var __webpack_public_path__: any;
const CONFIG_DIV = document.getElementById('scriptedforms-config-data');

if (CONFIG_DIV) {
  const config = JSON.parse(CONFIG_DIV.textContent);
  __webpack_public_path__ = config.publicPath;
}

/**
 * 加载 svg
 */
export function loadSvg() {
  const files = import.meta.glob("./svg/*.svg"); // vite

  const modules: any = {};

  const requireAll = (files: any) => {
    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        modules[key.replace(/(\.\/|\.svg)/g, "")] = files[key].default;
      }
    }
  };

  requireAll(files);

  // const requireAll = (requireContext) => requireContext.keys().map(requireContext);
  // const req = require.context("@/icons/svg/", false, /\.svg$/);
  // requireAll(req);
}

const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "dist", "index.html");

if (!fs.existsSync(indexPath)) {
  console.error("dist/index.html not found. Run expo export first.");
  process.exit(1);
}

let html = fs.readFileSync(indexPath, "utf8");

html = html
  .replaceAll('src="/_expo/', 'src="./_expo/')
  .replaceAll('href="/_expo/', 'href="./_expo/')
  .replaceAll('src="/assets/', 'src="./assets/')
  .replaceAll('href="/assets/', 'href="./assets/')
  .replaceAll('href="/favicon.ico"', 'href="./favicon.ico"');

fs.writeFileSync(indexPath, html);

console.log("Fixed GitHub Pages asset paths in dist/index.html");
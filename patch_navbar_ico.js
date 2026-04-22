const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const logoMatch = /<Logo onClick=\{\(\) => scrollToTop\(\)\}>\s*<img src=\{profileData\.image\} alt="Nikhil" style=\{\{ height: "40px", objectFit: "contain" \}\} \/>\s*<\/Logo>/g;
content = content.replace(logoMatch, '<Logo onClick={() => scrollToTop()}>\n          <img src={require("../../assets/images/logo.png")} alt="N" style={{ height: "40px", objectFit: "contain" }} />\n        </Logo>');

fs.writeFileSync('src/components/layout/Navbar.tsx', content);

const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');

const logoMatch = /<Logo onClick=\{\(\) => scrollToTop\(\)\}>\s*N\s*<\/Logo>/g;
content = content.replace(logoMatch, '<Logo onClick={() => scrollToTop()}>\n          <img src={profileData.image} alt="Nikhil" style={{ height: "40px", objectFit: "contain" }} />\n        </Logo>');

fs.writeFileSync('src/components/layout/Navbar.tsx', content);

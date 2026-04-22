const fs = require('fs');

let content = fs.readFileSync('src/components/sections/Hero.tsx', 'utf8');

const buttonsCode = `
          <ButtonGroup>
            <ButtonComponent 
              variant="primary" 
              onClick={() => scrollToSection('projects')}
              icon={<IconWrapper icon={FaArrowRight} />}
            >
              View Projects
            </ButtonComponent>
            <ButtonComponent 
              variant="outline" 
              onClick={() => scrollToSection('contact')}
              icon={<IconWrapper icon={MdEmail} />}
            >
              Contact Me
            </ButtonComponent>
          </ButtonGroup>
`;

content = content.replace(/<ButtonGroup>[\s\S]*?<\/ButtonGroup>/g, buttonsCode);
fs.writeFileSync('src/components/sections/Hero.tsx', content);

export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
  { name: 'Projects', path: '/projects' },
  { name: 'Achievements', path: '/#achievements' },
  { name: 'Contact', path: '/#contact' }
];

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);

  if (element) {
    const navbarHeight = 80;
    const elementPosition = element.offsetTop - navbarHeight;

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  } else {
    window.location.href = `/#${sectionId}`;
  }
};

export const scrollToTop = () => {
  const isHomepage = window.location.pathname === '/' || window.location.pathname === '';

  if (isHomepage) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    window.location.href = '/';
  }
};

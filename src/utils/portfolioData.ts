import { Education, WorkExperience, Testimonial, Project, Skill, Contact } from "../types";

export const profileData = {
  name: "Nikhil Shinde",
  title: "Computer Engineering Student",
  subtitle: "AI-Powered Education Platform | The Intelligent Classroom Ecosystem.",
  bio: "My name is Nikhil Shinde, and I am 18 years old. I'm currently studying at Pimpri Chinchwad College of Engineering (PCCoE), Pune, affiliated with Phule Pune University. I chose Computer Engineering because of its vast scope, dynamic nature, and direct impact on shaping the future.\n\nFrom an early age, I have been interested in understanding how software is built, and how technology connects people. This curiosity naturally led me to choose Computer Engineering, where I can combine problem-solving skills with creativity to design innovative solutions.\n\nMy passion lies in exploring programming, artificial intelligence, and advanced computing systems. I strongly believe that computer engineering is not just about coding, but also about creating tools that simplify life and bring positive change.",
  location: "Pune, India",
  image: "https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/classroom-files/logo/201196389-removebg-preview.png",
  email: "nikhil.shinde@classgrid.in"
};

export const educationData: Education[] = [
  {
    id: "ed1",
    institution: "Pimpri Chinchwad College of Engineering (PCCoE), Pune",
    degree: "Bachelor of Technology (B.Tech)",
    field: "Computer Engineering",
    startDate: "September 2025",
    endDate: "June 2029",
    description: "University: Savitribai Phule Pune University (SPPU)",
    logo: ""
  },
  {
    id: "ed2",
    institution: "Dahanukar Vidyalaya Science & Commerce Junior College",
    degree: "Higher Secondary Certificate (HSC)",
    field: "Education",
    startDate: "June 2023",
    endDate: "February 2025",
    description: "Grade: 79.33%",
    logo: ""
  },
  {
    id: "ed3",
    institution: "Dahanukar English Medium School",
    degree: "Secondary School Certificate (SSC)",
    field: "Education",
    startDate: "June 2021",
    endDate: "March 2023",
    description: "Grade: 83%",
    logo: ""
  }
];

export const experienceData: WorkExperience[] = [];

export const projectData: Project[] = [
  {
    id: "proj1",
    title: "Classgrid",
    category: "Web Development",
    thumbnail: "https://bumxgscngzjadyozdpce.supabase.co/storage/v1/object/public/classroom-files/logo/apple-touch-icon.png",
    description: "Classgrid combines AI-powered tools, real-time collaboration, and structured classroom management, making learning faster, smarter, and more interactive for students and educators. Whether you're a student looking to grow, faculty ready to teach, or an institution ready to go digital, Classgrid has your path.",
    projectUrl: "https://classgrid.in",
    technologies: ["Students", "Faculty", "Institutions", "AI-powered tools", "Real-time collaboration"],
    featured: true
  }
];

export const skillsData: Skill[] = [
  { id: "sk1", name: "HTML5", category: "Development", proficiency: 90 },
  { id: "sk2", name: "CSS3", category: "Development", proficiency: 85 },
  { id: "sk3", name: "JavaScript", category: "Development", proficiency: 85 },
  { id: "sk4", name: "C Programming", category: "Development", proficiency: 80 },
  { id: "sk5", name: "Web Development", category: "Development", proficiency: 90 },
  { id: "sk6", name: "Problem Solving", category: "Other", proficiency: 95 }
];

export const testimonialData: Testimonial[] = [];

export const contactData: Contact = { 
  email: "nikhil.shinde@classgrid.in, nikhilsubsun123@gmail.com",
  phone: "8623947038",
  socialMedia: {
    instagram: "https://www.instagram.com/nikhilnick5046?igsh=bWM2cTBnbGJzY3c0",
    twitter: "https://x.com/Nikhilnick5046",
    linkedin: "https://www.linkedin.com/in/nikhil-shinde-286937367"
  }
};

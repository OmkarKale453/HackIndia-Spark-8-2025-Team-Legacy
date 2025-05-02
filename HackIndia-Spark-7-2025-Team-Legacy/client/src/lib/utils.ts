import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export interface SafetyResource {
  icon: string;
  title: string;
  description: string;
  link: string;
  linkText: string;
}

export interface BlogPost {
  image: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  link: string;
}

// Safety resources data
export const safetyResources: SafetyResource[] = [
  {
    icon: "house-damage",
    title: "Flood Preparedness",
    description: "Learn how to prepare your home and family for potential flooding. Create an emergency plan and evacuation route.",
    link: "#",
    linkText: "Read guide"
  },
  {
    icon: "first-aid",
    title: "Emergency Kit Essentials",
    description: "Prepare a comprehensive emergency kit with essential supplies for all types of disasters. Stay ready for any situation.",
    link: "#",
    linkText: "View checklist"
  },
  {
    icon: "mobile-alt",
    title: "Alert Notification Systems",
    description: "Stay informed with official emergency alert systems. Configure your devices to receive timely warnings.",
    link: "#",
    linkText: "Setup guide"
  }
];

// Blog posts data
export const blogPosts: BlogPost[] = [
  {
    image: "https://images.unsplash.com/photo-1523761287765-4302f2a99711?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Technology",
    title: "How Satellite Monitoring is Revolutionizing Disaster Response",
    excerpt: "Advanced satellite technology now allows us to predict and respond to natural disasters faster than ever before...",
    date: "May 12, 2023",
    link: "#"
  },
  {
    image: "https://images.unsplash.com/photo-1498354136128-58f790194fa7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    category: "Research",
    title: "Understanding Climate Patterns for Disaster Prevention",
    excerpt: "Climate scientists are developing new models to better predict disaster-prone areas and high-risk zones...",
    date: "April 28, 2023",
    link: "#"
  }
];

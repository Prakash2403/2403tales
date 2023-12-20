import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://2403tales.com/", // replace this with your deployed domain
  author: "Prakash Rai",
  desc: "Day to day stories of a software engineer",
  title: "2403tales",
  ogImage: "astropaper-og.jpg",
  lightAndDarkMode: true,
  postPerPage: 10,
};

export const LOCALE = ["en-EN"]; // set to [] to use the environment default

export const LOGO_IMAGE = {
  enable: false,
  svg: true,
  width: 216,
  height: 46,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Github",
    href: "https://github.com/prakash2403/",
    linkTitle: ` ${SITE.title} on Github`,
    active: true,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/2403tales/",
    linkTitle: `${SITE.title} on Instagram`,
    active: true,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/prakash-rai-2403/",
    linkTitle: `${SITE.title} on LinkedIn`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:rishurai24@gmail.com",
    linkTitle: `Send an email to ${SITE.title}`,
    active: true,
  },
];

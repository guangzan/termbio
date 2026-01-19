export interface LinkConfig {
  title?: string;
  label: string;
  url: string;
  emoji?: string;
  displayText: string;
}

export interface PersonalInfo {
  name: string;
  fullName: string;
  title: string;
  description: string;
  links: LinkConfig[];
}

export const borderColors = {
  top: [
    "#03FFFF",
    "#00C8FF",
    "#0096FF",
    "#3164FF",
    "#6332FF",
    "#9601FF",
    "#C801FF",
    "#FF00DD",
    "#FF0096",
  ],
  right: ["#FF0096", "#FF3332", "#FF6400", "#FF9601", "#FFC803", "#FFFF00"],
  bottom: ["#03FFC8", "#03FF64", "#64FF33", "#C7FE04", "#FFFF00"],
  left: ["#03FFC8", "#03FFFF"],
};

export const defaultPersonalInfo: PersonalInfo = {
  name: "Zane",
  fullName: "guangzan wang",
  title: "Developer",
  description: "Building awesome things",
  links: [
    {
      label: "GitHub",
      url: "https://github.com/guangzan",
      displayText: "https://github.com/guangzan",
      emoji: "🐙",
    },
    {
      label: "X",
      url: "https://x.com/_guangzan",
      displayText: "@_guangzan",
      emoji: "🐦",
    },
    {
      label: "Bluesky",
      url: "https://bsky.app/profile/guangzan",
      displayText: "@guangzan",
      emoji: "🦋",
    },
    {
      label: "Web",
      url: "https://www.cnblogs.com/guangzan",
      displayText: "https://www.cnblogs.com/guangzan",
      emoji: "🌐",
    },
  ],
};

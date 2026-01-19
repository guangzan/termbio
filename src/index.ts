#!/usr/bin/env node

import chalk from "chalk";

interface LinkConfig {
  title?: string;
  label: string;
  url: string;
  emoji?: string;
  displayText: string;
}

interface PersonalInfo {
  name: string;
  fullName: string;
  title: string;
  description: string;
  links: LinkConfig[];
}

const personalInfo: PersonalInfo = {
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

const borderColors = {
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

function parseHexColor(hex: string): [number, number, number] {
  const normalizedHex = hex.replace("#", "").toUpperCase();

  let finalHex = normalizedHex;
  if (normalizedHex.length === 3) {
    finalHex = normalizedHex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  if (finalHex.length >= 6) {
    const r = Number.parseInt(finalHex.substring(0, 2), 16);
    const g = Number.parseInt(finalHex.substring(2, 4), 16);
    const b = Number.parseInt(finalHex.substring(4, 6), 16);
    return [r, g, b];
  }

  return [0, 0, 0];
}

function interpolateColor(
  color1: [number, number, number],
  color2: [number, number, number],
  t: number
): [number, number, number] {
  return [
    Math.round(color1[0] + (color2[0] - color1[0]) * t),
    Math.round(color1[1] + (color2[1] - color1[1]) * t),
    Math.round(color1[2] + (color2[2] - color1[2]) * t),
  ];
}

function generateGradientFromColors(
  colorHexes: string[],
  steps: number
): Array<(text: string) => string> {
  const colors = colorHexes.map(parseHexColor);
  const gradient: Array<(text: string) => string> = [];

  if (colors.length === 1) {
    const [r, g, b] = colors[0];
    for (let i = 0; i < steps; i++) {
      gradient.push((text: string) => chalk.rgb(r, g, b)(text));
    }
    return gradient;
  }

  const segmentSteps = Math.floor(steps / (colors.length - 1));
  const remainder = steps % (colors.length - 1);

  for (let i = 0; i < colors.length - 1; i++) {
    const currentSteps = segmentSteps + (i < remainder ? 1 : 0);
    const startColor = colors[i];
    const endColor = colors[i + 1];

    if (currentSteps > 0) {
      for (let j = 0; j < currentSteps; j++) {
        const t = currentSteps > 1 ? j / (currentSteps - 1) : 0;
        const [r, g, b] = interpolateColor(
          startColor,
          endColor,
          Math.min(Math.max(t, 0), 1)
        );
        gradient.push((text: string) => chalk.rgb(r, g, b)(text));
      }
    } else {
      const [r, g, b] = startColor;
      gradient.push((text: string) => chalk.rgb(r, g, b)(text));
    }
  }

  while (gradient.length < steps) {
    const lastColor = colors.at(-1);
    if (lastColor) {
      const [r, g, b] = lastColor;
      gradient.push((text: string) => chalk.rgb(r, g, b)(text));
    }
  }

  return gradient.slice(0, steps);
}

function stripAnsi(str: string): string {
  const escapeChar = String.fromCharCode(0x1b);
  let result = str;
  let changed = true;

  while (changed) {
    const before = result;
    result = result.replace(
      new RegExp(`${escapeChar}\\]8;;[^${escapeChar}]*${escapeChar}\\\\`, "g"),
      ""
    );
    result = result.replace(
      new RegExp(`${escapeChar}\\]8;;${escapeChar}\\\\`, "g"),
      ""
    );
    result = result.replace(
      new RegExp(`${escapeChar}\\[[0-9;]*[a-zA-Z]`, "g"),
      ""
    );
    changed = before !== result;
  }

  return result;
}

function createRainbowBorder(
  content: string[],
  width: number,
  leftPadding = 2,
  rightPadding = 2
): string {
  const height = content.length;
  const borderChar = "━";
  const verticalChar = "┃";

  const topGradient = generateGradientFromColors(borderColors.top, width);
  const rightGradient = generateGradientFromColors(
    borderColors.right,
    height + 2
  );
  const bottomGradient = generateGradientFromColors(borderColors.bottom, width);
  const leftGradient = generateGradientFromColors(
    borderColors.left,
    height + 2
  );

  const topBorderChars: string[] = [];
  for (let i = 0; i < width; i++) {
    const colorFn = topGradient[i];
    topBorderChars.push(colorFn(borderChar));
  }
  const topBorder = topBorderChars.join("");

  const bottomBorderChars: string[] = [];
  for (let i = 0; i < width; i++) {
    const colorFn = bottomGradient[i];
    bottomBorderChars.push(colorFn(borderChar));
  }
  const bottomBorder = bottomBorderChars.join("");

  const topLeftCorner = topGradient[0]("┏");
  const topRightCorner = rightGradient[0]("┓");
  const bottomLeftCorner = bottomGradient[0]("┗");
  const bottomRightCornerIndex = Math.min(height + 1, rightGradient.length - 1);
  const bottomRightCorner = rightGradient[bottomRightCornerIndex]("┛");

  const leftPaddingStr = " ".repeat(leftPadding);
  const lines = content.map((line, lineIndex) => {
    const cleanLine = stripAnsi(line);
    const contentMaxWidth = width - leftPadding - rightPadding;
    const currentContentWidth = cleanLine.length;
    const extraRightPadding = Math.max(
      0,
      contentMaxWidth - currentContentWidth
    );
    const rightPaddingStr = " ".repeat(rightPadding + extraRightPadding);

    const leftBorderColorIndex = lineIndex + 1;
    const leftBorderColor =
      leftGradient[leftBorderColorIndex] ||
      leftGradient.at(-1) ||
      leftGradient[0];
    const leftBorder = leftBorderColor(verticalChar);

    const rightBorderColorIndex = lineIndex + 1;
    const rightBorderColor =
      rightGradient[rightBorderColorIndex] ||
      rightGradient.at(-1) ||
      rightGradient[0];
    const rightBorder = rightBorderColor(verticalChar);

    return `${leftBorder}${leftPaddingStr}${line}${rightPaddingStr}${rightBorder}`;
  });

  return [
    `${topLeftCorner}${topBorder}${topRightCorner}`,
    ...lines,
    `${bottomLeftCorner}${bottomBorder}${bottomRightCorner}`,
  ].join("\n");
}

function formatLink(
  emoji: string,
  label: string,
  url: string,
  displayText: string,
  labelWidth?: number
): string {
  const hyperlinkStart = `\x1b]8;;${url}\x1b\\`;
  const hyperlinkEnd = "\x1b]8;;\x1b\\";
  const clickableText = `${hyperlinkStart}${chalk.underline(chalk.cyan(displayText))}${hyperlinkEnd}`;
  const labelPart = `${emoji} ${chalk.yellow(label)}`;
  if (labelWidth !== undefined) {
    const labelPartLength = stripAnsi(labelPart).length;
    const padding = " ".repeat(Math.max(0, labelWidth - labelPartLength));
    const spacing = "  ";
    return `${labelPart}${padding}${spacing}${clickableText}`;
  }
  return `${labelPart} ${clickableText}`;
}

function calculateMaxLabelWidth(links: LinkConfig[]): number {
  let maxLabelWidth = 0;
  for (const link of links) {
    const labelPart = `${link.emoji || ""} ${link.label}`;
    const labelPartLength = stripAnsi(labelPart).length;
    if (labelPartLength > maxLabelWidth) {
      maxLabelWidth = labelPartLength;
    }
  }
  return maxLabelWidth;
}

function getFinalUrl(link: LinkConfig): string {
  if (
    link.displayText.startsWith("@") &&
    (link.label.toLowerCase() === "x" || link.label.toLowerCase() === "bluesky")
  ) {
    if (link.label.toLowerCase() === "x") {
      return `https://x.com/${link.displayText.slice(1)}`;
    }
    return `https://bsky.app/profile/${link.displayText.slice(1)}`;
  }
  return link.url;
}

function buildContent(links: LinkConfig[], maxLabelWidth: number): string[] {
  const content: string[] = [];

  content.push("");
  content.push(chalk.green("👋"));
  content.push("");

  content.push(chalk.green(`I'm ${chalk.bold(personalInfo.name)}`));
  content.push(chalk.green(`${personalInfo.title}`));
  content.push("");

  let currentSection: string | null = null;
  for (const link of links) {
    if (link.title && link.title !== currentSection) {
      if (currentSection !== null) {
        content.push("");
      }
      content.push(chalk.blue(`  ${link.title}`));
      currentSection = link.title;
    }

    const finalUrl = getFinalUrl(link);
    content.push(
      formatLink(
        link.emoji || "",
        link.label,
        finalUrl,
        link.displayText,
        maxLabelWidth
      )
    );
  }
  content.push("");

  return content;
}

function main() {
  try {
    const maxLabelWidth = calculateMaxLabelWidth(personalInfo.links);
    const content = buildContent(personalInfo.links, maxLabelWidth);

    const leftPadding = 3;
    const rightPadding = 5;
    const textMaxWidth = Math.max(
      ...content.map((line) => stripAnsi(line).length)
    );
    const cardWidth = textMaxWidth + leftPadding + rightPadding;

    const card = createRainbowBorder(
      content,
      cardWidth,
      leftPadding,
      rightPadding
    );

    console.log(`\n${card}\n`);
  } catch (error) {
    console.error(
      chalk.red("Error:"),
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

main();

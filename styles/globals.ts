import { MantineThemeColorsOverride } from "@mantine/core";

// Theme overdrive
const theme: MantineThemeColorsOverride = {
  // Colorscheme
  colorScheme: "light",
  white: "#fffffc",
  black: "#1b1b22",
  colors: {
    "pastel-pink": "#ffc6ff",
    "pastel-purple": "#bdb2ff",
    "pastel-darker-blue": "#a0c4ff",
    "pastel-blue": "#9bf6ff",
    "pastel-green": "#caffbf",
    "pastel-yellow": "#fdffb6",
    "pastel-orange": "#ffd6a5",
    "pastel-red": "#ffadad",
    "pastel-grey": "#b3b3bc",
  },
  // Typography
  headings: {
    fontFamily: '"Oswald", sans-serif',
    sizes: {
      h1: {
        fontSize: "2.8rem",
        lineHeight: "3.6rem",
      },
      h3: {
        fontSize: "1.8rem",
        lineHeight: "2.4rem",
      },
    },
  },
  fontFamily: '"Rubik", sans-serif',
  fontSizes: {
    xs: 12,
    sm: 15,
    md: 18,
    lg: 22,
    xl: 26,
  },
  radius: {
    xs: 5,
    sm: 6,
    md: 8,
    lg: 10,
    xl: 14,
  },
  spacing: {
    xs: "0.4rem",
    sm: "0.8rem",
    md: "1rem",
    lg: "1.2rem",
    xl: "2rem",
  },
  breakpoints: {
    xl: 1600,
  },
  // Others
  other: {
    // Layouts
    safeMargin: 1600,
    guter: 15,
    cardWidth: {
      sm: 180,
      md: 240,
      xl: 320,
    },
    // Objects
    dots: {
      content: '""',
      position: "absolute",
      width: "40vw",
      height: "40vw",
      borderRadius: "100%",
      filter: "blur(150px)",
      zIndex: -1,
    },
    // Gradients
    yellowRG: {
      background: `radial-gradient(50% 50% at 50% 50%, rgba(253, 255, 182, 0.3) 0%, rgba(255, 255, 255, 0) 100%)`,
    },
    pinkRG: {
      background:
        "radial-gradient(50% 50% at 50% 50%, rgba(255, 198, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    },
    purpleRG: {
      background:
        "radial-gradient(50% 50% at 50% 50%, rgba(189, 178, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    },
    greenRG: {
      background:
        "radial-gradient(50% 50% at 50% 50%, rgba(202, 255, 191, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    },
    blueRG: {
      background:
        "radial-gradient(50% 50% at 50% 50%, rgba(155, 246, 255, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    },
    orangeRG: {
      background:
        "radial-gradient(50% 50% at 50% 50%, rgba(255, 214, 165, 0.3) 0%, rgba(255, 255, 255, 0) 100%)",
    },
    rainbowLG:
      "linear-gradient(90deg, rgba(255,173,173,1) 0%, rgba(255,214,165,1) 12.5%, rgba(253,255,182,1) 25%, rgba(202,255,191,1) 37.5%, rgba(155,246,255,1) 50%, rgba(160,196,255,1) 62.5%, rgba(189,178,255,1) 75%, rgba(255,198,255,1) 87.5%, rgba(255,255,252,1) 100%)",
  },
};

export default theme;

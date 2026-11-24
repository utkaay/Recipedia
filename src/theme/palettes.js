import { colors as herbColors } from "./tokens";

export const palettes = {
  herb: {
    name: "Herb & Terracotta",
    colors: herbColors,
  },
  sage: {
    name: "Garden Sage",
    colors: {
      background: "#FFF9EC",
      surface: "#FFFEFA",
      surfaceGreen: "#E4EBDD",
      green: "#45634B",
      greenDark: "#304A36",
      greenSoft: "#CEDCCB",
      terracotta: "#B96943",
      terracottaDark: "#8F4B32",
      ink: "#252820",
      muted: "#68705F",
      border: "#CFCDBF",
      error: "#B42318",
      white: "#FFFFFF",
    },
  },
  berry: {
    name: "Berry & Rose",
    colors: {
      background: "#FFF9EC",
      surface: "#FFFEFA",
      surfaceGreen: "#F1E3E5",
      green: "#664653",
      greenDark: "#4D3440",
      greenSoft: "#E6D3D9",
      terracotta: "#C95545",
      terracottaDark: "#973A34",
      ink: "#292326",
      muted: "#71666A",
      border: "#D4C7CA",
      error: "#A42B2B",
      white: "#FFFFFF",
    },
  },
};

export const defaultPalette = "herb";

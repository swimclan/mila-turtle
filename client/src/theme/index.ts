export const BASE_COLORS = {
  GREEN: "#00FF00",
  BLUE: "#0000FF",
  RED: "#FF0000",
  ORANGE: "#FFA233",
  PURPLE: "#A233FF",
  PINK: "#FF33F0",
  WHITE: "#FFFFFF",
  BLACK: "#000000",
  GRAY: "#1E1E1E",
};

export const UI_COLORS = {
  FOREGROUND: {
    DEFAULT: BASE_COLORS.GREEN,
    DARK: BASE_COLORS.BLACK,
    LIGHT: BASE_COLORS.WHITE,
  },
  BACKGROUND: {
    DEFAULT: BASE_COLORS.GRAY,
    DARK: BASE_COLORS.BLACK,
  },
};

export type TypeUIColors = keyof typeof UI_COLORS;
export type TypeBaseColors = keyof typeof BASE_COLORS;

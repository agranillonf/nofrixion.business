import type { Preview } from "@storybook/react";

// TODO: Find a way to include built
// css automatically without having to
// import it when using the library
import "@nofrixion/ui/styles.css";

const customViewports = {
  mobileS: {
    name: "Mobile S",
    styles: {
      width: "320px",
      height: "667px",
    },
  },
  mobileM: {
    name: "Mobile M (iPhone SE)",
    styles: {
      width: "375px",
      height: "667px",
    },
  },
  mobileL: {
    name: "Mobile L",
    styles: {
      width: "425px",
      height: "869px",
    },
  },
  tablet: {
    name: "Tablet",
    styles: {
      width: "768px",
      height: "1024px",
    },
  },
  laptop: {
    name: "Laptop",
    styles: {
      width: "1024px",
      height: "640px",
    },
  },
  laptopL: {
    name: "Laptop L",
    styles: {
      width: "1440px",
      height: "800px",
    },
  },
  "4K": {
    name: "4K",
    styles: {
      width: "2560px",
      height: "1067px",
    },
  },
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    viewport: {
      viewports: customViewports,
    },
  },
};

export default preview;

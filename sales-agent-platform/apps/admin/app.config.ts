export default defineAppConfig({
  ui: {
    primary: "blue",
    gray: "slate",
    notifications: {
      position: "top-0 right-0",
    },
    modal: {
      slots: {
        container: "transition-all duration-300 ease-out",
        overlay: "bg-black/50 backdrop-blur-sm",
        base: "relative overflow-hidden",
        header: "p-2",
        content: "p-2",
        footer: "p-2 justify-end",
      },
    },
    input: {
      base: "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-input",
      rounded: "rounded-lg",
      color: {
        white: {
          outline:
            "shadow-ios bg-card dark:bg-dark-card text-text-primary dark:text-dark-text-primary ring-1 ring-inset ring-border dark:ring-dark-border focus:ring-2 focus:ring-primary dark:focus:ring-primary-400 transition-all duration-300",
        },
      },
    },
    textarea: {
      base: "relative block w-full disabled:cursor-not-allowed disabled:opacity-75 focus:outline-none border-0 form-textarea",
      rounded: "rounded-ios",
      color: {
        white: {
          outline:
            "shadow-ios bg-card dark:bg-dark-card text-text-primary dark:text-dark-text-primary ring-1 ring-inset ring-border dark:ring-dark-border focus:ring-2 focus:ring-primary dark:focus:ring-primary-400 transition-all duration-300",
        },
      },
    },
  },
});

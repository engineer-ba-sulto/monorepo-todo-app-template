module.exports = (api) => {
  api.cache(true);
  return {
    presets: [["babel-preset-expo"], "nativewind/babel"],
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@/components": "./src/components/ui",
            "@": "./src",
            "tailwind.config": "./tailwind.config.js",
          },
        },
      ],
      "react-native-worklets/plugin",
    ],
  };
};

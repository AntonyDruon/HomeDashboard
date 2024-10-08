module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin", // Garde ce plugin pour react-native-reanimated
      [
        "module:react-native-dotenv", // Ajoute le plugin pour les variables d'environnement
        {
          moduleName: "@env", // Nom du module que tu importeras dans ton code
          path: ".env", // Chemin vers le fichier des variables d'environnement
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
  };
};

module.exports = {
  apps: [
    {
      name: "audaces-perps-rest-server",
      script: "dist/index.js",
      watch: ".",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};

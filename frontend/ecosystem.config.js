const argEnvIndex = process.argv.indexOf("--env");
let argEnv = (argEnvIndex !== -1 && process.argv[argEnvIndex + 1]) || "";

const RUN_ENV_MAP = {
  development: {
    alias: "dev",
    instances: 1,
    max_memory_restart: "300M",
  },
  staging: {
    alias: "staging",
    instances: 1,
    max_memory_restart: "300M",
  },
  production: {
    alias: "prod",
    instances: 1,
    max_memory_restart: "600M",
  },
};
console.log("argEnv: ", argEnv);
if (!(argEnv in RUN_ENV_MAP)) {
  argEnv = "production";
}

module.exports = {
  apps: [
    {
      name: `motorbike-system-next-${RUN_ENV_MAP[argEnv].alias}`,
      script: "npm",
      args: `run pm2:${RUN_ENV_MAP[argEnv].alias}`,
      time: true,
      exec_mode: "fork", // need explicitly declare mode otherwise it will fallback to clu>    instances: 1,
      autorestart: true,
      instances: RUN_ENV_MAP[argEnv].instances,
      watch: false,
      max_memory_restart: RUN_ENV_MAP[argEnv].max_memory_restart,
      env: {
        NODE_ENV: "development",
      },
      env_development: {
        NODE_ENV: "development",
      },
      env_staging: {
        NODE_ENV: "staging",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};

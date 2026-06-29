module.exports = {
  apps: [
    {
      name: "conectar-backend",
      script: "node",
      args: "apps/backend/dist/main.js",
      env: {
        NODE_ENV: "production",
        PORT: 8001
      }
    },
    {
      name: "conectar-frontend",
      script: "pnpm",
      args: "start --port 8000",
      cwd: "./apps/frontend",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "conectar-landingpage",
      script: "pnpm",
      args: "start --port 8005",
      cwd: "./apps/landingpage",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "conectar-ai-service",
      script: "node",
      args: "index.js",
      cwd: "./apps/ai-service",
      env: {
        NODE_ENV: "production",
        PORT: 8003
      }
    },
    {
      name: "conectar-whatsapp-service",
      script: "node",
      args: "index.js",
      cwd: "./apps/whatsapp-service",
      env: {
        NODE_ENV: "production",
        PORT: 8002
      }
    }
  ]
};

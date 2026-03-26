export const CONFIG = {
  discordToken: process.env.DISCORD_TOKEN,
  mongoUri: process.env.MONGO_URI,

  matrix: {
    user: process.env.MATRIX_USER,
    password: process.env.MATRIX_PASSWORD,
    homeserver: process.env.MATRIX_HOMESERVER
  }
};

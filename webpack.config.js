const path = require("path");

module.exports = {
  entry: {
    chat: "./frontend/chat/index.js",
    games: "./frontend/games/index.js",
    playerroom: "./frontend/playerroom/index.js",
  },
  output: {
    path: path.join(__dirname, "backend", "static", "js"),
    publicPath: "/backend/static/js",
    filename: "[name].js",
  },

  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
};

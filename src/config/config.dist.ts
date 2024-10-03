const config = {
  env: "development",
  isDevModeEnabled: false,
  server: {
    publicHostName: "http://localhost:8081/",
    frontendPublicHostName: "http://localhost:8080/",
    hostName: "localhost",
    port: 8081,
    security: {
      backendTokenSecretKey:
        "X5tdt2VxFLLJ74HZx3ad93Fgn3nLhTepzUZh4Wu7wdPej742fUXrTbvCqRNH7BzKk4g6PnPV2Nzc53SFkWpwtZWHDvBVSu3HYmc9",
      hmacSecretPacketKey:
        "WxKmQZWmFF9HREjVQAhm5zhKhXUWrDEQy36tPJJq5VgkNVf9msNfME86z6P8UzvmuGCQAMvxX7kke7XHRWx7hhs76dDkAttg5jDh",
      jwtTokenSecretKey:
        "7yuQ73wGJaGStLJehUwsJsCazfdDd74wEnLu5HAEmRHNv5r88Zq5LShHch7GhAjhktwN2yUYNSgZttbp3pH8kJ7aRnTETTzVSw8d"
    }
  },
  database: {
    host: "127.0.0.1",
    user: "root",
    port: 3306,
    database: "fcgrimisuat",
    password: "SQLadmin"
  },
  sessionDurationInMinutes: 4 * 60,
  apiCurrentVersion: 1
};

config.isDevModeEnabled = config.env === "development";

export default config;

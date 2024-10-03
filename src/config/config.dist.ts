const config = {
  env: "production",
  isDevModeEnabled: false,
  server: {
    publicHostName: "https://api.myshk.ch/",
    hostName: "localhost",
    port: 5001,
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
    user: "myshk_production",
    port: 3306,
    database: "myshk",
    password: "sGCksw=Eb&-j93*e!Z^B"
  },
  smtp: {
    host: "mail.myshk.ch",
    privateKey:
      "MIIEpAIBAAKCAQEAv5zV53s2WlCwPt4eHvo8lTKM1mt5UYwoVMlW7DlJ+I8pNDM9KMYbgt+cJTrN/xeSBq0gH2dQBg5uG/aC6XyVu9Iz1j47X9I6A5PGFGLl6G8jSXNOtgTNBu7mLzeHGUEWHD4W25b81+LmKxbrHD5G+TzGsUINaNI5r5XVWRfCeNf658pdg7ASd/U3C1l/ACe9PtRqrqSb56LVD74pyJLr9kCNi/uOq4ovA0K5EcN9WD7TY3hs0QZ0BrutjRpTCqAWCex+eDYQ0Kj+9MaaeUrUW7FNxlMuP+hSljAryih4Rc4rVOdMLoTQO2UYOrKKl8p54wVmE/GpqMlgtpaknB8nBwIDAQABAoIBAGJfNHopCZiIgFNmWXRx6BR45VFXz+sL19DfpR6VsuJHLVI9VBLQ0mL4RgPfEs753OBMlYdJ1Q2m7uSwRDl22rCYlEBTpsvk9B/OCA2DUKFqHWWiKzDLei8rC0YGbfeLMLzDK50FAT4coSpSE9ZmKq3eg+uRC61a8H6yn9ujlRXQePgbsM/ZFdhu7iLBFkgyIhqD+0WImjXyVeKQxHnMpvTL0Fd9BtsBtri+Fu5RpfRSjyUbpjlFLzDFQTlAokr6PM8T9uhfbBFK0KF2NkyBLC3ZvnvdI7vjximkoYr2/Xjh9pL52xBEBE5eLR6Ij4AB550zfogcWOwbj3QgWQjGl0ECgYEA3daiJosybIRivHWBxK7EvyLnSLy+CmiuzxJd8sx1mBtaGb6TMNQat7TrrLjAKIMQ2HUWnsDtDkM4cXPKBIEGUIdl48ffPkDJCZ6ZLVdg5owCIfW/ggefgEfBxrFsAgQhutrcZbvkBbdw6yUJwRXkCQPDCIDbjncZ6wfanANQdBECgYEA3R6icq/MedsBcFTPXZrGwTRlH1DnKexM4NZqKLEGJVr2e5GIVd4Q2OApL5Z4m9Yx/IQsu3H3RuNjsH3qhaB/pSXgkZ3ksI+rmKlRcod2bLsM3H16bivXKdNFmocKxELdZb3NQTfCbp2PkEAG0Hj8xHuINvyQ01mU1TQlUB/soZcCgYB5xsDsd60OdP3ehoLd/TJz2i0seK+59w0/Ds4T4rkK7rjfOQaD32trPR3CiwixNIGi0WPBchavpabuYKmdH1bgDfOYvreF7PpvFWjwwu6moGTrT4P5VUXxnXJ6KBsqYCpD8LDcB/B8Ut7htktMez/a0v3VRSdBZZAMvRr8WbVogQKBgQDCD3nIp4sQQun/WR9o6kaXF9HL6ygFvhI2nVcsATkAndWG21HI8ozcmdbroeaV9iWGlcXgeIPpnfVG1yt1PUfpe9WcVvN3FZAm+iq2FjcT9BG0jRdfC3DZj0cd+Hi1iG1gNnSmUTZ9+CAgHGEeo6BLHJOOlpjQNGWPvCUnLe1yXwKBgQDV75Deq6GQp0fQa+afgOM8nzQ/Jro0O4zhg0DtHZV87NLy+jK7OZQs/EjOcUpylqoVDEB4Z8GNaTur9H4n6w9/pIyKP84qV/ksPP1H/vjbnLWbwkOTjEdQR0q+3OH+tBHDHJ09MG3f50KbGo0KmLvhesxsQfM25BFoJOavevXITQ=="
  },
  sessionDurationInMinutes: 4 * 60,
  apiCurrentVersion: 1
};

config.isDevModeEnabled = config.env === "development";

export default config;

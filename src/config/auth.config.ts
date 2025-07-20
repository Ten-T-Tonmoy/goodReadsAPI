export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || "dude-u-forgot-to-make-one",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    httpOnly: true,
    maxAge: 7 * 24 * 3600, //7 days man
  },
};

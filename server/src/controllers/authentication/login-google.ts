import type { Request, Response } from "express";
import querystring from "querystring";
import {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET,
  GOOGLE_AUTH_SCOPE,
  JWT_SECRET,
} from "../../utils/env";
import axios from "axios";
import jwt from "jsonwebtoken";

export const RedirectGoogleAuthScreen = async (req: Request, res: Response) => {
  const origin = `${req.protocol}://${req.get("host")}`;

  const redirectUri = `${origin}/api/auth/google/callback`;

  const params = querystring.stringify({
    client_id: GOOGLE_AUTH_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_AUTH_SCOPE,
    access_type: "offline",
    prompt: "consent",
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

export const LoginWithGoogle = async (req: Request, res: Response) => {
  const code: string = req.query.code as string;

  if (!code) {
    res.status(400).send("No string Provided");
    return;
  }

  try {
    const origin = `${req.protocol}://${req.get("host")}`;

    const redirectUri = `${origin}/api/auth/google/callback`;

    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      querystring.stringify({
        code,
        client_id: GOOGLE_AUTH_CLIENT_ID,
        client_secret: GOOGLE_AUTH_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { id_token, access_token } = tokenRes.data;

    const decoded: any = jwt.decode(id_token);

    const verifyRes = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`
    );

    const payload = verifyRes.data;

    console.log("Verified user info:", payload);

    const myToken = jwt.sign(
      {
        email: payload.email,
        name: payload.name,
        sub: payload.sub,
        picture: payload.picture,
      },
      JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("token", myToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Authentication failed");
  }
};

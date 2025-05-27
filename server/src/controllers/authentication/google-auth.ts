import type { Request, Response } from "express";
import querystring from "querystring";
import { Env, GOOGLE_AUTH_SCOPE } from "../../utils/env";
import axios from "axios";
import jwt from "jsonwebtoken";
import { googleJwtPayloadSchema } from "../../utils/types/google-auth";
import { users } from "../../db/schema";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";
import { JwtService } from "../../services/jwt";

export const RedirectGoogleAuthScreen = async (req: Request, res: Response) => {
  const origin = `${req.protocol}://${req.get("host")}`;

  const redirectUri = `${origin}/api/auth/google/callback`;

  const params = querystring.stringify({
    client_id: Env.GOOGLE_AUTH_CLIENT_ID,
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
        client_id: Env.GOOGLE_AUTH_CLIENT_ID,
        client_secret: Env.GOOGLE_AUTH_CLIENT_SECRET,
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

    const payload = googleJwtPayloadSchema.parse(verifyRes.data);

    let user = (
      await db
        .selectDistinct()
        .from(users)
        .where(eq(users.email, payload.email))
        .limit(1)
    )[0];

    if (!user) {
      user = (
        await db
          .insert(users)
          .values({
            name: payload.name,
            pictureurl: payload.picture,
            email: payload.email,
            emailVerified: true,
            password: null,
            accountSource: "google",
          })
          .returning()
      )[0];
    } else if (payload.email_verified) {
      (
        await db
          .update(users)
          .set({
            emailVerified: true,
            name: users.name,
            pictureurl: payload.picture,
          })
          .where(eq(users.email, payload.email))
      )[0];
    }

    const myToken = JwtService.sign({
      email: user.email,
      name: user.name,
      id: user.id,
      sub: payload.sub,
      picture: user.pictureurl,
      type: "user",
    });

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

import type { Request, Response } from "express";
import { JwtPayload, JwtService } from "../../services/jwt";
import { z } from "zod";

const zTokenParser = z.object({
  token: z.string().nonempty(),
});

export const verifyAuthenticationUsingCookieToken = (
  req: Request,
  res: Response
): any => {
  console.log(req.cookies.token);

  const parsed = zTokenParser.safeParse(req.cookies);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }
  try {
    const token = parsed.data.token;

    const decodedToken: JwtPayload = JwtService.verify(token);

    if (!decodedToken.id) {
      return res.status(401).json({
        message: "Action authentication unsuccessful ",
        data: null,
      });
    }

    return res.status(200).json({
      message: "Action authentication successful",
      data: decodedToken,
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

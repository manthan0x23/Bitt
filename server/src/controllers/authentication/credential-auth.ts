import { z } from "zod";
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../../db/db";
import { users } from "../../db/schema";
import { HashService } from "../../services/hash";
import { JwtService } from "../../services/jwt";

const credentialLoginBodyObject = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

const credentialRegisterBodyObject = z.object({
  email: z.string().email(),
  password: z.string().min(5),
  confirmPassword: z.string().min(5),
});

export const credentialLoginUser = async (req: Request, res: Response) => {
  const parsed = credentialLoginBodyObject.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { email, password } = parsed.data;

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser || !existingUser.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await HashService.comparePassword(
      password,
      existingUser.password
    );

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = JwtService;

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const credentialRegisterUser = async (req: Request, res: Response) => {
  const parsed = credentialRegisterBodyObject.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
  }

  const { email, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ error: { confirmPassword: "Passwords do not match" } });
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      return res.status(400).json({ error: { email: "User already exists" } });
    }

    const hashedPassword = await HashService.hashPassword(password);

    await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

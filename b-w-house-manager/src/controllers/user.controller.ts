import { AppDataSource } from "../config/data-source.ts";
import { User, UserRole } from "../entities/User.ts";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import type { Context } from "hono";

const userRepository = AppDataSource.getRepository(User);

export const register = async (c: Context) => {
    try {
        const { email, password, role } = await c.req.json();

        if (!email || !password) {
            return c.json({ error: "Email and password are required" }, 400);
        }

        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return c.json({ error: "User already exists" }, 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            email,
            passwordHash: hashedPassword,
            role: (role?.toLowerCase() as UserRole) || UserRole.USER,
        });

        await userRepository.save(user);

        const { passwordHash: _, ...userWithoutPassword } = user;
        return c.json(userWithoutPassword, 201);
    } catch (error) {
        return c.json({ error: "Registration failed: " + (error as Error).message }, 500);
    }
};

export const login = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        const secret = process.env.JWT_SECRET || "supersecretkey123";
        const token = await sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
            },
            secret
        );

        return c.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return c.json({ error: "Login failed" }, 500);
    }
};

export const getUsers = async (c: Context) => {
    try {
        const users = await userRepository.find({
            select: ["id", "email", "role", "isActive", "createdAt", "updatedAt"],
        });
        return c.json(users);
    } catch (error) {
        return c.json({ error: "Failed to fetch users" }, 500);
    }
};

export const getUserById = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const user = await userRepository.findOne({
            where: { id },
            select: ["id", "email", "role", "isActive", "createdAt", "updatedAt"],
        });

        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        return c.json(user);
    } catch (error) {
        return c.json({ error: "Failed to fetch user" }, 500);
    }
};

export const updateUser = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const body = await c.req.json();

        const user = await userRepository.findOneBy({ id });
        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        if (body.email) user.email = body.email;
        if (body.role) user.role = body.role.toLowerCase() as UserRole;
        if (body.isActive !== undefined) user.isActive = body.isActive;
        if (body.password) {
            user.passwordHash = await bcrypt.hash(body.password, 10);
        }

        await userRepository.save(user);

        const { passwordHash: _, ...userWithoutPassword } = user;
        return c.json(userWithoutPassword);
    } catch (error) {
        return c.json({ error: "Update failed" }, 500);
    }
};

export const deleteUser = async (c: Context) => {
    try {
        const id = c.req.param("id");
        const result = await userRepository.delete(id);

        if (result.affected === 0) {
            return c.json({ error: "User not found" }, 404);
        }

        return c.json({ message: "User deleted successfully" });
    } catch (error) {
        return c.json({ error: "Deletion failed" }, 500);
    }
};

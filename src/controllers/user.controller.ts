import { AppDataSource } from "../config/data-source";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcryptjs";
import { sign } from "hono/jwt";
import type { Context } from "hono";

const userRepository = AppDataSource.getRepository(User);

export const register = async (c: Context) => {
    try {
        const { email, password, firstName, lastName, role } = await c.req.json(); // Added role

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
            password: hashedPassword,
            firstName,
            lastName,
            role: role || UserRole.USER, // Added role with default
        });

        await userRepository.save(user);

        // Don't return password
        const { password: _, ...userWithoutPassword } = user;
        return c.json(userWithoutPassword, 201);
    } catch (error) {
        return c.json({ error: "Registration failed" }, 500);
    }
};

export const login = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        const user = await userRepository.findOneBy({ email });
        if (!user) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        const secret = process.env.JWT_SECRET || "supersecretkey123";
        const token = await sign(
            {
                id: user.id,
                email: user.email,
                role: user.role, // Added role to JWT payload
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
            },
            secret
        );

        return c.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role } }); // Added role to returned user object
    } catch (error) {
        return c.json({ error: "Login failed" }, 500);
    }
};

export const getUsers = async (c: Context) => {
    try {
        const users = await userRepository.find({
            select: ["id", "email", "firstName", "lastName", "role", "createdAt", "updatedAt"], // Added role
        });
        return c.json(users);
    } catch (error) {
        return c.json({ error: "Failed to fetch users" }, 500);
    }
};

export const getUserById = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        const user = await userRepository.findOne({
            where: { id },
            select: ["id", "email", "firstName", "lastName", "role", "createdAt", "updatedAt"], // Added role
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
        const id = parseInt(c.req.param("id"));
        const body = await c.req.json();

        const user = await userRepository.findOneBy({ id });
        if (!user) {
            return c.json({ error: "User not found" }, 404);
        }

        // Update fields
        if (body.firstName) user.firstName = body.firstName;
        if (body.lastName) user.lastName = body.lastName;
        if (body.email) user.email = body.email;
        if (body.role) user.role = body.role; // Added role update
        if (body.password) {
            user.password = await bcrypt.hash(body.password, 10);
        }

        await userRepository.save(user);

        const { password: _, ...userWithoutPassword } = user;
        return c.json(userWithoutPassword);
    } catch (error) {
        return c.json({ error: "Update failed" }, 500);
    }
};

export const deleteUser = async (c: Context) => {
    try {
        const id = parseInt(c.req.param("id"));
        const result = await userRepository.delete(id);

        if (result.affected === 0) {
            return c.json({ error: "User not found" }, 404);
        }

        return c.json({ message: "User deleted successfully" });
    } catch (error) {
        return c.json({ error: "Deletion failed" }, 500);
    }
};

import express from "express";
import morgan from "morgan";
import cors from "cors";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import sql from "./db.js";

const app = express();
const port = process.env.PORT || 3000;
const jwtSecret = process.env.JWT_SECRET || "munshi-development-secret";

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const userTable = '"MUNSHI_USERS"';
const profileTable = '"MUNSHI_USER_PROFILES"';
const transactionTable = '"MUNSHI_TRANSACTIONS"';
const chatTable = '"MUNSHI_CHAT_HISTORY"';
const stocksTable = '"MUNSHI_STOCKS"';

const normalizeNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const hashPassword = (password, salt = crypto.randomBytes(16).toString("hex")) => {
  const derivedKey = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512");
  return {
    salt,
    hash: derivedKey.toString("hex"),
  };
};

const verifyPassword = (password, salt, expectedHash) => {
  const { hash } = hashPassword(password, salt);
  const hashBuffer = Buffer.from(hash, "hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (hashBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(hashBuffer, expectedBuffer);
};

const createToken = (user) => jwt.sign({ userId: user.id, email: user.email }, jwtSecret, { expiresIn: "30d" });

const sanitizeUser = (row) => ({
  id: row.id,
  email: row.email,
  name: row.name,
  createdAt: row.created_at,
});

const sanitizeProfile = (row) => ({
  id: row.id,
  userId: row.user_id,
  dob: row.dob,
  monthlyIncome: row.monthly_income,
  monthlyBudget: row.monthly_budget,
  type: row.type,
  moneyInPocket: row.money_in_pocket,
  additionalInfo: row.additional_info,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const sanitizeTransaction = (row) => ({
  id: row.id,
  userId: row.user_id,
  title: row.title,
  amount: row.amount,
  category: row.category,
  paymentMethod: row.payment_method,
  type: row.type,
  description: row.description,
  date: row.date,
  createdAt: row.created_at,
});

const sanitizeChatMessage = (row) => ({
  id: row.id,
  userId: row.user_id,
  content: row.content,
  sender: row.sender,
  date: row.date,
});

const sanitizeStock = (row) => ({
  id: row.id,
  userId: row.user_id,
  code: row.code,
  amount: row.amount,
  createdAt: row.created_at,
});

const authMiddleware = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";
  const token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "Missing auth token." });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const [user] = await sql`
      SELECT id, email, name, created_at
      FROM ${sql.unsafe(userTable)}
      WHERE id = ${payload.userId}
      LIMIT 1
    `;

    if (!user) {
      return res.status(401).json({ error: "Invalid auth token." });
    }

    req.authUser = sanitizeUser(user);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired auth token." });
  }
};

const ensureTables = async () => {
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "MUNSHI_USERS" (
      id BIGSERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      password_salt TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "MUNSHI_USER_PROFILES" (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL UNIQUE REFERENCES "MUNSHI_USERS"(id) ON DELETE CASCADE,
      dob DATE,
      monthly_income NUMERIC,
      monthly_budget NUMERIC,
      type TEXT,
      money_in_pocket NUMERIC,
      additional_info TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "MUNSHI_TRANSACTIONS" (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES "MUNSHI_USERS"(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      category TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      type TEXT NOT NULL,
      description TEXT,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "MUNSHI_CHAT_HISTORY" (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES "MUNSHI_USERS"(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      sender TEXT NOT NULL,
      date TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS "MUNSHI_STOCKS" (
      id BIGSERIAL PRIMARY KEY,
      user_id BIGINT NOT NULL REFERENCES "MUNSHI_USERS"(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
};

app.get("/", (req, res) => {
  res.send("Munshi backend running");
});

app.post("/auth/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const displayName = String(name || normalizedEmail.split("@")[0]).trim();

    const existingUser = await sql`
      SELECT id FROM ${sql.unsafe(userTable)} WHERE email = ${normalizedEmail} LIMIT 1
    `;

    if (existingUser.length) {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    const { salt, hash } = hashPassword(String(password));
    const [user] = await sql`
      INSERT INTO ${sql.unsafe(userTable)} (email, password_hash, password_salt, name)
      VALUES (${normalizedEmail}, ${hash}, ${salt}, ${displayName})
      RETURNING id, email, name, created_at
    `;

    return res.status(201).json({
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Failed to create account." });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const [user] = await sql`
      SELECT id, email, name, password_hash, password_salt, created_at
      FROM ${sql.unsafe(userTable)}
      WHERE email = ${normalizedEmail}
      LIMIT 1
    `;

    if (!user || !verifyPassword(String(password), user.password_salt, user.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    return res.status(200).json({
      token: createToken(user),
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Failed to log in." });
  }
});

app.get("/auth/me", authMiddleware, async (req, res) => {
  return res.status(200).json({ user: req.authUser });
});

app.post("/auth/logout", authMiddleware, async (req, res) => {
  return res.status(200).json({ success: true });
});

app.get("/profile", authMiddleware, async (req, res) => {
  const [profile] = await sql`
    SELECT *
    FROM ${sql.unsafe(profileTable)}
    WHERE user_id = ${req.authUser.id}
    LIMIT 1
  `;

  if (!profile) {
    return res.status(404).json({ error: "Profile not found." });
  }

  return res.status(200).json({ profile: sanitizeProfile(profile) });
});

app.post("/profile", authMiddleware, async (req, res) => {
  try {
    const { dob, monthlyIncome, monthlyBudget, type, moneyInPocket, additionalInfo } = req.body;

    const [profile] = await sql`
      INSERT INTO ${sql.unsafe(profileTable)} (
        user_id,
        dob,
        monthly_income,
        monthly_budget,
        type,
        money_in_pocket,
        additional_info,
        updated_at
      )
      VALUES (
        ${req.authUser.id},
        ${dob || null},
        ${normalizeNumber(monthlyIncome)},
        ${normalizeNumber(monthlyBudget)},
        ${type || null},
        ${normalizeNumber(moneyInPocket)},
        ${additionalInfo || null},
        NOW()
      )
      ON CONFLICT (user_id)
      DO UPDATE SET
        dob = EXCLUDED.dob,
        monthly_income = EXCLUDED.monthly_income,
        monthly_budget = EXCLUDED.monthly_budget,
        type = EXCLUDED.type,
        money_in_pocket = EXCLUDED.money_in_pocket,
        additional_info = EXCLUDED.additional_info,
        updated_at = NOW()
      RETURNING *
    `;

    return res.status(200).json({ profile: sanitizeProfile(profile) });
  } catch (error) {
    console.error("Profile save error:", error);
    return res.status(500).json({ error: "Failed to save profile." });
  }
});

app.patch("/profile/balance", authMiddleware, async (req, res) => {
  try {
    const { balance } = req.body;
    const [profile] = await sql`
      UPDATE ${sql.unsafe(profileTable)}
      SET money_in_pocket = ${normalizeNumber(balance)}, updated_at = NOW()
      WHERE user_id = ${req.authUser.id}
      RETURNING *
    `;

    if (!profile) {
      return res.status(404).json({ error: "Profile not found." });
    }

    return res.status(200).json({ profile: sanitizeProfile(profile) });
  } catch (error) {
    console.error("Balance update error:", error);
    return res.status(500).json({ error: "Failed to update balance." });
  }
});

app.get("/transactions", authMiddleware, async (req, res) => {
  const transactions = await sql`
    SELECT *
    FROM ${sql.unsafe(transactionTable)}
    WHERE user_id = ${req.authUser.id}
    ORDER BY date DESC
  `;

  return res.status(200).json({ transactions: transactions.map(sanitizeTransaction) });
});

app.post("/transactions", authMiddleware, async (req, res) => {
  try {
    const { title, amount, category, paymentMethod, type, description, date } = req.body;

    const [transaction] = await sql`
      INSERT INTO ${sql.unsafe(transactionTable)} (
        user_id, title, amount, category, payment_method, type, description, date
      )
      VALUES (
        ${req.authUser.id},
        ${title},
        ${normalizeNumber(amount)},
        ${category},
        ${paymentMethod},
        ${type},
        ${description || null},
        ${date || new Date().toISOString()}
      )
      RETURNING *
    `;

    return res.status(201).json({ transaction: sanitizeTransaction(transaction) });
  } catch (error) {
    console.error("Transaction create error:", error);
    return res.status(500).json({ error: "Failed to add transaction." });
  }
});

app.get("/chat-history", authMiddleware, async (req, res) => {
  const messages = await sql`
    SELECT *
    FROM ${sql.unsafe(chatTable)}
    WHERE user_id = ${req.authUser.id}
    ORDER BY date ASC
  `;

  return res.status(200).json({ messages: messages.map(sanitizeChatMessage) });
});

app.post("/chat-history", authMiddleware, async (req, res) => {
  try {
    const { content, sender, date } = req.body;

    const [message] = await sql`
      INSERT INTO ${sql.unsafe(chatTable)} (user_id, content, sender, date)
      VALUES (${req.authUser.id}, ${content}, ${sender}, ${date || new Date().toISOString()})
      RETURNING *
    `;

    return res.status(201).json({ message: sanitizeChatMessage(message) });
  } catch (error) {
    console.error("Chat history save error:", error);
    return res.status(500).json({ error: "Failed to save chat message." });
  }
});

app.get("/stocks", authMiddleware, async (req, res) => {
  const stocks = await sql`
    SELECT *
    FROM ${sql.unsafe(stocksTable)}
    WHERE user_id = ${req.authUser.id}
    ORDER BY created_at DESC
  `;

  return res.status(200).json({ stocks: stocks.map(sanitizeStock) });
});

app.post("/stocks", authMiddleware, async (req, res) => {
  try {
    const { code, amount } = req.body;

    const [stock] = await sql`
      INSERT INTO ${sql.unsafe(stocksTable)} (user_id, code, amount)
      VALUES (${req.authUser.id}, ${code}, ${normalizeNumber(amount)})
      RETURNING *
    `;

    return res.status(201).json({ stock: sanitizeStock(stock) });
  } catch (error) {
    console.error("Stock create error:", error);
    return res.status(500).json({ error: "Failed to add stock investment." });
  }
});

app.use((req, res) => {
  return res.status(404).json({ error: "Route not found." });
});

const startServer = async () => {
  await ensureTables();

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

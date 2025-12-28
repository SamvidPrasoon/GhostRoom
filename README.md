# 🔐 Encrypted Self-Destruct Chat

A zero-trust, ephemeral chat application where **messages vanish forever**. No history. No recovery. No mercy for data.

Built for secure, temporary conversations with automatic self-destruction using Redis TTLs

---

## ✨ Features

* 🧨 **Self-destructing rooms** (auto expiry)
* ⏱ **Countdown timer** until destruction
* 🔐 **Ephemeral rooms** (2 participants only)
* 🚫 **Room full protection**
* 👻 **No message persistence** after expiry
* ⚡ **Redis-backed TTL synced data**
* 🧑‍💻 Terminal / cyber-punk inspired UI
* 🧠 Designed with zero-trust principles

---

## 🧠 How It Works

1. A secure room is created
2. A unique `roomId` is generated
3. Redis keys are created **together**:

   * `room:{roomId}`
   * `messages:{roomId}` (empty list)
4. Both keys share the **same TTL**
5. A 10-minute countdown starts
6. When timer hits `0`:

   * Redis auto-deletes keys
   * Users are redirected
7. Manual **DESTROY** immediately deletes all keys

> Once destroyed — data is unrecoverable.

---

## 🏗 Tech Stack

* **Next.js (App Router)**
* **React + TypeScript**
* **Tailwind CSS**
* **Redis** (TTL-based expiry)(UPSTASH REDIS)
* **Elysia js** (Backend Routes)

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone <repo-url>
cd project
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create `.env.local`

```env
REDIS_URL=your_redis_url
```

### 4️⃣ Run the app

```bash
npm run dev
```

App runs at `http://localhost:3000`

---

## ⏱ Countdown Logic

* Timer starts from **600 seconds (10 minutes)**
* Uses `Date.now()` + expiry timestamp
* Formatted with `date-fns`
* Redirects when expired

---

## 🧨 Destroy Logic

* **Auto destroy** → Redis TTL
* **Manual destroy** → `DEL room:* messages:*`
* Both users are force-redirected

---

## 🚫 Limitations

* Max **2 users per room**
* No message history
* No recovery after destruction

---

## 🧪 Error Pages

* **ROOM NOT FOUND** → expired / invalid room
* **ROOM FULL** → more than 2 participants

---

## 🎨 UI Philosophy

Inspired by:

* Terminal aesthetics
* Cyber-punk minimalism
* Military-grade warning systems

---

## ⚠ Disclaimer

This app is for **educational / experimental purposes**.
Do **NOT** use for illegal or sensitive communications.

---

## 🧑‍💻 Author

Built by **Samvid

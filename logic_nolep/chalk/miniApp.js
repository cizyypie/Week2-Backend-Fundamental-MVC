import fs from "fs/promises";
import chalk from "chalk";
import { password, input } from "@inquirer/prompts";

const dataFile = "users.json";

async function loadUsers() {
  try {
    const data = await fs.readFile(dataFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveUsers(users) {
  await fs.writeFile(dataFile, JSON.stringify(users, null, 2));
}

async function question(message) {
  return await input({ message });
}

async function login() {
  console.clear();
  console.log(chalk.blue.bold("=== Login ==="));
  const username = await question(chalk.yellow("Username: "));
  const userPass = await password({
    message: chalk.yellow("Password:"),
    mask: true,
    validate: (input) => {
      if (input.length < 2) return "Password must be at least 2 characters.";
      return true;
    },
  });

  const users = await loadUsers();
  const user = users.find((u) => u.username === username && u.userPass === userPass,);

  if (user) {
    user.status = "online";
    user.lastLogin = new Date().toISOString();
    await saveUsers(users);
    console.log(chalk.green("Login successful!"));
    console.log(chalk.cyan(`Welcome back, ${username}!`));
  } else {
    console.log(chalk.red("Invalid username or password."));
  }
}

async function register() {
  console.clear();
  console.log(chalk.blue.bold("=== Register ==="));
  const username = await question(chalk.yellow("Choose a username: "));
  const userPass = await password({
    message: chalk.yellow("Password:"),
    mask: true,
    validate: (input) => {
      if (input.length < 2) return "Password must be at least 2 characters."; //min 2 krn latihan aja :)
      return true;
    },
  });
  const users = await loadUsers();
  if (users.some((u) => u.username === username)) {
    console.log(chalk.red("Username already exists."));
  } else {
    users.push({
      username,
      userPass,
      status: "offline",
      lastLogin: null,
    });
    await saveUsers(users);
    console.log(chalk.green("Registration successful!"));
  }
}

async function logout() {
  console.clear();
  console.log(chalk.blue.bold("=== Logout ==="));
  const username = await question(chalk.yellow("Enter your username: "));

  const users = await loadUsers();
  const user = users.find((u) => u.username === username);

  if (user && user.status === "online") {
    user.status = "offline";
    await saveUsers(users);
    console.log(chalk.green(`${username} has been logged out.`));
  } else {
    console.log(chalk.red("User not found or not logged in."));
  }
}

async function listUsers() {
  console.clear();
  console.log(chalk.blue.bold("=== User List ==="));
  const users = await loadUsers();
  users.forEach((user) => {
    const statusColor = user.status === "online" ? chalk.green : chalk.red;
    console.log(chalk.cyan(`Username: ${user.username}`));
    console.log(statusColor(`Status: ${user.status}`));
    console.log(chalk.yellow(`Last Login: ${user.lastLogin || "Never"}`));
    console.log("-".repeat(30));
  });
}

async function main() {
  while (true) {
    console.log("\n");
    console.log(chalk.blue.bold("=== Main Menu ==="));
    console.log(chalk.yellow("1. Login"));
    console.log(chalk.yellow("2. Register"));
    console.log(chalk.yellow("3. Logout"));
    console.log(chalk.yellow("4. List Users"));
    console.log(chalk.yellow("5. Exit"));
    const choice = await question(chalk.magenta("Enter your choice (1-5): "));

    switch (choice) {
      case "1":
        await login();
        break;
      case "2":
        await register();
        break;
      case "3":
        await logout();
        break;
      case "4":
        await listUsers();
        break;
      case "5":
        console.log(chalk.green("Goodbye!"));
        process.exit(0);
      default:
        console.log(chalk.red("Invalid choice. Please try again."));
    }
  }
}

main();

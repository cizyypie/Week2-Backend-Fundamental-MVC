import fs from "fs/promises";
import chalk from "chalk";
import { password, input } from "@inquirer/prompts";

let currentUser = null;
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
  const user = users.find(
    (u) => u.username === username && u.userPass === userPass,
  );

  if (user) {
    user.status = "online";
    user.lastLogin = new Date().toISOString();
    currentUser = user;
    await saveUsers(users);
    return await mainMenu();
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
      if (input.length < 2) return "Password must be at least 2 characters.";
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
      score: 0,
    });
    await saveUsers(users);
    console.log(chalk.green("Registration successful!"));
  }
}

async function startMenu() {
  while (true) {
    console.log("\n");
    console.log(chalk.blue.bold("=== Guessing Game ==="));
    console.log(chalk.yellow("1. Login"));
    console.log(chalk.yellow("2. Register"));
    console.log(chalk.yellow("3. Exit"));
    const choice = await question(chalk.magenta("Enter your choice (1-3): "));

    switch (choice) {
      case "1":
        await login();
        break;
      case "2":
        await register();
        break;
      case "3":
        console.log(chalk.green("Goodbye!"));
        process.exit(0);
      default:
        console.log(chalk.red("Invalid choice. Please try again."));
    }
  }
}

async function mainMenu() {
  let inMenu = true;
  while (inMenu) {
    console.log("\n");
    console.log(chalk.blue.bold("=== Main Menu ==="));
    console.log(chalk.yellow("1. Play"));
    console.log(chalk.yellow("2. Leaderboard "));
    console.log(chalk.yellow("3. Logout"));
    const choice = await question(chalk.magenta("Enter your choice (1-3): "));

    switch (choice) {
      case "1":
        await playGame(currentUser.username);
        break;
      case "2":
        await showLeaderboard();
        break;
      case "3":
        inMenu = false;
        await logout();
        break;
      default:
        console.log(chalk.red("Invalid choice. Please try again."));
    }
  }
}

async function logout() {
  console.clear();
  console.log(chalk.blue.bold("=== Logout ==="));
  const users = await loadUsers();
  const username = await question(chalk.yellow("Enter your username: "));
  const user = users.find((u) => u.username === username);
  if (user && user.status === "online") {
    user.status = "offline";
    await saveUsers(users);
    console.log(chalk.green(`${username} has been logged out.`));
  } else {
    console.log(chalk.red("User not found or not logged in."));
  }
}

async function showLeaderboard() {
  console.log(chalk.blue("=== Leaderboard ==="));
  console.clear();
  const users = await loadUsers();
  const activeUsers = users.filter(u => u.score > 0);
  activeUsers.sort((a, b) => a.score - b.score);
  activeUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username} : ${user.score} tries`);
  });
}

async function playGame(username) {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  let totalTry = 0;
  let correctGuess = false;

  console.log(chalk.bold("=== Guess Number Game ==="));
  console.log(chalk.yellow("Guess a number between 1 and 100"));

  while (!correctGuess) {
    const inputVal = await question(chalk.cyan("Your Guess: "));
    const guessNumber = parseInt(inputVal);
    totalTry++;

    if (isNaN(guessNumber)) {
      console.log(chalk.red("Please enter a valid number!"));
      continue;
    }

    if (guessNumber > randomNumber) {
      console.log(chalk.red("Too High!"));
    } else if (guessNumber < randomNumber) {
      console.log(chalk.blue("Too Low!"));
    } else {
      correctGuess = true;
      console.log(
        chalk.green.bold(
          `\nCongratulations! You guessed correctly in ${totalTry} tries.`,
        ),
      );
      const users = await loadUsers();
      const user = users.find((u) => u.username === username);
      if (user) {
        if (user.score === 0 || user.score > totalTry) {
          user.score = totalTry;
          await saveUsers(users);
          console.log(chalk.italic.green("new high score recorded"));
        }
      }
    }
  }
}

async function main() {
  const users = await loadUsers();
  await startMenu();
}

main();

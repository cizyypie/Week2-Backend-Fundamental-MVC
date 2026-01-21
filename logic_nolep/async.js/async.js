const { reject } = require("async");

const users = [
  { id: 1, username: "john_doe" },
  { id: 2, username: "jane_smith" },
  { id: 3, username: "alice" },
];

// Implementasi Callback
function getUserDataCallback(userId, callback) {
  const targetId = users.find((user) => user.id === userId);
  callback(targetId);
}

// Implementasi Promise
function getUserDataPromise(userId) {
  const targetId = users.find((user) => user.id === userId);
  return new Promise((resolve, reject) => {
    if (targetId) {
      resolve(targetId);
    } else reject("Error");
  });
}

// Implementasi Async/Await
async function getUserDataAsync(userId) {
  const targetId = users.find((user) => user.id === userId);
  const usr = () => Promise.resolve(targetId);
  const res = await usr();
  return res;
}

// Test Case Callback
getUserDataCallback(1, (user) => {
  console.log("Callback Result:", user);
  // Output: Callback Result: { id: 1, username: 'john_doe' }
});

// Test Case Promise
getUserDataPromise(4)
  .then((user) => {
    console.log("Promise Result:", user);
    // Output: Promise Result: { id: 2, username: 'jane_smith' }
  })
  .catch((error) => {
    console.error(error);
  });

// Test Case Async/Await
(async () => {
  const user = await getUserDataAsync(3);
  console.log("Async/Await Result:", user);
  // Output: Async/Await Result: { id: 3, username: 'alice' }
})();

export async function handleToken(action: string, token: string) {
  localStorage.removeItem("jwt_token"); // Remove the 'name' item
  switch (action) {
    case "register":
      localStorage.setItem("jwt_token", token); // Add an item
      break;
    case "login":
      localStorage.setItem("jwt_token", token); // Add an item
      break;
    case "logout":
      localStorage.removeItem("jwt_token"); // Add an item
      break;
    default:
      localStorage.removeItem("jwt_token"); // Remove the 'name' item
      break;
  }
}

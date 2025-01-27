export enum StatusCodes {
  ok = 200,
  created = 201,
  badRequest = 400,
  unauthorized = 401,
  internalServerError = 500,
  notFound = 404,
}

export enum Routes {
  base = "/",
  register = "/register",
  login = "/login",
  users = "/users",
  currentUser = "/users/current",
  blockUsers = "/users/block",
  unblockUsers = "/users/unblock",
  deleteUsers = "/users/delete",
}

export enum UserStatus {
  active = "active",
  blocked = "blocked",
}

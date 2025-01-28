export enum StatusCodes {
  ok = 200,
  created = 201,
  badRequest = 400,
  unauthorized = 401,
  internalServerError = 500,
  notFound = 404,
}

export enum ApiRoutes {
  register = "/api/register",
  login = "/api/login",
  users = "/api/users",
  currentUser = "/api/users/current",
  blockUsers = "/api/users/block",
  unblockUsers = "/api/users/unblock",
  deleteUsers = "/api/users/delete",
}

export enum Routes {
  base = "/",
  register = "/register",
  login = "/login",
  dashboard = "/dashboard",
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

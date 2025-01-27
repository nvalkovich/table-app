"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrors = exports.ApiMessages = exports.Routes = exports.StatusCodes = void 0;
var StatusCodes;
(function (StatusCodes) {
    StatusCodes[StatusCodes["ok"] = 200] = "ok";
    StatusCodes[StatusCodes["created"] = 201] = "created";
    StatusCodes[StatusCodes["badRequest"] = 400] = "badRequest";
    StatusCodes[StatusCodes["unauthorized"] = 401] = "unauthorized";
    StatusCodes[StatusCodes["internalServerError"] = 500] = "internalServerError";
    StatusCodes[StatusCodes["notFound"] = 404] = "notFound";
})(StatusCodes || (exports.StatusCodes = StatusCodes = {}));
var Routes;
(function (Routes) {
    Routes["base"] = "/";
    Routes["register"] = "/register";
    Routes["login"] = "/login";
    Routes["users"] = "/users";
    Routes["currentUser"] = "/users/current";
    Routes["blockUsers"] = "/users/block";
    Routes["unblockUsers"] = "/users/unblock";
    Routes["deleteUsers"] = "/users/delete";
})(Routes || (exports.Routes = Routes = {}));
var ApiMessages;
(function (ApiMessages) {
    ApiMessages["usersDeleted"] = "Users deleted";
})(ApiMessages || (exports.ApiMessages = ApiMessages = {}));
var ApiErrors;
(function (ApiErrors) {
})(ApiErrors || (exports.ApiErrors = ApiErrors = {}));

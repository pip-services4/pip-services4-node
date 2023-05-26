"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerAuthorizer = void 0;
/** @module auth */
const pip_services4_commons_node_1 = require("pip-services4-commons-node");
const HttpResponseSender_1 = require("../controllers/HttpResponseSender");
class OwnerAuthorizer {
    owner(idParam = 'user_id') {
        return (req, res, next) => {
            if (req.user == null) {
                HttpResponseSender_1.HttpResponseSender.sendError(req, res, new pip_services4_commons_node_1.UnauthorizedException(null, 'NOT_SIGNED', 'User must be signed in to perform this operation').withStatus(401));
            }
            else {
                const userId = req.params[idParam] || req.param(idParam);
                if (req.user_id != userId) {
                    HttpResponseSender_1.HttpResponseSender.sendError(req, res, new pip_services4_commons_node_1.UnauthorizedException(null, 'FORBIDDEN', 'Only data owner can perform this operation').withStatus(403));
                }
                else {
                    next();
                }
            }
        };
    }
    ownerOrAdmin(idParam = 'user_id') {
        return (req, res, next) => {
            if (req.user == null) {
                HttpResponseSender_1.HttpResponseSender.sendError(req, res, new pip_services4_commons_node_1.UnauthorizedException(null, 'NOT_SIGNED', 'User must be signed in to perform this operation').withStatus(401));
            }
            else {
                const userId = req.params[idParam] || req.param(idParam);
                let roles = req.user != null ? req.user.roles : null;
                roles = roles || [];
                const admin = roles.includes('admin');
                if (req.user_id != userId && !admin) {
                    HttpResponseSender_1.HttpResponseSender.sendError(req, res, new pip_services4_commons_node_1.UnauthorizedException(null, 'FORBIDDEN', 'Only data owner can perform this operation').withStatus(403));
                }
                else {
                    next();
                }
            }
        };
    }
}
exports.OwnerAuthorizer = OwnerAuthorizer;
//# sourceMappingURL=OwnerAuthorizer.js.map
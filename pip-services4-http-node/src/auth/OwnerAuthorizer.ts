/** @module auth */
import { UnauthorizedException } from 'pip-services4-commons-node';
import { HttpResponseSender } from '../controllers/HttpResponseSender';

export class OwnerAuthorizer {

    public owner(idParam = 'user_id'): (req: any, res: any, next: () => void) => void {
        return (req, res, next) => {
            if (req.user == null) {
                HttpResponseSender.sendError(
                    req, res,
                    new UnauthorizedException(
                        null,
                        'NOT_SIGNED',
                        'User must be signed in to perform this operation'
                    ).withStatus(401)
                );
            } else {
                const userId = req.params[idParam] || req.param(idParam);
                if (req.user_id != userId) {
                    HttpResponseSender.sendError(
                        req, res,
                        new UnauthorizedException(
                            null,
                            'FORBIDDEN',
                            'Only data owner can perform this operation'
                        ).withStatus(403)
                    );
                } else {
                    next();
                }
            }
        };
    }

    public ownerOrAdmin(idParam = 'user_id'): (req: any, res: any, next: () => void) => void {
        return (req, res, next) => {
            if (req.user == null) {
                HttpResponseSender.sendError(
                    req, res,
                    new UnauthorizedException(
                        null,
                        'NOT_SIGNED',
                        'User must be signed in to perform this operation'
                    ).withStatus(401)
                );
            } else {
                const userId = req.params[idParam] || req.param(idParam);
                let roles: string[] = req.user != null ? req.user.roles : null;
                roles = roles || [];
                const admin = roles.includes('admin');
                if (req.user_id != userId && !admin) {
                    HttpResponseSender.sendError(
                        req, res,
                        new UnauthorizedException(
                            null,
                            'FORBIDDEN',
                            'Only data owner can perform this operation'
                        ).withStatus(403)
                    );
                } else {
                    next();
                }
            }
        };
    }

}

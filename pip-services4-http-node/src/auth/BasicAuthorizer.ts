/** @module auth */
import { UnauthorizedException } from 'pip-services4-commons-node';
import { HttpResponseSender } from '../controllers/HttpResponseSender';

export class BasicAuthorizer {

    public anybody(): (req: any, res: any, next: () => void) => void {
        return (req, res, next) => {
            next();
        };
    }

    public signed(): (req: any, res: any, next: () => void) => void {
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
                next();
            }
        };
    }

}

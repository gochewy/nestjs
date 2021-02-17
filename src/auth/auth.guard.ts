import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    if (!req.headers.authorization) {
      return false;
    }
    await this.validateToken(req.headers.authorization);
    return true;
  }

  async validateToken(authToken: string) {
    if (authToken.split(' ')[0] !== 'Bearer') {
      throw new HttpException(
        'not a valid format for a token',
        HttpStatus.FORBIDDEN,
      );
    }
    //Todo Rearrange if-else flow
    const localPublicKey = await this.cacheManager.get('publicKey');
    if (localPublicKey) {
      const is = await jwt.verify(authToken.split(' ')[1], localPublicKey, {
        algorithms: ['RS256'],
      });
      if (is.exp < new Date().getTime() / 1000) {
        throw new HttpException(
          'your session is expired',
          HttpStatus.UNAUTHORIZED,
        );
      }
    } else {
      const response = await axios(
        `http://modules.swarn.ecdev.site/auth/realms/Sample`,
        {
          method: 'GET',
          headers: {
            Authorization: authToken,
          },
        },
      );
      const pKey = `-----BEGIN PUBLIC KEY-----\r\n${response.data.public_key}\r\n-----END PUBLIC KEY-----`;
      const is = await jwt.verify(authToken.split(' ')[1], pKey, {
        algorithms: ['RS256'],
      });
      await this.cacheManager.set('publicKey', pKey);
      if (is.exp < new Date().getTime() / 1000) {
        throw new HttpException(
          'your session is expired',
          HttpStatus.FORBIDDEN,
        );
      } else {
        return true;
      }
    }
  }
}

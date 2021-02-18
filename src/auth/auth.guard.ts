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
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const graphQlContext = ctx.getContext();
    if (!graphQlContext.req.headers.authorization) {
      return false;
    }
    await this.validateToken(graphQlContext.req.headers.authorization);
    return true;
  }

  async validateToken(authToken: string) {
    if (authToken.split(' ')[0] !== 'Bearer') {
      throw new HttpException(
        'not a valid format for a token',
        HttpStatus.FORBIDDEN,
      );
    }
    const publicKey = this.configService.get<string>('jwkKey');
    //Todo Rearrange if-else flow
    if (publicKey) {
      const is = await jwt.verify(authToken.split(' ')[1], publicKey, {
        algorithms: ['RS256'],
      });
      if (is.exp < new Date().getTime() / 1000) {
        throw new HttpException(
          'your session is expired',
          HttpStatus.UNAUTHORIZED,
        );
      } else {
        return true;
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
      console.log('from api', pKey);
      const is = await jwt.verify(authToken.split(' ')[1], pKey, {
        algorithms: ['RS256'],
      });
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

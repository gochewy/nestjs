import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';
import * as jwt from 'jsonwebtoken';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}
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
    console.log('authtoken in server', authToken);
    const publicKey = this.configService.get<string>('jwkKey');
    console.log('@@in auth guard', publicKey);
    //Todo Rearrange if-else flow
    if (publicKey) {
      const is: any = await jwt.verify(authToken.split(' ')[1], publicKey, {
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
      const response = await axios(process.env.PUBLIC_KEY_URLS, {
        method: 'GET',
        headers: {
          Authorization: authToken,
        },
      });
      const pKey = `-----BEGIN PUBLIC KEY-----\r\n${response.data.public_key}\r\n-----END PUBLIC KEY-----`;
      console.log('from api', pKey);
      const is: any = await jwt.verify(authToken.split(' ')[1], pKey, {
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

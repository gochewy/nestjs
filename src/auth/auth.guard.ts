import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    console.log('coming here');
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
    const response = await fetch(
      `http://modules.swarn.ecdev.site/auth/realms/Sample/protocol/openid-connect/userinfo`,
      {
        method: 'GET',
        headers: {
          Authorization: authToken,
        },
      },
    );
    console.log(response.status);
    if (response.status !== 200) {
      throw new HttpException('', HttpStatus.FORBIDDEN);
    } else {
      return true;
    }
  }
}

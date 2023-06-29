import { Injectable } from '@nestjs/common';
import { JwtStrategy } from './jwt-strategy';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtStrategy) {}

  async validateUser(payload: any) {
    return this.jwtService.validate(payload);
  }
}

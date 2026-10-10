import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto, LoginDto } from "./dto/auth.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  async signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post("login")
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getMe(@Request() req: any) {
    return this.authService.getMe(req.user.id);
  }
}

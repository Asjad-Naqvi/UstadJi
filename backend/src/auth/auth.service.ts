import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { SignUpDto, LoginDto } from "./dto/auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async signup(dto: SignUpDto) {
    const existing = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: dto.email }, ...(dto.phone ? [{ phone: dto.phone }] : [])],
      },
    });

    if (existing) {
      throw new ConflictException("User with this email or phone already exists");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role || "CUSTOMER";

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        phone: dto.phone,
        password: hashedPassword,
        fullName: dto.fullName,
        role,
        ...(role === "CUSTOMER"
          ? {
              customerProfile: {
                create: {
                  sector: dto.sector || "F-7/2",
                  city: "Islamabad",
                },
              },
            }
          : role === "PROVIDER"
          ? {
              providerProfile: {
                create: {
                  trade: dto.trade || "General Handyman",
                  hourlyRate: dto.hourlyRate || 800.0,
                  sectorsCovered: dto.sector || "F-7, F-8, Islamabad",
                  workingHours: {
                    create: [1, 2, 3, 4, 5, 6].map((day) => ({
                      dayOfWeek: day,
                      startTime: "09:00",
                      endTime: "18:00",
                      isWorkingDay: true,
                    })),
                  },
                },
              },
            }
          : {}),
      },
      include: {
        customerProfile: true,
        providerProfile: true,
      },
    });

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: "Account created successfully",
      accessToken: token,
      user: this.sanitizeUser(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        customerProfile: true,
        providerProfile: {
          include: { workingHours: true },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const token = this.generateToken(user.id, user.email, user.role);

    return {
      message: "Logged in successfully",
      accessToken: token,
      user: this.sanitizeUser(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        customerProfile: true,
        providerProfile: {
          include: { workingHours: true },
        },
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return this.sanitizeUser(user);
  }

  private generateToken(userId: string, email: string, role: string) {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
    });
  }

  private sanitizeUser(user: any) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

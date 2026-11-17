import { Module, Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { IsString, IsOptional, MaxLength, IsInt, Min, IsBoolean } from 'class-validator';
import { AgentService } from './agent.service';
import { ProvidersModule } from '../providers/providers.module';
import { BookingsModule } from '../bookings/bookings.module';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
class AgentDto {
  @IsOptional() @IsString() @MaxLength(64) sessionId?:string;
  @IsOptional() @IsInt() @Min(0) revision?:number;
  @IsOptional() @IsString() @MaxLength(2000) message?:string;
  @IsOptional() @IsString() @MaxLength(64) providerId?:string;
  @IsOptional() @IsString() @MaxLength(5) startTime?:string;
  @IsOptional() @IsString() @MaxLength(5) endTime?:string;
  @IsOptional() @IsBoolean() confirm?:boolean;
}
@Controller('agent') @UseGuards(JwtAuthGuard)
export class AgentController {
  constructor(private agent:AgentService){}
  @Post('chat') chat(@Request() req:any,@Body() body:AgentDto){return this.agent.act(req.user.id,body);}
}
@Module({imports:[AuthModule,ProvidersModule,BookingsModule],providers:[AgentService],controllers:[AgentController]})
export class AgentModule {}

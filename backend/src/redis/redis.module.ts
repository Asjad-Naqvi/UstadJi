import { Global, Module } from "@nestjs/common";
import { SlotLockService } from "./slot-lock.service";

@Global()
@Module({
  providers: [SlotLockService],
  exports: [SlotLockService],
})
export class RedisModule {}

import { Controller, Get } from '@nestjs/common';

@Controller()
export class HealthController {
  @Get()
  pong() {
    return { ok: true, ts: Date.now() };
  }
}

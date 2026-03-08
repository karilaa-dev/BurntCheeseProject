import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';

@Controller()
export class PagesController {
  @Get('about')
  getAbout(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', 'public', 'about.html'));
  }
}

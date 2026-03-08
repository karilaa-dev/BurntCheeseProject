import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { join } from 'path';
import { NotFoundException } from '@nestjs/common';

@Controller()
export class PagesController {
  // home page
  @Get('/') getHome(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'index.html'));
  }

  // about page
  @Get('about')
  getAbout(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'html', 'about.html'));
  }

  // result page
  @Get('results') getResults(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'html', 'results.html'));
  }

  // not found
  @Get('*') getNotFound(@Res() res: Response) {
    res.sendFile(join(process.cwd(), 'public', 'html', 'not_found.html'));
  }
}

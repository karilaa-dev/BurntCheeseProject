import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PagesController } from './pages.controller';
import { CarbonModule } from './carbon/carbon.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public',),
    }),
    ConfigModule.forRoot({isGlobal: true,}),
    CarbonModule,
  ],
  controllers: [AppController, PagesController],
  providers: [AppService],
})
export class AppModule {}

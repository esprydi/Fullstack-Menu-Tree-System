import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menus/menu.entity';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [
    // Mengaktifkan fitur baca file .env secara global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Menyambungkan TypeORM secara asinkron menggunakan .env
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [Menu], 
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Default false untuk best practice production
      }),
    }),
    MenusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

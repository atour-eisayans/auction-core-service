import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')) || 5_432,
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        useUTC: true,
        entities: [`${__dirname}/**/entities/*.entity.{ts,js}`],
        migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      // list entities here
    ]),
  ],
})
export class DatabaseModule {}

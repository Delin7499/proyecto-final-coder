import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { CartsModule } from './carts/carts.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { FileUploadModule } from './file-upload/file-upload.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({}),
    ProductsModule,
    MongooseModule.forRoot(process.env.MONGO_URL, {
      dbName:
        process.env.NODE_ENV === 'test'
          ? process.env.MONGO_DB_NAME_TEST
          : process.env.NODE_ENV === 'development'
            ? process.env.MONGO_DB_NAME_DEV
            : process.env.MONGO_DB_NAME,
    }),
    CategoryModule,
    CartsModule,
    AuthModule,
    UsersModule,
    TicketsModule,
    FileUploadModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

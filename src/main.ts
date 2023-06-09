import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { GlobalService } from './utilities/wpsClient/wps.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('Whatsapp API')
    .setDescription('The whatsapp API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors()
  await app.listen(process.env.PORT || 3000);

}

GlobalService.client.initialize();
GlobalService.client.on('qr', async qr => {
  console.log(qr);

  GlobalService.qr = qr.toString();
})

GlobalService.client.on('ready', user => {
  GlobalService.status = 'ready'
})

GlobalService.client.on('sendMessage', (body) => {
  var fileArray: Map<any, any>[] = body.file
  fileArray.forEach(element => {
    if (typeof (element['phone']) != 'number') {
      GlobalService.error.push(element['phone'])
      return;
    }
    GlobalService.client.sendMessage(element['phone'] + '@c.us', body.message);
    GlobalService.sent += 1;

  });




  // fileArray.forEach((value: Map<any, any>) => {
  //  
  // })
})

GlobalService.client.on('disconnected', sesion => {
  GlobalService.status = 'logout'
  GlobalService.sent = 0
  GlobalService.qr = ''
  GlobalService.client.initialize();
})

bootstrap();

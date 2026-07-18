import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MenusService } from './menus/menus.service';

async function bootstrap() {
  console.log('Memulai proses seeding (menyuntikkan data dummy)... 🌱');
  
  // Membuat context aplikasi tanpa menjalankan server HTTP
  const app = await NestFactory.createApplicationContext(AppModule);
  const menusService = app.get(MenusService);

  try {
    // 1. Membuat Menu Utama (Root 1)
    const systemManagement = await menusService.create({ name: 'System Management', order: 1 });
    console.log(`Berhasil membuat root: ${systemManagement.name}`);

    // 2. Membuat Sub-menu untuk System Management
    await menusService.create({ name: 'Systems', parentId: systemManagement.id, order: 1 });
    await menusService.create({ name: 'System Code', parentId: systemManagement.id, order: 2 });
    const systemProperties = await menusService.create({ name: 'System Properties', parentId: systemManagement.id, order: 3 });
    
    // 3. Membuat Sub-menu berkedalaman level 3
    await menusService.create({ name: 'System Menus', parentId: systemProperties.id, order: 1 });
    await menusService.create({ name: 'API List', parentId: systemProperties.id, order: 2 });

    // 4. Membuat Menu Utama Lainnya (Root 2)
    const userGroups = await menusService.create({ name: 'Users & Groups', order: 2 });
    console.log(`Berhasil membuat root: ${userGroups.name}`);

    // 5. Membuat Sub-menu untuk Users & Groups
    await menusService.create({ name: 'Users', parentId: userGroups.id, order: 1 });
    await menusService.create({ name: 'Roles', parentId: userGroups.id, order: 2 });

    console.log('✅ Seeding selesai! Data berhasil dimasukkan ke database.');
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();

import { Controller, Get, Post, Body, Patch, Param, Delete, Put, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MoveMenuDto } from './dto/move-menu.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Post()
  @ApiOperation({ summary: 'Membuat menu baru (root atau child)' })
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menusService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: 'Mendapatkan seluruh struktur menu dalam format tree' })
  findAllTrees() {
    return this.menusService.findAllTrees();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Mendapatkan 1 menu beserta parent dan children-nya' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mengubah nama menu' })
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateMenuDto: UpdateMenuDto
  ) {
    return this.menusService.update(id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Menghapus menu beserta seluruh anak-anaknya' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.menusService.remove(id);
  }

  @Patch(':id/move')
  @ApiOperation({ summary: 'Memindahkan menu ke parent yang baru (atau menjadi root)' })
  move(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() moveMenuDto: MoveMenuDto
  ) {
    return this.menusService.move(id, moveMenuDto);
  }

  @Patch(':id/reorder')
  @ApiOperation({ summary: 'Mengubah urutan menu di level yang sama' })
  reorder(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() reorderMenuDto: ReorderMenuDto
  ) {
    return this.menusService.reorder(id, reorderMenuDto);
  }
}

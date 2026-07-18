import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Menu } from './menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MoveMenuDto } from './dto/move-menu.dto';
import { ReorderMenuDto } from './dto/reorder-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: TreeRepository<Menu>,
  ) {}

  // Helper function: rekursif sort berdasarkan kolom "order"
  private sortTree(menus: Menu[]): Menu[] {
    return menus.sort((a, b) => a.order - b.order).map(menu => {
      if (menu.children && menu.children.length > 0) {
        menu.children = this.sortTree(menu.children);
      }
      return menu;
    });
  }

  async findAllTrees() {
    const trees = await this.menuRepository.findTrees();
    return this.sortTree(trees);
  }

  async findOne(id: string) {
    const menu = await this.menuRepository.findOne({
      where: { id },
      relations: {
        parent: true,
        children: true,
      },
    });
    if (!menu) throw new NotFoundException(`Menu dengan ID ${id} tidak ditemukan`);
    return menu;
  }

  async create(createMenuDto: CreateMenuDto) {
    const { name, parentId, order } = createMenuDto;
    
    const menu = new Menu();
    menu.name = name;
    if (order !== undefined) {
      menu.order = order;
    }

    if (parentId) {
      const parent = await this.findOne(parentId);
      menu.parent = parent;
    }

    return this.menuRepository.save(menu);
  }

  async update(id: string, updateMenuDto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    if (updateMenuDto.name !== undefined) {
      menu.name = updateMenuDto.name;
    }
    return this.menuRepository.save(menu);
  }

  async remove(id: string) {
    const menu = await this.findOne(id);
    
    // Di Closure Table, kita harus menghapus keturunannya terlebih dahulu
    // agar tidak melanggar foreign key constraint.
    const descendants = await this.menuRepository.findDescendants(menu);
    // Hapus dari anak terdalam sampai induknya
    await this.menuRepository.remove(descendants.reverse());
    
    return { message: `Menu dengan ID ${id} beserta semua anak-anaknya berhasil dihapus.` };
  }

  async move(id: string, moveMenuDto: MoveMenuDto) {
    if (id === moveMenuDto.parentId) {
      throw new BadRequestException('Cannot move a menu to be a child of itself');
    }

    const menu = await this.findOne(id);
    
    if (moveMenuDto.parentId) {
      // Mencegah circular dependency (parent tidak boleh menjadi anak dari keturunannya sendiri)
      const descendants = await this.menuRepository.findDescendants(menu);
      const isDescendant = descendants.some(desc => desc.id === moveMenuDto.parentId);
      if (isDescendant) {
        throw new BadRequestException('Cannot move a menu to be a child of its own descendant');
      }

      const parent = await this.findOne(moveMenuDto.parentId);
      menu.parent = parent;
    } else {
      menu.parent = null; // Menjadi root menu
    }
    return this.menuRepository.save(menu);
  }

  async reorder(id: string, reorderMenuDto: ReorderMenuDto) {
    const menu = await this.findOne(id);
    menu.order = reorderMenuDto.order;
    return this.menuRepository.save(menu);
  }
}

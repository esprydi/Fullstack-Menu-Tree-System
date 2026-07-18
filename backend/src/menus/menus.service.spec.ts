import { Test, TestingModule } from '@nestjs/testing';
import { MenusService } from './menus.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { NotFoundException } from '@nestjs/common';

describe('MenusService', () => {
  let service: MenusService;
  
  // Mock TreeRepository
  const mockTreeRepository = {
    findTrees: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    findDescendants: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenusService,
        {
          provide: getRepositoryToken(Menu),
          useValue: mockTreeRepository,
        },
      ],
    }).compile();

    service = module.get<MenusService>(MenusService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllTrees', () => {
    it('should return an array of trees sorted by order', async () => {
      // Data acak yang harusnya diurutkan oleh service
      const mockMenus = [
        { id: 2, name: 'Menu B', order: 2, children: [] },
        { id: 1, name: 'Menu A', order: 1, children: [] }
      ];
      mockTreeRepository.findTrees.mockResolvedValue(mockMenus);

      const result = await service.findAllTrees();
      
      // Harus diurutkan berdasarkan 'order' (1 lalu 2)
      expect(result[0].id).toEqual(1);
      expect(result[1].id).toEqual(2);
    });
  });

  describe('findOne', () => {
    it('should return a menu if found', async () => {
      const mockMenu = { id: 1, name: 'System' };
      mockTreeRepository.findOne.mockResolvedValue(mockMenu);

      const result = await service.findOne(1);
      expect(result).toEqual(mockMenu);
    });

    it('should throw NotFoundException if menu is not found', async () => {
      mockTreeRepository.findOne.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

describe('MenusController', () => {
  let controller: MenusController;

  const mockMenusService = {
    create: jest.fn(dto => {
      return { id: 1, ...dto };
    }),
    findAllTrees: jest.fn(() => []),
    findOne: jest.fn(id => {
      return { id, name: 'Test Menu' };
    }),
    update: jest.fn((id, dto) => {
      return { id, ...dto };
    }),
    remove: jest.fn(id => {
      return { message: 'Menu deleted' };
    }),
    move: jest.fn((id, dto) => {
      return { id, ...dto };
    }),
    reorder: jest.fn((id, dto) => {
      return { id, ...dto };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenusController],
      providers: [
        {
          provide: MenusService,
          useValue: mockMenusService,
        },
      ],
    }).compile();

    controller = module.get<MenusController>(MenusController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a menu', async () => {
    const dto = { name: 'Test', order: 1 };
    expect(await controller.create(dto)).toEqual({ id: 1, ...dto });
    expect(mockMenusService.create).toHaveBeenCalledWith(dto);
  });

  it('should get all trees', async () => {
    expect(await controller.findAllTrees()).toEqual([]);
    expect(mockMenusService.findAllTrees).toHaveBeenCalled();
  });

  it('should update a menu', async () => {
    const dto = { name: 'Updated' };
    expect(await controller.update(1, dto)).toEqual({ id: 1, ...dto });
    expect(mockMenusService.update).toHaveBeenCalledWith(1, dto);
  });
});

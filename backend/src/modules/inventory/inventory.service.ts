import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { InventoryResponseDto } from './dto/inventory-response.dto';
import { ProductsRepository } from '../products/products.repository';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly productRepository: ProductsRepository,
  ) { }

  async create(dto: CreateInventoryDto): Promise<InventoryResponseDto> {
    // Check Product exist
    const product = await this.productRepository.findById(dto.productId);

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    // Check inventory already exist
    const existingInventory = await this.inventoryRepository.findByProductId(dto.productId);

    if (existingInventory) {
      throw new ConflictException('Inventory already exists for this product.');
    }

    const inventory = await this.inventoryRepository.create({
      productId: dto.productId,
      quantity: dto.quantity,
      reserved: 0
    });

    return this.toInventoryResponse(inventory);
  }

  async getByProductId(productId: string): Promise<InventoryResponseDto> {
    let inventory = await this.inventoryRepository.findByProductId(productId);

    if (!inventory) {
      throw new NotFoundException('Inventory not found.');
    }

    return this.toInventoryResponse(inventory);
  }

  private toInventoryResponse(
    inventory: any,
  ): InventoryResponseDto {
    return {
      id: inventory.id,
      productId: inventory.productId,
      quantity: inventory.quantity,
      reserved: inventory.reserved,
      available: inventory.quantity - inventory.reserved,
    };
  }

  async update(
    productId: string,
    dto: UpdateInventoryDto,
  ): Promise<InventoryResponseDto> {

    const inventory =
      await this.inventoryRepository.findByProductId(
        productId,
      );

    if (!inventory) {
      throw new NotFoundException(
        'Inventory not found.',
      );
    }
    const newQuantity =
      inventory.quantity + dto.change;

    if (newQuantity < inventory.reserved) {
      throw new BadRequestException(
        'Quantity cannot be less than reserved stock.',
      );
    }

    const updatedInventory =
      await this.inventoryRepository.update(
        productId,
        dto.change,
      );

    return this.toInventoryResponse(
      updatedInventory,
    );
  }
}

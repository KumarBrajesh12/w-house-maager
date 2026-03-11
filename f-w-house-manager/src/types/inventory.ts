export interface Category {
    id: string;
    name: string;
    description?: string;
}

export interface Item {
    id: string;
    name: string;
    sku: string;
    description?: string;
    basePrice: number;
    unit: string;
    category?: Category;
    createdAt: string;
    updatedAt: string;
}

export interface InventoryItem {
    id: string;
    quantity: number;
    item: Item;
    warehouse: any;
    status: 'available' | 'reserved' | 'damaged' | 'in_transit';
}

export interface RegisterItemDTO {
    name: string;
    sku: string;
    description?: string;
    basePrice: number;
    unit: string;
    categoryId?: string;
}

export interface StoreItemDTO {
    itemId: string;
    warehouseId: string;
    quantity: number;
    storageLocationId?: string;
}

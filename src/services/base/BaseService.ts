
export interface CRUDOperations<T, CreateData = Omit<T, 'id' | 'created_at' | 'updated_at'>, UpdateData = Partial<T>> {
  // Create
  create(data: CreateData): Promise<T>;
  
  // Read
  fetchAll(options?: any): Promise<T[]>;
  fetchById(id: string): Promise<T | null>;
  
  // Update
  update(id: string, data: UpdateData): Promise<T>;
  
  // Delete
  delete(id: string): Promise<void>;
}

export interface ServiceOptions {
  limit?: number;
  offset?: number;
  search?: string;
  filters?: Record<string, any>;
}

export abstract class BaseService {
  protected simulateDelay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected handleError(error: any, operation: string): never {
    console.error(`Error in ${operation}:`, error);
    throw new ServiceError(
      error.message || `Erro ao ${operation}`,
      error.code || 'UNKNOWN_ERROR',
      operation
    );
  }

  protected validateRequired(data: any, fields: string[]): void {
    const missing = fields.filter(field => !data[field]);
    if (missing.length > 0) {
      throw new ServiceError(
        `Campos obrigatórios: ${missing.join(', ')}`,
        'VALIDATION_ERROR',
        'validation'
      );
    }
  }

  protected generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public operation: string
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

// src/models/baseModel.ts
import { knex } from '../config/database';
import { Model } from 'objection';

// Base model class with soft delete functionality
export class BaseModel extends Model {
  // Add deletedAt column to all models
  deletedAt?: Date | null;

  // Override the default delete behavior
  static get modifiers() {
    return {
      notDeleted(builder: any) {
        builder.whereNull('deleted_at');
      },
      withDeleted(builder: any) {
        // No constraint - includes all records
      },
      onlyDeleted(builder: any) {
        builder.whereNotNull('deleted_at');
      },
    };
  }

  // Soft delete implementation
  static async softDeleteById(id: string | number) {
    try {
      const result = await this.query()
        .findById(id)
        .patch({ deletedAt: new Date() });

      if (!result) {
        throw new Error('Record not found');
      }

      return result;
    } catch (error) {
      throw new Error(`Soft delete failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Restore soft deleted record
  static async restoreById(id: string | number) {
    try {
      const result = await this.query()
        .findById(id)
        .patch({ deletedAt: null });

      if (!result) {
        throw new Error('Record not found');
      }

      return result;
    } catch (error) {
      throw new Error(`Restore failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // Force delete (permanent removal)
  static async forceDeleteById(id: string | number) {
    try {
      const result = await this.query()
        .deleteById(id);

      if (!result) {
        throw new Error('Record not found');
      }

      return result;
    } catch (error) {
      throw new Error(`Force delete failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Apply the soft delete filter by default for all queries
BaseModel.QueryBuilder = class extends Model.QueryBuilder {
  constructor(modelClass: any) {
    super(modelClass);
    this.onBuild((builder) => {
      if (!builder.context().withDeleted) {
        builder.modify('notDeleted');
      }
    });
  }
};

import { AppDataSource } from '../config/data-source.ts';
import { ActivityLog } from '../entities/ActivityLog.ts';

export class ActivityLogService {
    private logRepository = AppDataSource.getRepository(ActivityLog);

    async log(userId: string, entityType: string, entityId: string, action: string, metadata?: any) {
        const log = this.logRepository.create({
            performedByUserId: userId,
            entityType,
            entityId,
            action,
            metadata
        });
        return await this.logRepository.save(log);
    }

    async getLogsByEntity(entityType: string, entityId: string) {
        return await this.logRepository.find({
            where: { entityType, entityId },
            relations: ['performedBy'],
            order: { createdAt: 'DESC' }
        });
    }
}

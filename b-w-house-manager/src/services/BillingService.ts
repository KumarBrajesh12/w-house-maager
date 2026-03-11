import { AppDataSource } from '../config/data-source.ts';
import { Invoice, InvoiceStatus } from '../entities/Invoice.ts';
import { InvoiceItem } from '../entities/InvoiceItem.ts';
import { CustomerRental } from '../entities/CustomerRental.ts';
import { PricingPlan } from '../entities/PricingPlan.ts';

export class BillingService {
    private invoiceRepository = AppDataSource.getRepository(Invoice);
    private invoiceItemRepository = AppDataSource.getRepository(InvoiceItem);
    private rentalRepository = AppDataSource.getRepository(CustomerRental);

    async generateInvoice(customerId: string, startDate: Date, endDate: Date, tenantId: string) {
        return await AppDataSource.transaction(async transactionalEntityManager => {
            // Find active or ended rentals in the period
            const rentals = await transactionalEntityManager.find(CustomerRental, {
                where: { customerId },
                relations: ['pricingPlan']
            });

            let totalAmount = 0;
            const invoiceItemsData: any[] = [];

            for (const rental of rentals) {
                // Calculate days charged in this period
                const periodStart = rental.startDate > startDate ? rental.startDate : startDate;
                const periodEnd = (rental.endDate && rental.endDate < endDate) ? rental.endDate : endDate;

                if (periodEnd > periodStart) {
                    const days = Math.ceil((periodEnd.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24));
                    const amount = days * Number(rental.pricingPlan.pricePerDay);
                    totalAmount += amount;

                    invoiceItemsData.push({
                        rentalId: rental.id,
                        daysCharged: days,
                        amount: amount
                    });
                }
            }

            if (invoiceItemsData.length === 0) return null;

            // Create Invoice
            const invoice = this.invoiceRepository.create({
                customerId,
                billingPeriodStart: startDate,
                billingPeriodEnd: endDate,
                totalAmount,
                status: InvoiceStatus.UNPAID,
                tenantId
            });
            const savedInvoice = await transactionalEntityManager.save(Invoice, invoice);

            // Create Invoice Items
            const items: InvoiceItem[] = [];
            for (const data of invoiceItemsData) {
                const item = this.invoiceItemRepository.create({
                    invoiceId: savedInvoice.id,
                    rentalId: data.rentalId,
                    daysCharged: data.daysCharged,
                    amount: data.amount
                });
                items.push(item);
            }
            await transactionalEntityManager.save(items);

            return savedInvoice;
        });
    }

    async getCustomerInvoices(customerId: string, tenantId: string) {
        return await this.invoiceRepository.find({
            where: { customerId, tenantId },
            relations: ['items']
        });
    }
}

import { Hono } from 'hono';
import * as warehouseController from '../controllers/warehouse.controller.ts';

const warehouseRoutes = new Hono();

warehouseRoutes.get('/', warehouseController.getAllWarehouses);
warehouseRoutes.post('/', warehouseController.createWarehouse);
warehouseRoutes.get('/:warehouseId', warehouseController.getWarehouseHierarchy);
warehouseRoutes.post('/:warehouseId/zones', warehouseController.addZone);
warehouseRoutes.post('/zones/:zoneId/racks', warehouseController.addRack);
warehouseRoutes.post('/racks/:rackId/slots', warehouseController.addSlot);

export default warehouseRoutes;

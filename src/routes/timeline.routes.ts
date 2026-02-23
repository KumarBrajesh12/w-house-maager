import { Hono } from 'hono';
import * as timelineController from '../controllers/timeline.controller.ts';
import { jwt } from 'hono/jwt';

const timelineRoutes = new Hono();

const secret = process.env.JWT_SECRET || "supersecretkey123";
timelineRoutes.use('/*', jwt({ secret, alg: 'HS256' }));

timelineRoutes.get('/:type/:id', timelineController.getEntityTimeline);

export default timelineRoutes;

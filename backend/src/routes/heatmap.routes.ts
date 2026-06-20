import { Router } from 'express';
import { getHeatmap } from '../controllers/heatmap.controller';

export const heatmapRouter = Router();

heatmapRouter.get('/', getHeatmap);

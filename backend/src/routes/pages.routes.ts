import { Router } from 'express';
import { listPages } from '../controllers/pages.controller';

export const pagesRouter = Router();

pagesRouter.get('/', listPages);

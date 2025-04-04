import { Router } from 'express';

const routes = Router();

routes.get('/', () => {
  console.log('Connected !');
});

export default routes;
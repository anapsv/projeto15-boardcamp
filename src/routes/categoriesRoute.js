import { Router } from "express";
import { loadCategories, addNewCategory, } from "../controllers/categoriesController.js";
import { ValidateCategory } from "../middlewares/categoriesMiddleware.js";
  
  const router = Router();
  
  router.get('/categories', loadCategories);
  router.post('/categories', ValidateCategory, addNewCategory);
  
  export default router;
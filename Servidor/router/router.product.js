import express from "express";
import {getProductMes, getproducts} from '../controller/product.js'
const router = express.Router();
router.get('/products/data', getProductMes)
router.get('/products', getproducts)
export default router
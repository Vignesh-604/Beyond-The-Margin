import { Router } from "express"
import {
    addCategory, addSubcategories, updateCategory, deleteCategoryOrSubcategory, getAllCategories
} from "../controllers/category.controller.js";

const router = Router()

router.post("/", addCategory)
router.get("/", getAllCategories)
router.post("/sub", addSubcategories)
router.put("/:categoryId", updateCategory)
router.delete("/:categoryId", deleteCategoryOrSubcategory)

export default router

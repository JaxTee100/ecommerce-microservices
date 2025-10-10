// routes/productRoutes.ts
import { Router } from "express";
import { create, list, getOne, update, adjust, remove } from "../controllers/productController";
import { upload } from "../middlewares/uploadMiddleware";

const router = Router();

router.post("/",upload.array('images', 5), create);
router.get("/", list);
router.get("/:id", getOne);
router.put("/:id", upload.array('images', 5), update);
router.patch("/:id/quantity", adjust);
router.delete("/:id", remove);

export default router;

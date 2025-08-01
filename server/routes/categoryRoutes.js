import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

router.post("/", async (req, res) => {
  const category = new Category(req.body);
  const savedCategory = await category.save();
  res.status(201).json(savedCategory);
});

export default router;

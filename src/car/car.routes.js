import { Router } from "express";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRoles } from "../middlewares/validate-roles.js";
import { createCar, getCars, getCarById, updateCar, deleteCar } from "./car.controller.js";
import { createCarValidator, updateCarValidator, getCarByIdValidator } from "../middlewares/car-validator.js";
import { uploadPlateCar } from "../middlewares/multer-uploads.js"; 


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Operaciones relacionadas con los autos
 */

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Crear un nuevo auto
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plate:
 *                 type: string
 *                 description: Placa del auto
 *               status:
 *                 type: boolean
 *                 description: Estado del auto
 *     responses:
 *       201:
 *         description: Auto creado exitosamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error al crear el auto
 */
router.post(
  "/",
  uploadPlateCar, // Cambiado a 'plateCar' para coincidir con el campo enviado
  createCarValidator,
  createCar
);


/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Obtener todos los autos
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Lista de autos obtenida exitosamente
 *       500:
 *         description: Error al obtener los autos
 */
router.get("/", getCars);

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Obtener un auto por ID
 *     tags: [Cars]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto
 *     responses:
 *       200:
 *         description: Auto obtenido exitosamente
 *       404:
 *         description: Auto no encontrado
 *       500:
 *         description: Error al obtener el auto
 */
router.get("/:id", getCarByIdValidator, getCarById);

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Actualizar un auto por ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               plate:
 *                 type: string
 *                 description: Placa del auto
 *               status:
 *                 type: boolean
 *                 description: Estado del auto
 *     responses:
 *       200:
 *         description: Auto actualizado exitosamente
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Auto no encontrado
 *       500:
 *         description: Error al actualizar el auto
 */
router.put(
  "/:id",
  validateJWT,
  hasRoles("ADMIN"),
  updateCarValidator,
  updateCar
);

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Eliminar un auto por ID
 *     tags: [Cars]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del auto
 *     responses:
 *       200:
 *         description: Auto eliminado exitosamente
 *       404:
 *         description: Auto no encontrado
 *       500:
 *         description: Error al eliminar el auto
 */
router.delete("/:id", validateJWT, hasRoles("ADMIN"), deleteCar);

export default router;

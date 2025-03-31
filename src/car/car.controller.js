import { admin } from "../../configs/firebase.js";
import { uploadToCloudinary } from "../middlewares/multer-uploads.js";

const db = admin.firestore();

// Helper to remove undefined properties
const removeUndefined = (obj) => Object.fromEntries(
  Object.entries(obj).filter(([_, v]) => v !== undefined)
);

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
export const createCar = async (req, res) => {
  try {
    const { plate, status } = req.body;
    let photo = req.file ? await uploadToCloudinary(req, 'cars') : null;
    const entryTime = new Date();
    // Filter out any undefined fields
    const carData = removeUndefined({ plate, status, photo, entryTime });
    const docRef = await db.collection("cars").add(carData);
    res.status(201).json({ message: "Car created successfully", car: { id: docRef.id, ...carData } });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ message: "Error creating car", error: error.message });
  }
};

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
export const getCars = async (req, res) => {
  try {
    const snapshot = await db.collection("cars").get();
    const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars", error: error.message });
  }
};

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
export const getCarById = async (req, res) => {
  try {
    const doc = await db.doc(`cars/${req.params.id}`).get();
    if (!doc.exists) return res.status(404).json({ message: "Car not found" });
    res.status(200).json({ message: "Car fetched successfully", car: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ message: "Error fetching car", error: error.message });
  }
};

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Actualizar un auto por ID
 *     tags: [Cars]
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
export const updateCar = async (req, res) => {
  try {
    const carRef = db.doc(`cars/${req.params.id}`);
    // Filter out undefined properties in update data
    const updateData = removeUndefined(req.body);
    await carRef.update(updateData);
    const updatedDoc = await carRef.get();
    res.status(200).json({ message: "Car updated successfully", car: { id: updatedDoc.id, ...updatedDoc.data() } });
  } catch (error) {
    res.status(500).json({ message: "Error updating car", error: error.message });
  }
};

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Eliminar un auto por ID
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
 *         description: Auto eliminado exitosamente
 *       404:
 *         description: Auto no encontrado
 *       500:
 *         description: Error al eliminar el auto
 */
export const deleteCar = async (req, res) => {
  try {
    const carRef = db.doc(`cars/${req.params.id}`);
    const doc = await carRef.get();
    if (!doc.exists) return res.status(404).json({ message: "Car not found" });
    await carRef.delete();
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car", error: error.message });
  }
};

import { body, param } from "express-validator";
import { validarCampos } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

// Validador para crear un carro
export const createCarValidator = [
  body("plate")
    .notEmpty().withMessage("La placa es requerida.")
    .isString().withMessage("La placa debe ser una cadena de caracteres.")
    .trim(),
  body("status")
    .optional()
    .isBoolean().withMessage("El estado debe ser booleano."),
  validarCampos,
  handleErrors,
];

// Validador para actualizar un carro
export const updateCarValidator = [
  body("plate")
    .optional()
    .isString().withMessage("La placa debe ser una cadena de caracteres.")
    .trim(),
  body("status")
    .optional()
    .isBoolean().withMessage("El estado debe ser booleano."),
  validarCampos,
  handleErrors,
];

// Validador para obtener un carro por ID
export const getCarByIdValidator = [
  param("id")
    .isMongoId().withMessage("No es un ID válido de MongoDB"),
  validarCampos,
  handleErrors,
];

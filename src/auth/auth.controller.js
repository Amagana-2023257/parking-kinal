// src/auth/auth.controller.js
import { admin } from '../../configs/firebase.js';
import { validationResult } from 'express-validator';
import { generateJWT } from '../helpers/generate-jwt.js';
import { handleErrorResponse } from '../helpers/handleResponse.js';
import { uploadToCloudinary } from '../middlewares/multer-uploads.js';

export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleErrorResponse(res, 400, 'Validation error', errors.array());
  }
  
  try {
    const { email, name, username, password } = req.body;
    
    let profilePicture = 'https://placehold.co/40x40?text=User';
    if (req.file) {
      profilePicture = await uploadToCloudinary(req, 'profile-pictures');
    }
    
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      email,
      name,
      username,
      profilePicture,
      role: 'USER',
      status: true,
      createdAt: new Date().toISOString(),
    });
    
    return res.status(201).json({
      success: true,
      message: 'Usuario creado con éxito',
      userDetails: {
        uid: userRecord.uid,
        email,
        name,
        username,
        profilePicture,
      },
    });
  } catch (err) {
    console.error('Error en el registro:', err);
    return handleErrorResponse(res, 500, 'Error en el registro del usuario', err.message);
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return handleErrorResponse(res, 400, 'Validation error', errors.array());
  }
  
  const { email, password } = req.body;
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    
    const token = await generateJWT(userRecord.uid);
    
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return handleErrorResponse(res, 404, 'Usuario no encontrado');
    }
    
    const userData = userDoc.data();
    
    return res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      userDetails: {
        token,
        uid: userRecord.uid,
        email: userData.email,
        name: userData.name,
        username: userData.username,
        profilePicture: userData.profilePicture || 'https://placehold.co/40x40?text=User',
      },
    });
  } catch (err) {
    console.error('Error al iniciar sesión:', err);
    return handleErrorResponse(res, 500, 'Error al iniciar sesión', err.message);
  }
};
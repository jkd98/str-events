import express from "express";
import {
    crearEvento,
    listarEventos,
    obtenerEvento,
    editarEvento,
    eliminarEvento,
    agregarParticipante,
    anularReserva,
    cambiarEstadoPublicado,
    buscarEventos,
    suscripcion
} from "../controllers/eventtController.js";
import guardia from '../middleware/guardiaRuta.js'; 
import checkRole from "../middleware/checkRole.js";
import upload from "../middleware/procesarImage.js";

const router = express.Router();

// URL: http://localhost:4222/events

router.post('/', guardia, checkRole('4DMlN'), upload.single('image'), crearEvento);
router.get('/', listarEventos);
router.get('/buscar', buscarEventos);

router.patch('/:id/publicar', guardia, checkRole('4DMlN'), cambiarEstadoPublicado);

router.get('/:id', obtenerEvento);
router.put('/:id', guardia , checkRole('4DMlN'), upload.single('image'),editarEvento);
// Ruta para alternar published
router.delete('/:id', eliminarEvento);

// Añadir participante al evento
router.post('/:idEvento/participantes', agregarParticipante);

// Anular reservación de un evento
router.delete('/:idEvento/participantes', anularReserva);

//Para sub
router.post('/suscrip', suscripcion);

export default router;

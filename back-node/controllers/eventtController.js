import Eventt from "../models/Eventt.js";
import Usuario from "../models/Usuario.js";
import AreaInteres from '../models/AreaInteres.js';
import Suscripcion from "../models/Suscripcion.js";

class Respuesta {
    status = '';
    msg = '';
    data = null;
}

// Crear evento
const crearEvento = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { date } = req.body;
        console.log(req.body);

        // Validar fecha
        // Validación 2: la fecha nueva no puede estar en el pasado
        if (date) {
            const nuevaFecha = new Date(date);
            nuevaFecha.setHours(0, 0, 0, 0);

            const hoyTimestamp = new Date();
            hoyTimestamp.setHours(0, 0, 0, 0);

            if (isNaN(nuevaFecha.getTime()) || nuevaFecha.getTime() < hoyTimestamp.getTime()) {
                respuesta.status = 'error';
                respuesta.msg = 'La fecha del evento debe estar en el futuro.';
                return res.status(400).json(respuesta);
            }
        }

        const nombreEvento = req.body.eventName?.trim().toLowerCase();
        const eventoExistente = await Eventt.findOne({
            eventName: { $regex: new RegExp(`^${nombreEvento}$`, 'i') }
        });

        if (eventoExistente) {
            respuesta.status = 'error';
            respuesta.msg = 'Ya existe un evento con ese nombre.';
            return res.status(400).json(respuesta);
        }

        const nuevoEvento = new Eventt({
            ...req.body,
            createdBy: req.usuario._id,
            image: req.file ? req.file.filename : null  // <-- acá guardas el nombre del archivo
        });

        await nuevoEvento.save();

        respuesta.status = 'success';
        respuesta.msg = 'Evento creado correctamente';
        respuesta.data = nuevoEvento;
        res.status(201).json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al crear el evento';
        res.status(400).json(respuesta);
    }
};

// Obtener todos los eventos
const listarEventos = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const eventos = await Eventt.find()
            .populate('city')
            .populate('areaInteres')
            .populate('participants', '-pass -token');

        respuesta.status = 'success';
        respuesta.msg = 'Eventos listados correctamente';
        respuesta.data = eventos;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al listar eventos';
        res.status(500).json(respuesta);
    }
};

// Obtener un evento por ID
const obtenerEvento = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.params;
        const evento = await Eventt.findById(id)
            .populate('city')
            .populate('areaInteres')
            .populate('participants', '-pass -token');

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Evento encontrado';
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al obtener el evento';
        res.status(500).json(respuesta);
    }
};

// Actualizar un evento
const editarEvento = async (req, res) => {
    let respuesta = new Respuesta();
    console.log(req.usuario);
    console.log(req.body);
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;

        const evento = await Eventt.findById(id);

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        if (evento.createdBy.toString() !== req.usuario._id.toString()) {
            respuesta.status = 'error';
            respuesta.msg = 'No puedes modificar eventos de otro usuario';
            return res.status(403).json(respuesta);
        }

        // Validación 1: maxCapacity no menor que los participantes actuales
        if (nuevosDatos.maxCapacity !== undefined && nuevosDatos.maxCapacity < evento.participants.length) {
            respuesta.status = 'error';
            respuesta.msg = `No puedes reducir la capacidad a menos de ${evento.participants.length} participantes existentes.`;
            return res.status(400).json(respuesta);
        }

        // Validación 2: la fecha nueva no puede estar en el pasado
        if (nuevosDatos.date) {
            const nuevaFecha = new Date(nuevosDatos.date);
            nuevaFecha.setHours(0, 0, 0, 0);

            const hoyTimestamp = new Date();
            hoyTimestamp.setHours(0, 0, 0, 0);

            if (isNaN(nuevaFecha.getTime()) || nuevaFecha.getTime() < hoyTimestamp.getTime()) {
                respuesta.status = 'error';
                respuesta.msg = 'La fecha del evento debe estar en el futuro.';
                return res.status(400).json(respuesta);
            }
        }



        // Actualización parcial
        evento.eventName = nuevosDatos.eventName ? nuevosDatos.eventName : evento.eventName;
        evento.date = nuevosDatos.date ? nuevosDatos.date : evento.date;
        evento.city = nuevosDatos.city ? nuevosDatos.city : evento.city;
        evento.areaInteres = nuevosDatos.areaInteres ? nuevosDatos.areaInteres : evento.areaInteres;
        evento.category = nuevosDatos.category ? nuevosDatos.category : evento.category;
        evento.maxCapacity = nuevosDatos.maxCapacity ? nuevosDatos.maxCapacity : evento.maxCapacity;
        evento.image = req.file ? req.file.filename : evento.image;

        await evento.save();

        respuesta.status = 'success';
        respuesta.msg = 'Evento actualizado correctamente';
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al actualizar el evento';
        res.status(500).json(respuesta);
    }
};

// Eliminar evento
const eliminarEvento = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.params;
        const evento = await Eventt.findByIdAndDelete(id);

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        respuesta.status = 'success';
        respuesta.msg = 'Evento eliminado correctamente';
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al eliminar el evento';
        res.status(500).json(respuesta);
    }
};

// Añadir participante a un evento
const agregarParticipante = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { idEvento } = req.params;
        const { idUsuario } = req.body;

        console.log(idUsuario, idEvento);
        const evento = await Eventt.findById(idEvento);

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        const usuario = await Usuario.findById(idUsuario);
        if (!usuario) {
            respuesta.status = 'error';
            respuesta.msg = 'Usuario no encontrado';
            return res.status(404).json(respuesta);
        }

        if (evento.participants.includes(idUsuario)) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario ya está registrado en el evento';
            return res.status(400).json(respuesta);
        }

        if (evento.participants.length >= evento.maxCapacity) {
            respuesta.status = 'error';
            respuesta.msg = 'El evento ya alcanzó su capacidad máxima';
            return res.status(400).json(respuesta);
        }

        evento.participants.push(idUsuario);
        await evento.save();

        respuesta.status = 'success';
        respuesta.msg = 'Participante añadido correctamente';
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al añadir participante';
        res.status(500).json(respuesta);
    }
};

// Anular reservación de un evento
const anularReserva = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { idEvento } = req.params;
        const { idUsuario } = req.body;

        const evento = await Eventt.findById(idEvento);

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        if (!evento.participants.includes(idUsuario)) {
            respuesta.status = 'error';
            respuesta.msg = 'El usuario no está registrado en este evento';
            return res.status(400).json(respuesta);
        }

        evento.participants = evento.participants.filter(
            (id) => id.toString() !== idUsuario
        );

        await evento.save();

        respuesta.status = 'success';
        respuesta.msg = 'Reservación anulada correctamente';
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al anular la reservación';
        res.status(500).json(respuesta);
    }
};

// Cambiar el estado de publicación del evento
const cambiarEstadoPublicado = async (req, res) => {
    let respuesta = new Respuesta();

    try {
        const { id } = req.params;
        const evento = await Eventt.findById(id)
            .populate('city')
            .populate('areaInteres')
            .populate('participants', '-pass -token');;

        if (!evento) {
            respuesta.status = 'error';
            respuesta.msg = 'Evento no encontrado';
            return res.status(404).json(respuesta);
        }

        // Verifica que el usuario que solicita sea el creador
        if (evento.createdBy.toString() !== req.usuario._id.toString()) {
            respuesta.status = 'error';
            respuesta.msg = 'No puedes modificar eventos de otro usuario';
            return res.status(403).json(respuesta);
        }

        // Cambiar published a lo contrario de lo que estaba
        evento.published = !evento.published;
        await evento.save();

        respuesta.status = 'success';
        respuesta.msg = `Evento ${evento.published ? 'publicado' : 'oculto'} correctamente`;
        respuesta.data = evento;
        res.json(respuesta);

    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al cambiar el estado de publicación';
        res.status(500).json(respuesta);
    }
};

//filtro
const buscarEventos = async (req, res) => {
    const { nombre, areaInteres, category } = req.query;
    let respuesta = {
        status: '',
        msg: '',
        data: null
    };

    try {
        const filtros = {};

        // Filtro por nombre del evento (insensible a tildes y mayúsculas)
        if (nombre) {
            const nombreNormalizado = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            filtros.eventName = {
                $regex: new RegExp(nombreNormalizado, 'i')
            };
        }

        // Filtro por categoría exacta
        if (category) {
            filtros.category = category;
        }

        // Si se proporciona un nombre de área, buscar el _id de esa área
        if (areaInteres) {
            const area = await AreaInteres.findOne({
                name: {
                    $regex: new RegExp(areaInteres, 'i') // ignora mayúsculas y tildes
                }
            });

            if (area) {
                filtros.areaInteres = area._id;
            } else {
                // Si no se encuentra el área, retornar vacío
                respuesta.status = 'success';
                respuesta.msg = 'No se encontró el área de interés especificada';
                respuesta.data = [];
                return res.json(respuesta);
            }
        }

        const eventos = await Eventt.find(filtros)
            .populate('city')
            .populate('areaInteres')
            .populate('participants', '-pass -token');

        respuesta.status = 'success';
        respuesta.msg = 'Eventos encontrados';
        respuesta.data = eventos;
        res.json(respuesta);

    } catch (error) {
        console.error(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al buscar eventos';
        res.status(500).json(respuesta);
    }
};

const suscripcion = async (req, res) => {
    let respuesta = {
        status: '',
        msg: '',
        data: null
    };

    try {
        const { email } = req.body;
        const user = await Usuario.findOne({ email });
        console.log(user);
        if (!user) {
            respuesta.status = 'error';
            respuesta.msg = 'No se econtró al usuario';
            return res.status(400).json(respuesta);
        }

        const isSuscript = await Suscripcion.findOne({user:user._id}).populate('user');
        console.log(isSuscript);
        if (isSuscript) {
            respuesta.status = 'error';
            respuesta.msg = 'Esta cuenta ya esta suscrita';
            return res.status(400).json(respuesta);
        }

        const susc = new Suscripcion({ user: user._id });
        await susc.save();

        respuesta.status = 'success';
        respuesta.msg = 'Suscripcion exitosa';
        respuesta.data = susc;
        return res.status(201).json(respuesta);
    } catch (error) {
        console.log(error);
        respuesta.status = 'error';
        respuesta.msg = 'Error al suscribirse';
        return res.status(400).json(respuesta);
    }
}


export {
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
};

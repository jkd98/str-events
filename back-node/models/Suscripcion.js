import mongoose from "mongoose";

const suscripcionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
            validate: {
                validator: async function (userId) {
                    const user = await mongoose.model("Usuario").findById(userId);
                    return user !== null;
                },
                message: "User does not exist.",
            },
        },
    },
    {
        timestamps: true,
    }
);

const Suscripcion = mongoose.model("Suscripcion", suscripcionSchema, "suscripciones");

export default Suscripcion;

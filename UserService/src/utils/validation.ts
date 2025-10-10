import Joi from 'joi';

interface RegistrationData {
    name: string;
    email: string;
    password: string;
}
interface LoginData {
    email: string;
    password: string;
}

const validateRegistration = (data: RegistrationData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(50).required(),
        role: Joi.string().valid('user', 'admin', 'superadmin').default('user')
    });
    return schema.validate(data);
}


const validateLogin = (data:LoginData) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(50).required(),
    
    });
    return schema.validate(data);
    }
export { validateRegistration, validateLogin };
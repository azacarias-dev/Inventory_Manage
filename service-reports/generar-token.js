import jwt from 'jsonwebtoken';

const token = jwt.sign(
    { id: '123', nombre: 'Test' },
    'tu-clave-secreta',
    { expiresIn: '1h' }
);

console.log(token);
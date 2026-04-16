import Fastify from 'fastify';
import path from 'path';
import formbody from '@fastify/formbody';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import pug from 'pug';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify();

let users = [
  { id: 1, name: 'Маша', email: 'masha@mail.com' },
  { id: 2, name: 'Петя', email: 'Petya@mail.com' }
];
fastify.register(formbody);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.register(fastifyView, {
  engine: { pug },
  root: path.join(__dirname, 'views'),
});

fastify.get('/users', (req, reply) => {
  return reply.view('users.pug', { users });
});

fastify.get('/users/create', (req, reply) => {
  return reply.view('create.pug');
});

fastify.post('/users', async (req, reply) => {
  const { name, email } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  return reply.redirect('/users');
});

fastify.listen({ port: 3000 }, () => {
  console.log('Server running on http://localhost:3000');
});

fastify.get('/', (req, reply) => {
  return reply.redirect('/users');
});
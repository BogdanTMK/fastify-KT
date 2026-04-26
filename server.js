import Fastify from 'fastify';
import path from 'path';
import formbody from '@fastify/formbody';
import { fileURLToPath } from 'url';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import pug from 'pug';
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fastify = Fastify();

fastify.register(formbody);
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});

fastify.register(fastifyView, {
  engine: { pug },
  root: path.join(__dirname, 'views'),
});


fastify.get('/', (req, reply) => {
  return reply.redirect('/users');
});


fastify.get('/users', (req, reply) => {
  const users = getAllUsers();
  return reply.view('users.pug', { users });
});

fastify.get('/users/create', (req, reply) => {
  return reply.view('create.pug');
});


fastify.post('/users', async (req, reply) => {
  const { name, email } = req.body;

  try {
    createUser(name, email);
    return reply.redirect('/users');
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    return reply.view('create.pug', { error: 'Пользователь с таким email уже существует' });
  }
});


fastify.get('/users/:id/edit', (req, reply) => {
  const user = getUserById(req.params.id);
  
  if (!user) {
    return reply.code(404).send('Пользователь не найден');
  }
  
  return reply.view('edit.pug', { user });
});


fastify.post('/users/:id/update', async (req, reply) => {
  const { name, email } = req.body;
  const { id } = req.params;

  try {
    updateUser(id, name, email);
    return reply.redirect('/users');
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    const user = getUserById(id);
    return reply.view('edit.pug', { user, error: 'Пользователь с таким email уже существует' });
  }
});


fastify.post('/users/:id/delete', async (req, reply) => {
  const { id } = req.params;
  
  try {
    deleteUser(id);
    return reply.redirect('/users');
  } catch (error) {
    console.error('Ошибка удаления пользователя:', error);
    return reply.code(500).send('Ошибка при удалении пользователя');
  }
});

fastify.listen({ port: 3000 }, () => {
  console.log('Server running on http://localhost:3000');
  console.log('База данных SQLite подключена');
});

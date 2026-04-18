import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { PROVIDERS_LIST } from '@consumet/extensions';

import gogoanime from './gogoanime';
import animepahe from './animepahe';
import animelek from './animelek'; // السطر المضاف للربط

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  await fastify.register(gogoanime, { prefix: '/' });
  await fastify.register(animepahe, { prefix: '/' });
  await fastify.register(animelek, { prefix: '/' }); // السطر المضاف للتسجيل

  fastify.get('/', async (request: any, reply: any) => {
    reply.status(200).send('Welcome to Consumet Anime API 🗾 (Arabic Support Enabled)');
  });

  fastify.get('/:animeProvider', async (request: FastifyRequest, reply: FastifyReply) => {
    const queries: { animeProvider: string; page: number } = {
      animeProvider: '',
      page: 1,
    };

    queries.animeProvider = decodeURIComponent(
      (request.params as { animeProvider: string; page: number }).animeProvider
    );

    queries.page = (request.query as { animeProvider: string; page: number }).page;

    if (queries.page! < 1) queries.page = 1;

    const provider = PROVIDERS_LIST.ANIME.find(
      (p: any) => p.toString().name.toLowerCase() === queries.animeProvider.toLowerCase()
    );

    try {
      if (provider) {
        reply.redirect(`/anime/${queries.animeProvider}`);
      } else {
        reply
         .status(404)
         .send({ message: 'Provider not found, please check the providers list.' });
      }
    } catch (err) {
      reply.status(500).send('Something went wrong. Please try again later.');
    }
  });
};

export default routes;

import { FastifyRequest, FastifyReply, FastifyInstance, RegisterOptions } from 'fastify';
import { ANIME } from '@consumet/extensions';

const routes = async (fastify: FastifyInstance, options: RegisterOptions) => {
  // إنشاء نسخة من محرك أنمي ليك العربي
  const animelek = new ANIME.AnimeLek();

  fastify.get('/animelek', (_, rp) => {
    rp.status(200).send({
      intro: "Welcome to the AnimeLek provider (Arabic Support).",
      routes: [
        '/:query',
        '/info/:id',
        '/watch/:episodeId',
      ],
      documentation: 'https://docs.consumet.org/',
    });
  });

  // مسار البحث
  fastify.get(
    '/animelek/:query',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = (request.params as { query: string }).query;
      const res = await animelek.search(query);
      reply.status(200).send(res);
    }
  );

  // مسار معلومات الأنمي والحلقات
  fastify.get(
    '/animelek/info/:id',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const id = decodeURIComponent((request.params as { id: string }).id);
      try {
        const res = await animelek.fetchAnimeInfo(id);
        reply.status(200).send(res);
      } catch (err) {
        reply.status(404).send({ message: "Anime not found or site is down." });
      }
    }
  );

  // مسار استخراج روابط البث
  fastify.get(
    '/animelek/watch/:episodeId',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const episodeId = (request.params as { episodeId: string }).episodeId;
      try {
        const res = await animelek.fetchEpisodeSources(episodeId);
        reply.status(200).send(res);
      } catch (err) {
        reply.status(500).send({ message: 'Error extracting video links.' });
      }
    }
  );
};

export default routes;
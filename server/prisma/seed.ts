import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.like.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.user.deleteMany({});

  const alice = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: 'motdepasseAlice',
      name: 'Alice',
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: 'bob@example.com',
      password: 'motdepasseBob',
      name: 'Bob',
    },
  });

  const article1 = await prisma.article.create({
    data: {
      title: 'Premier Article',
      content: 'Contenu du premier article',
      author: {
        connect: { id: alice.id },
      },
    },
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Deuxième Article',
      content: 'Contenu du deuxième article',
      author: {
        connect: { id: bob.id },
      },
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      content: 'Super article !',
      author: {
        connect: { id: bob.id },
      },
      article: {
        connect: { id: article1.id },
      },
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: 'Merci pour le partage',
      author: {
        connect: { id: alice.id },
      },
      article: {
        connect: { id: article2.id },
      },
    },
  });

  const like1 = await prisma.like.create({
    data: {
      user: {
        connect: { id: bob.id },
      },
      article: {
        connect: { id: article1.id },
      },
    },
  });

  const like2 = await prisma.like.create({
    data: {
      user: {
        connect: { id: alice.id },
      },
      article: {
        connect: { id: article2.id },
      },
    },
  });

  console.log('Seed terminé avec succès !');
}

main()
  .catch((error) => {
    console.error('Erreur lors du seed :', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Enums
enum Role {
  CUSTOMER = 'CUSTOMER',
  CHEF = 'CHEF',
  ADMIN = 'ADMIN',
}

enum DishType {
  READY = 'READY',
  ALACARTE = 'ALACARTE',
}

enum OrderStatus {
  NEW = 'NEW',
  PREPARING = 'PREPARING',
  READY = 'READY',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

enum PaymentMethod {
  MOCK = 'MOCK',
  STRIPE = 'STRIPE',
  PAGSEGURO = 'PAGSEGURO',
}

async function main() {
  console.log('🌱 Seeding database...');

  // Limpar dados existentes
  await prisma.rating.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.menuCategory.deleteMany();
  await prisma.dish.deleteMany();
  await prisma.chef.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  // Hash de senha padrão
  const hashedPassword = await bcrypt.hash('123456', 10);

  // 1. Criar usuários (3 chefs, 2 clientes)
  const userChef1 = await prisma.user.create({
    data: {
      email: 'maria@chef.com',
      passwordHash: hashedPassword,
      role: Role.CHEF,
    },
  });

  const chef1 = await prisma.chef.create({
    data: {
      userId: userChef1.id,
      kitchenName: 'Cozinha da Maria',
      bio: 'Especialista em culinária brasileira com 15 anos de experiência. Formada pelo Senac SP.',
      cuisineTypes: ['Brasileira', 'Regional'],
      location: 'São Paulo, SP',
      approved: true,
    },
  });

  const userChef2 = await prisma.user.create({
    data: {
      email: 'joao@chef.com',
      passwordHash: hashedPassword,
      role: Role.CHEF,
    },
  });

  const chef2 = await prisma.chef.create({
    data: {
      userId: userChef2.id,
      kitchenName: 'Cantina do João',
      bio: 'Chef italiano com paixão por massas artesanais e molhos tradicionais.',
      cuisineTypes: ['Italiana', 'Massas'],
      location: 'São Paulo, SP',
      approved: true,
    },
  });

  const userChef3 = await prisma.user.create({
    data: {
      email: 'ana@chef.com',
      passwordHash: hashedPassword,
      role: Role.CHEF,
    },
  });

  const chef3 = await prisma.chef.create({
    data: {
      userId: userChef3.id,
      kitchenName: 'Ana Vegan Kitchen',
      bio: 'Especialista em culinária oriental e vegana. Ingredientes orgânicos e sazonais.',
      cuisineTypes: ['Oriental', 'Vegana'],
      location: 'São Paulo, SP',
      approved: true,
    },
  });

  const userCustomer1 = await prisma.user.create({
    data: {
      email: 'carlos@cliente.com',
      passwordHash: hashedPassword,
      role: Role.CUSTOMER,
    },
  });

  const customer1 = await prisma.customer.create({
    data: {
      userId: userCustomer1.id,
      defaultAddress: 'Rua dos Pinheiros, 200 - São Paulo, SP',
    },
  });

  const userCustomer2 = await prisma.user.create({
    data: {
      email: 'lucia@cliente.com',
      passwordHash: hashedPassword,
      role: Role.CUSTOMER,
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      userId: userCustomer2.id,
      defaultAddress: 'Alameda Santos, 300 - São Paulo, SP',
    },
  });

  console.log('✅ Usuários criados');

  // 2. Criar pratos prontos
  const feijoada = await prisma.dish.create({
    data: {
      chefId: chef1.id,
      type: DishType.READY,
      name: 'Feijoada Completa',
      description: 'Feijoada tradicional com arroz, couve, farofa e laranja. Serve 2 pessoas.',
      ingredients: ['Feijão preto', 'Linguiça', 'Costelinha', 'Bacon', 'Couve', 'Laranja'],
      price: 65.0,
      prepMinutes: 180,
    },
  });

  const moqueca = await prisma.dish.create({
    data: {
      chefId: chef1.id,
      type: DishType.READY,
      name: 'Moqueca de Peixe',
      description: 'Moqueca capixaba com peixe fresco, leite de coco e dendê. Serve 2 pessoas.',
      ingredients: ['Peixe', 'Leite de coco', 'Dendê', 'Pimentão', 'Tomate', 'Coentro'],
      price: 72.0,
      prepMinutes: 120,
    },
  });

  const lasanha = await prisma.dish.create({
    data: {
      chefId: chef2.id,
      type: DishType.READY,
      name: 'Lasanha Bolonhesa',
      description: 'Lasanha artesanal com molho bolonhesa e bechamel. Serve 3 pessoas.',
      ingredients: ['Massa fresca', 'Carne moída', 'Molho de tomate', 'Bechamel', 'Queijo'],
      price: 58.0,
      prepMinutes: 90,
    },
  });

  const risoto = await prisma.dish.create({
    data: {
      chefId: chef2.id,
      type: DishType.READY,
      name: 'Risoto de Funghi',
      description: 'Risoto cremoso com mix de cogumelos e parmesão. Serve 2 pessoas.',
      ingredients: ['Arroz arbóreo', 'Cogumelos', 'Parmesão', 'Vinho branco', 'Manteiga'],
      price: 48.0,
      prepMinutes: 60,
    },
  });

  const yakisoba = await prisma.dish.create({
    data: {
      chefId: chef3.id,
      type: DishType.READY,
      name: 'Yakisoba Vegano',
      description: 'Yakisoba com legumes frescos e molho especial shoyu. Serve 2 pessoas.',
      ingredients: ['Macarrão', 'Brócolis', 'Cenoura', 'Repolho', 'Shoyu', 'Gengibre'],
      price: 38.0,
      prepMinutes: 45,
    },
  });

  console.log('✅ Pratos prontos criados');

  // 3. Criar categorias de menu (para montagem de prato à la carte)
  const catProteina = await prisma.menuCategory.create({
    data: {
      chefId: chef1.id,
      name: 'Proteínas',
      minSelect: 1,
      maxSelect: 1,
    },
  });

  const catAcomp = await prisma.menuCategory.create({
    data: {
      chefId: chef1.id,
      name: 'Acompanhamentos',
      minSelect: 1,
      maxSelect: 2,
    },
  });

  const catMolho = await prisma.menuCategory.create({
    data: {
      chefId: chef1.id,
      name: 'Molhos',
      minSelect: 0,
      maxSelect: 1,
    },
  });

  console.log('✅ Categorias de menu criadas');

  // 4. Criar itens de menu
  await prisma.menuItem.createMany({
    data: [
      { categoryId: catProteina.id, name: 'Frango Grelhado', price: 18.0 },
      { categoryId: catProteina.id, name: 'Picanha', price: 28.0 },
      { categoryId: catProteina.id, name: 'Salmão', price: 32.0 },
      { categoryId: catProteina.id, name: 'Tofu', price: 15.0 },
      { categoryId: catAcomp.id, name: 'Arroz Branco', price: 5.0 },
      { categoryId: catAcomp.id, name: 'Feijão Tropeiro', price: 8.0 },
      { categoryId: catAcomp.id, name: 'Batata Frita', price: 7.0 },
      { categoryId: catAcomp.id, name: 'Salada Verde', price: 6.0 },
      { categoryId: catMolho.id, name: 'Molho de Ervas', price: 3.0 },
      { categoryId: catMolho.id, name: 'Molho BBQ', price: 4.0 },
      { categoryId: catMolho.id, name: 'Molho de Alho', price: 3.0 },
    ],
  });

  console.log('✅ Itens de menu criados');

  // 5. Criar pedidos (2 exemplos)
  const order1 = await prisma.order.create({
    data: {
      customerId: customer1.id,
      chefId: chef1.id,
      subtotal: 65.0,
      deliveryFee: 8.0,
      total: 73.0,
      status: OrderStatus.COMPLETED,
      deliveryAddress: customer1.defaultAddress!,
      paymentMethod: PaymentMethod.MOCK,
      items: {
        create: [
          {
            dishId: feijoada.id,
            quantity: 1,
            unitPrice: 65.0,
          },
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      customerId: customer2.id,
      chefId: chef2.id,
      subtotal: 106.0,
      deliveryFee: 10.0,
      total: 116.0,
      status: OrderStatus.PREPARING,
      deliveryAddress: customer2.defaultAddress!,
      paymentMethod: PaymentMethod.MOCK,
      items: {
        create: [
          {
            dishId: lasanha.id,
            quantity: 1,
            unitPrice: 58.0,
          },
          {
            dishId: risoto.id,
            quantity: 1,
            unitPrice: 48.0,
          },
        ],
      },
    },
  });

  console.log('✅ Pedidos criados');

  // 6. Criar avaliações
  await prisma.rating.createMany({
    data: [
      {
        customerId: customer1.id,
        chefId: chef1.id,
        stars: 5,
        comment: 'Feijoada deliciosa! Sabor autêntico e entrega rápida.',
      },
      {
        customerId: customer2.id,
        chefId: chef2.id,
        stars: 5,
        comment: 'Melhor lasanha que já comi! Massa perfeita e molho incrível.',
      },
      {
        customerId: customer1.id,
        chefId: chef3.id,
        stars: 4,
        comment: 'Yakisoba muito saboroso e saudável. Recomendo!',
      },
    ],
  });

  console.log('✅ Avaliações criadas');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📊 Dados criados:');
  console.log(`- ${await prisma.user.count()} usuários (3 chefs + 2 clientes)`);
  console.log(`- ${await prisma.chef.count()} chefs`);
  console.log(`- ${await prisma.customer.count()} clientes`);
  console.log(`- ${await prisma.dish.count()} pratos prontos`);
  console.log(`- ${await prisma.menuCategory.count()} categorias de menu`);
  console.log(`- ${await prisma.menuItem.count()} itens de menu`);
  console.log(`- ${await prisma.order.count()} pedidos`);
  console.log(`- ${await prisma.rating.count()} avaliações`);
  console.log('\n🔑 Login de teste:');
  console.log('Chef 1: maria@chef.com / 123456 (Brasileira)');
  console.log('Chef 2: joao@chef.com / 123456 (Italiana)');
  console.log('Chef 3: ana@chef.com / 123456 (Oriental/Vegana)');
  console.log('Cliente 1: carlos@cliente.com / 123456');
  console.log('Cliente 2: lucia@cliente.com / 123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


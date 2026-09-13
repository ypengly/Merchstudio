// Seeds a minimal, usable catalog: run with `npm run prisma:seed` from /server.
import { PrismaClient, ProductCategory, TemplateCategory, GraphicCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);
  await prisma.user.upsert({
    where: { email: "admin@merchstudio.dev" },
    update: {},
    create: {
      email: "admin@merchstudio.dev",
      passwordHash,
      name: "Admin",
      role: "ADMIN",
      subscription: { create: { plan: "BUSINESS" } },
    },
  });

  const products: Array<{
    name: string;
    category: ProductCategory;
    designAreaWidth: number;
    designAreaHeight: number;
    variants: Array<{ colorName: string; colorHex: string; frontImage: string }>;
  }> = [
    {
      name: "Classic T-Shirt",
      category: "TSHIRT",
      designAreaWidth: 1000,
      designAreaHeight: 1200,
      variants: [
        { colorName: "White", colorHex: "#FAFAF9", frontImage: "/mockups/tshirt-white-front.png" },
        { colorName: "Black", colorHex: "#1A1A18", frontImage: "/mockups/tshirt-black-front.png" },
      ],
    },
    {
      name: "Pullover Hoodie",
      category: "HOODIE",
      designAreaWidth: 900,
      designAreaHeight: 1000,
      variants: [
        { colorName: "Heather Grey", colorHex: "#9A9A93", frontImage: "/mockups/hoodie-grey-front.png" },
        { colorName: "Navy", colorHex: "#2B3A55", frontImage: "/mockups/hoodie-navy-front.png" },
      ],
    },
    {
      name: "Canvas Tote Bag",
      category: "TOTE_BAG",
      designAreaWidth: 800,
      designAreaHeight: 900,
      variants: [{ colorName: "Natural", colorHex: "#E4E3DE", frontImage: "/mockups/tote-natural-front.png" }],
    },
    {
      name: "Classic Mug",
      category: "MUG",
      designAreaWidth: 700,
      designAreaHeight: 350,
      variants: [{ colorName: "White", colorHex: "#FAFAF9", frontImage: "/mockups/mug-white-front.png" }],
    },
  ];

  for (const p of products) {
    const created = await prisma.product.upsert({
      where: { id: p.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: p.name.toLowerCase().replace(/\s+/g, "-"),
        name: p.name,
        category: p.category,
        designAreaWidth: p.designAreaWidth,
        designAreaHeight: p.designAreaHeight,
        variants: { create: p.variants },
      },
    });
    console.log(`Seeded product: ${created.name}`);
  }

  const templateCategories: TemplateCategory[] = ["STREETWEAR", "BUSINESS", "EVENTS", "FASHION", "FUNNY_CASUAL"];
  for (const category of templateCategories) {
    await prisma.template.upsert({
      where: { id: `starter-${category.toLowerCase()}` },
      update: {},
      create: {
        id: `starter-${category.toLowerCase()}`,
        name: `${category.replace("_", " ")} Starter`,
        category,
        previewUrl: `/templates/${category.toLowerCase()}.png`,
        isPremium: false,
        snapshot: { elements: [] },
      },
    });
  }

  const graphics: Array<{ name: string; category: GraphicCategory }> = [
    { name: "Five-Point Star", category: "STARS" },
    { name: "Heart Outline", category: "HEARTS" },
    { name: "Bold Arrow", category: "ARROWS" },
    { name: "Circle Badge", category: "BADGES" },
  ];
  for (const g of graphics) {
    await prisma.graphic.upsert({
      where: { id: g.name.toLowerCase().replace(/\s+/g, "-") },
      update: {},
      create: {
        id: g.name.toLowerCase().replace(/\s+/g, "-"),
        name: g.name,
        category: g.category,
        assetUrl: `/graphics/${g.name.toLowerCase().replace(/\s+/g, "-")}.svg`,
      },
    });
  }

  console.log("Seed complete. Admin login: admin@merchstudio.dev / password123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

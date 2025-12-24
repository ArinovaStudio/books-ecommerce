import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  /* -------------------- SCHOOL -------------------- */
  const school = await prisma.school.create({
    data: {
      name: "Green Valley School",
      email: "info@greenvalley.edu",
      address: "Kolkata, WB",
      languages: ["English", "Hindi"],
      classRange: "1-12",
      image: "https://dummyimage.com/school.png",
      board: "CBSE",
    },
  });

  /* -------------------- USERS -------------------- */
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@mail.com",
      password: "hashed_password",
      role: "ADMIN",
      schoolId: school.id,
    },
  });

  

  const parent = await prisma.user.create({
    data: {
      name: "Parent User",
      email: "parent@mail.com",
      password: "hashed_password",
      role: "USER",
    },
  });

  /* -------------------- OTP -------------------- */
  await prisma.otp.create({
    data: {
      email: "parent@mail.com",
      otp: "123456",
      expiredAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  /* -------------------- CLASS -------------------- */
  const class10 = await prisma.class.create({
    data: {
      schoolId: school.id,
      name: "Class 10",
      sections: ["A", "B"],
      academicYear: "2024-25",
    },
  });

  /* -------------------- STUDENT -------------------- */
  const student = await prisma.student.create({
    data: {
      name: "Aritra",
      rollNo: "10A01",
      section: "A",
      parentEmail: "parent@mail.com",
      parentId: parent.id,
      schoolId: school.id,
      classId: class10.id,
      isActive: true,
    },
  });

  /* -------------------- PRODUCTS -------------------- */
  const book = await prisma.product.create({
    data: {
      name: "Math Textbook",
      description: "Class 10 Math",
      price: 250,
      category: "TEXTBOOK",
      stock: 100,
      brand: "NCERT",
    },
  });

  const notebook = await prisma.product.create({
    data: {
      name: "Notebook",
      description: "200 pages",
      price: 60,
      category: "NOTEBOOK",
      stock: 500,
    },
  });

  /* -------------------- KIT -------------------- */
  const kit = await prisma.kit.create({
    data: {
      type: "BASIC",
      classId: class10.id,
      language: "English",
      totalPrice: 310,
    },
  });

  /* -------------------- KIT ITEMS -------------------- */
  await prisma.kitItem.createMany({
    data: [
      {
        kitId: kit.id,
        productId: book.id,
        quantity: 1,
      },
      {
        kitId: kit.id,
        productId: notebook.id,
        quantity: 1,
      },
    ],
  });

  /* -------------------- ORDER -------------------- */
  const order = await prisma.order.create({
    data: {
      userId: parent.id,
      studentId: student.id,
      school: school.name,
      class: class10.name,
      section: student.section,
      kitType: "BASIC",
      academicYear: "2024-25",
      status: "PLACED",
      totalAmount: 310,
    },
  });

  /* -------------------- ORDER ITEMS -------------------- */
  await prisma.orderItem.createMany({
    data: [
      {
        orderId: order.id,
        productId: book.id,
        quantity: 1,
        price: 250,
      },
      {
        orderId: order.id,
        productId: notebook.id,
        quantity: 1,
        price: 60,
      },
    ],
  });

  /* -------------------- PAYMENT -------------------- */
  await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: 310,
      status: "SUCCESS",
      method: "UPI",
    },
  });

  /* -------------------- API TRAFFIC -------------------- */
  await prisma.apiTraffic.create({
    data: {
      hour: new Date(new Date().setMinutes(0, 0, 0)),
      count: 5,
    },
  });

  console.log("✅ Seeding completed successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

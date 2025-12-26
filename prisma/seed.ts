import {
  PrismaClient,
  UserRole,
  UserStatus,
  SchoolStatus,
  ProductCategory,
  KitType,
  PaymentStatus,
} from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

//   await prisma.orderItem.deleteMany();
//   await prisma.payment.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.kitItem.deleteMany();
//   await prisma.kit.deleteMany();
//   await prisma.product.deleteMany();
//   await prisma.student.deleteMany();
//   await prisma.class.deleteMany();
//   await prisma.school.deleteMany();
//   await prisma.otp.deleteMany();
//   await prisma.apiTraffic.deleteMany();
//   await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.create({
    data: {
      email: "admin@school.com",
      name: "Super Admin",
      password: hashedAdminPassword,
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  

  const parent = await prisma.user.create({
    data: {
      email: "parent@test.com",
      phone: "9999999999",
      name: "Rahul Sharma",
      password: "parent123",
      role: UserRole.USER,
    },
  });

  // ---------- School ----------
  const school = await prisma.school.create({
    data: {
      name: "Green Valley Public School",
      email: "info@greenvalley.edu",
      address: "Sector 21, New Delhi",
      languages: ["English", "Hindi"],
      classRange: "1-10",
      image: "https://dummyimage.com/600x400/000/fff&text=School",
      board: "CBSE",
      status: SchoolStatus.ACTIVE,
      subAdmins: {
        connect: { id: admin.id },
      },
    },
  });

  // ---------- Class ----------
  const class5 = await prisma.class.create({
    data: {
      name: "Class 5",
      sections: ["A", "B"],
      academicYear: "2025-2026",
      schoolId: school.id,
    },
  });

  // ---------- Products ----------
  const mathBook = await prisma.product.create({
    data: {
      name: "Mathematics Textbook",
      description: "Class 5 Maths Book",
      price: 250,
      category: ProductCategory.TEXTBOOK,
      stock: 100,
      brand: "NCERT",
      classId: class5.id,
    },
  });

  const notebook = await prisma.product.create({
    data: {
      name: "Notebook",
      description: "200 pages notebook",
      price: 60,
      category: ProductCategory.NOTEBOOK,
      stock: 300,
      brand: "Classmate",
      classId: class5.id,
    },
  });

  const pen = await prisma.product.create({
    data: {
      name: "Blue Pen",
      description: "Smooth ball pen",
      price: 10,
      category: ProductCategory.STATIONARY,
      stock: 500,
      brand: "Reynolds",
      classId: class5.id,
    },
  });

  // ---------- Kit ----------
  const kit = await prisma.kit.create({
    data: {
      type: KitType.BASIC,
      classId: class5.id,
      language: "English",
      totalPrice: 320,
      items: {
        create: [
          { productId: mathBook.id, quantity: 1 },
          { productId: notebook.id, quantity: 1 },
          { productId: pen.id, quantity: 1 },
        ],
      },
    },
    include: { items: true },
  });

  // ---------- Student ----------
  const student = await prisma.student.create({
    data: {
      name: "Aarav Sharma",
      rollNo: "15",
      section: "A",
      parentEmail: parent.email,
      isActive: true,
      schoolId: school.id,
      classId: class5.id,
      parentId: parent.id,
      dob: new Date("2014-05-10"),
      gender: "Male",
      address: "Sector 21, New Delhi",
    },
  });

  // ---------- Order ----------
  const order = await prisma.order.create({
    data: {
      userId: parent.id,
      studentId: student.id,
      school: school.name,
      class: class5.name,
      section: student.section,
      kitType: KitType.BASIC,
      academicYear: "2025-2026",
      status: "PLACED",
      totalAmount: kit.totalPrice,
      items: {
        create: [
          { productId: mathBook.id, quantity: 1, price: mathBook.price },
          { productId: notebook.id, quantity: 1, price: notebook.price },
          { productId: pen.id, quantity: 1, price: pen.price },
        ],
      },
      payment: {
        create: {
          amount: kit.totalPrice,
          status: PaymentStatus.SUCCESS,
          method: "UPI",
        },
      },
    },
  });

  // ---------- OTP ----------
  await prisma.otp.create({
    data: {
      email: parent.email,
      otp: "123456",
      expiredAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  // ---------- API Traffic ----------
  await prisma.apiTraffic.create({
    data: {
      hour: new Date(new Date().setMinutes(0, 0, 0)),
      count: 25,
    },
  });

  console.log("✅ Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

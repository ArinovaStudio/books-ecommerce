import prisma from "@/lib/prisma";

async function main() {
  const orders = await prisma.order.findMany({
    include: {
      students: {
        include: {
          student: {},
        },
      },
    },
  });
  const updatedOrders = orders.filter((order) => {
    return order.students.length === 0;
  });
  updatedOrders.forEach(async order => {
    const parent = await prisma.user.findUnique({
        where:{
            id: order.userId
        },
        include:{
            children: true
        }
    });
    await prisma.order.update({
        where:{
            id: order.id
        },
        data:{
            students:{
                create:[
                    {student:{connect:{id: parent!.children[0].id}}}
                ]
            }
        }
    })
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

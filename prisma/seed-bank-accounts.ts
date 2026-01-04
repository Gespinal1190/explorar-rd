
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = "agencia@test.com";

    const user = await prisma.user.findUnique({
        where: { email },
        include: { agencyProfile: true },
    });

    if (!user || !user.agencyProfile) {
        console.error("Test agency not found");
        return;
    }

    const agencyId = user.agencyProfile.id;

    await prisma.bankAccount.createMany({
        data: [
            {
                agencyProfileId: agencyId,
                bankName: "Banco Popular",
                accountNumber: "7894561230",
                accountType: "CORRIENTE",
                beneficiaryName: "Explora DR SRL",
            },
            {
                agencyProfileId: agencyId,
                bankName: "Banco BHD",
                accountNumber: "1122334455",
                accountType: "AHORROS",
                beneficiaryName: "Explora DR SRL",
            },
            {
                agencyProfileId: agencyId,
                bankName: "Banreservas",
                accountNumber: "9988776655",
                accountType: "CORRIENTE",
                beneficiaryName: "Explora DR SRL",
            },
        ],
    });

    console.log("Bank accounts seeded for agency:", email);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

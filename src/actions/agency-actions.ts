'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addBankAccount(data: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const agency = await prisma.agencyProfile.findUnique({
        where: { userId: session.user.id }
    });

    if (!agency) throw new Error("No agency profile found");

    const bankName = data.get("bankName") as string;
    const accountNumber = data.get("accountNumber") as string;
    const accountType = data.get("accountType") as string;
    const beneficiaryName = data.get("beneficiaryName") as string;

    if (!bankName || !accountNumber || !beneficiaryName) {
        throw new Error("Missing fields");
    }

    await prisma.bankAccount.create({
        data: {
            agencyProfileId: agency.id,
            bankName,
            accountNumber,
            accountType,
            beneficiaryName
        }
    });

    revalidatePath("/dashboard/agency/profile");
}

export async function deleteBankAccount(accountId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership
    const account = await prisma.bankAccount.findUnique({
        where: { id: accountId },
        include: { agencyProfile: true }
    });

    if (!account || account.agencyProfile.userId !== session.user.id) {
        throw new Error("Unauthorized");
    }

    await prisma.bankAccount.delete({ where: { id: accountId } });
    revalidatePath("/dashboard/agency/profile");
}

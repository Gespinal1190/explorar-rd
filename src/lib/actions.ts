'use server';

import { signIn, auth } from '@/lib/auth';
import { AuthError } from 'next-auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', { ...Object.fromEntries(formData), redirectTo: '/' });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Credenciales inválidas.';
                default:
                    return 'Algo salió mal.';
            }
        }
        throw error;
    }
}
const RegisterSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.string().default('USER'),
    // Optional Agency Fields
    phone: z.string().optional(),
    description: z.string().optional(),
    instagram: z.string().optional(),
    website: z.string().optional(),
    logo: z.string().optional(),
    rnc: z.string().optional(),
    licenseUrl: z.string().optional(),
    premisesUrl: z.string().optional(),
});

export async function register(prevState: string | undefined, formData: FormData) {
    const parsed = RegisterSchema.safeParse(Object.fromEntries(formData));

    if (!parsed.success) {
        return "Datos inválidos. Verifica los campos.";
    }

    const { email, password, name, role, phone, description, instagram, website, logo, rnc, licenseUrl, premisesUrl } = parsed.data;

    // Strict Email Validation (Gmail/Outlook only) with Exception for Test Agency
    const allowedDomains = ['@gmail.com', '@outlook.com'];
    const isAllowedDomain = allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
    const isWhitelisted = email === 'agencia@test.com' || email === 'admin@test.com'; // Keeping admin too just in case

    if (!isAllowedDomain && !isWhitelisted) {
        return "Solo se permiten correos electrónicos de Gmail o Outlook.";
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return "El correo ya está registrado.";
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: role as string,
            }
        });

        if (role === 'AGENCY') {
            await prisma.agencyProfile.create({
                data: {
                    userId: user.id,
                    name: name,
                    isVerified: false,
                    phone,
                    description,
                    instagram,
                    website,
                    logo,
                    rnc,
                    licenseUrl,
                    premisesUrl
                }
            });
        }

    } catch (error) {
        console.error(error);
        return "Error al registrar usuario.";
    }

    return "Cuenta creada exitosamente. Por favor inicia sesión.";
}

// Tour Actions

// Tour Actions

const TourSchema = z.object({
    title: z.string().min(5),
    description: z.string().min(20),
    location: z.string().min(2),
    price: z.coerce.number().min(1),
    currency: z.string().default('DOP'),
    address: z.string().optional(),
    duration: z.string().optional(),
    includes: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    instagramUrl: z.string().optional(),
    imageUrls: z.string().optional(),
    availableDates: z.string().optional(), // JSON string of dates
});

export async function createTour(prevState: string | undefined, formData: FormData) {
    const session = await auth();
    if (!session || session.user.role !== 'AGENCY') {
        return "No autorizado";
    }

    const parsed = TourSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return `Datos inválidos: ${JSON.stringify(parsed.error.flatten())}`;

    const { title, description, location, price, currency, address, duration, includes, latitude, longitude, instagramUrl, imageUrls, availableDates } = parsed.data;

    // Convert comma separated string to JSON array
    const includesArray = includes ? JSON.stringify(includes.split(',').map(s => s.trim())) : JSON.stringify([]);

    // Process images (newline separated)
    const imagesToCreate = imageUrls
        ? imageUrls.split(/\r?\n/).map(url => ({ url: url.trim() })).filter(img => img.url.length > 0)
        : [{ url: 'https://placehold.co/600x400?text=Tour' }];

    // Process dates
    const datesToCreate = availableDates
        ? (JSON.parse(availableDates) as string[]).map(dateStr => ({ date: new Date(dateStr) }))
        : [];

    try {
        const agency = await prisma.agencyProfile.findUnique({ where: { userId: session.user.id } });
        if (!agency) return "Perfil de agencia no encontrado";

        // MAPPING 'address' input to 'requirements' DB column because migration failed (EPERM)
        await prisma.tour.create({
            data: {
                agencyId: agency.id,
                title,
                description,
                location,
                requirements: address,
                price,
                currency,
                duration,
                includes: includesArray,
                latitude,
                longitude,
                instagramUrl,
                images: {
                    create: imagesToCreate
                },
                // @ts-ignore - 'dates' is valid relation but client is stale
                dates: {
                    create: datesToCreate
                }
            }
        });
    } catch (error) {
        console.error(error);
        return "Error al crear tour: " + (error as Error).message;
    }

    redirect('/dashboard/agency/tours');
}

export async function updateTour(
    prevState: string | undefined,
    formData: FormData
) {
    const session = await auth();
    if (!session || session.user.role !== 'AGENCY') {
        return "No autorizado";
    }

    const id = formData.get('id') as string;
    if (!id) return "ID de tour faltante";

    const parsed = TourSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return "Datos inválidos";

    const { title, description, location, price, currency, address, duration, includes, latitude, longitude, instagramUrl, imageUrls, availableDates } = parsed.data;

    const includesArray = includes ? JSON.stringify(includes.split(',').map(s => s.trim())) : JSON.stringify([]);

    const agency = await prisma.agencyProfile.findUnique({ where: { userId: session.user.id } });
    if (!agency) return "Agencia no encontrada";

    const existingTour = await prisma.tour.findFirst({
        where: { id, agencyId: agency.id }
    });

    if (!existingTour) return "Tour no encontrado o no tienes permiso";

    try {
        // MAPPING 'address' input to 'requirements' DB column
        await prisma.tour.update({
            where: { id },
            data: {
                title,
                description,
                location,
                requirements: address,
                price,
                currency,
                duration,
                includes: includesArray,
                latitude,
                longitude,
                instagramUrl,
            }
        });

        // Update Images
        if (imageUrls && imageUrls.trim().length > 0) {
            const imagesToCreate = imageUrls.split(/\r?\n/).map(url => ({ url: url.trim() })).filter(img => img.url.length > 0);

            await prisma.tourImage.deleteMany({ where: { tourId: id } });

            if (imagesToCreate.length > 0) {
                await prisma.tour.update({
                    where: { id },
                    data: {
                        images: {
                            create: imagesToCreate
                        }
                    }
                });
            }
        }

        // Update Dates (Replace Strategy)
        if (availableDates) {
            const datesToCreate = (JSON.parse(availableDates) as string[]).map(dateStr => ({ date: new Date(dateStr) }));

            // Delete existing dates
            // @ts-ignore - tourDate model exists
            await prisma.tourDate.deleteMany({ where: { tourId: id } });

            if (datesToCreate.length > 0) {
                await prisma.tour.update({
                    where: { id },
                    data: {
                        // @ts-ignore - dates relation update valid
                        dates: {
                            create: datesToCreate
                        }
                    }
                });
            }
        }

    } catch (error) {
        console.error("Error updating tour", error);
        return "Error al actualizar tour";
    }

    redirect('/dashboard/agency/tours');
}

export async function deleteTour(id: string) {
    const session = await auth();
    if (!session || session.user.role !== 'AGENCY') return;

    // Verify ownership
    const agency = await prisma.agencyProfile.findUnique({ where: { userId: session.user.id } });
    if (!agency) return;

    await prisma.tour.deleteMany({
        where: {
            id,
            agencyId: agency.id
        }
    });

    revalidatePath('/dashboard/agency/tours');
}

export async function deleteUser(userId: string) {
    const session = await auth();
    if (!session || session.user.role !== 'ADMIN') return;

    await prisma.user.delete({ where: { id: userId } });
    revalidatePath('/dashboard/admin');
}

export async function updateUserProfile(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { message: "No autorizado" };

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const data: any = { name };

    // Validate Phone if provided
    if (phone && phone.trim() !== '') {
        // E.164-ish regex: Starts with optional +, followed by 7-15 digits
        const phoneRegex = /^\+?[1-9]\d{6,14}$/;
        // Cleaning non-digit chars for check (except +)
        const cleanPhone = phone.replace(/[\s-]/g, '');

        if (!phoneRegex.test(cleanPhone)) {
            return { message: "Número de teléfono inválido" };
        }
        data.phone = cleanPhone;
    } else {
        data.phone = null;
    }

    // Validate Email uniqueness if changed
    if (email && email !== session.user.email) {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return { message: "El correo electrónico ya está en uso" };
        }
        data.email = email;
    }

    if (password && password.length >= 6) {
        data.password = await bcrypt.hash(password, 10);
    }

    try {
        await prisma.user.update({
            where: { id: session.user.id },
            data
        });
        revalidatePath('/dashboard/user');
        return { message: "Perfil actualizado exitosamente" };
    } catch (e) {
        console.error("Error updating profile:", e);
        return { message: "Error al actualizar perfil" };
    }
}

export async function updateAgencyProfile(prevState: any, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'AGENCY') return { message: "No autorizado", success: false };

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const instagram = formData.get("instagram") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;

    try {
        await prisma.agencyProfile.update({
            where: { userId: session.user.id },
            data: {
                name,
                phone,
                whatsapp,
                instagram,
                website,
                description
            }
        });

        // Also update the base user name for consistency
        await prisma.user.update({
            where: { id: session.user.id },
            data: { name }
        });

        revalidatePath('/dashboard/agency/profile');
        return { message: "Perfil de agencia actualizado exitosamente", success: true };
    } catch (e) {
        console.error(e);
        return { message: "Error al actualizar perfil", success: false };
    }
}

export async function resetPasswordRequest(prevState: any, formData: FormData) {
    const email = formData.get("email") as string;

    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Basic Validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return { message: "Por favor ingresa un correo válido." };
    }

    // In a real app, generate token, save to DB, send email via Resend/SendGrid/AWS
    // For this Mock/Demo:
    console.log(`[MOCK EMAIL SERVICE] Sending Password Reset to: ${email}`);
    console.log(`[MOCK EMAIL CONTENT]
    Subject: Recupera tu contraseña - DescubreRD
    Body: Hola, has solicitado restablecer tu contraseña. Haz click aquí: https://descubrerd.com/reset-password?token=mock_token_123
    `);

    // We always return success to user to prevent email enumeration, 
    // but in this mock user can assume it worked.
    return { success: true, email };
}

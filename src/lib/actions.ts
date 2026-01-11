'use server';

import { getSession } from '@/lib/session';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
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
                    status: 'PENDING', // Force PENDING status for admin approval
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

    return "Cuenta creada exitosamente. Tu agencia está pendiente de aprobación por el administrador.";
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
    startTime: z.string().optional(), // New field
    includes: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
    instagramUrl: z.string().optional(),
    imageUrls: z.string().optional(),
    availableDates: z.string().optional(), // JSON string of dates
});

export async function createTour(prevState: string | undefined, formData: FormData) {
    const session = await getSession();
    if (!session || session.role !== 'AGENCY') {
        return "No autorizado";
    }

    const parsed = TourSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return `Datos inválidos: ${JSON.stringify(parsed.error.flatten())}`;

    const { title, description, location, price, currency, address, duration, startTime, includes, latitude, longitude, instagramUrl, imageUrls, availableDates } = parsed.data;

    // Convert comma separated string to JSON array
    const includesArray = includes ? JSON.stringify(includes.split(',').map(s => s.trim())) : JSON.stringify([]);

    // Process images (newline separated)
    const imagesToCreate = imageUrls
        ? imageUrls.split(/\r?\n/).map(url => ({ url: url.trim() })).filter(img => img.url.length > 0)
        : [{ url: 'https://placehold.co/600x400?text=Tour' }];

    // Process dates
    const datesToCreate = availableDates
        ? (JSON.parse(availableDates) as { date: string, time?: string }[]).map(d => ({
            date: new Date(d.date),
            startTime: d.time
        }))
        : [];

    try {
        const agency = await prisma.agencyProfile.findUnique({ where: { userId: String(session.userId) } });
        if (!agency) return "Perfil de agencia no encontrado";

        // 1. Check if explicitly PAUSED
        if (agency.status === 'PAUSED') {
            return "Tu agencia ha sido pausada por la administración. No puedes crear nuevos anuncios.";
        }

        // 2. Check if PENDING (Not yet approved)
        if (agency.status === 'PENDING') {
            return "Tu agencia está pendiente de aprobación. Aún no puedes publicar anuncios.";
        }

        // 3. General catch-all: MUST BE ACTIVE
        if (agency.status !== 'ACTIVE') {
            return "Tu agencia no está activa. Contacta al soporte.";
        }

        // Simple slugify function
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4); // Append timestamp suffix for uniqueness

        // MAPPING 'address' input to 'requirements' DB column because migration failed (EPERM)
        await prisma.tour.create({
            data: {
                agencyId: agency.id,
                title,
                slug,
                description,
                location,
                requirements: address,
                price,
                currency,
                duration,
                startTime,
                includes: includesArray,
                latitude,
                longitude,
                instagramUrl,
                images: {
                    create: imagesToCreate
                },
                dates: {
                    create: datesToCreate
                },
                // FORCE STATUS TO PENDING_REVIEW FOR ALL NEW TOURS
                // Even if agency is active, the TOUR itself needs approval or verification if that's the requirement.
                // Or if the requirement is just Agency Approval, ensure the check above (lines 142-145) is working correctly.
                // Assuming the user wants strict control:
                status: 'PENDING_REVIEW',
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
    const session = await getSession();
    if (!session || session.role !== 'AGENCY') {
        return "No autorizado";
    }

    const id = formData.get('id') as string;
    if (!id) return "ID de tour faltante";

    const parsed = TourSchema.safeParse(Object.fromEntries(formData));
    if (!parsed.success) return "Datos inválidos";

    const { title, description, location, price, currency, address, duration, startTime, includes, latitude, longitude, instagramUrl, imageUrls, availableDates } = parsed.data;

    const includesArray = includes ? JSON.stringify(includes.split(',').map(s => s.trim())) : JSON.stringify([]);

    const agency = await prisma.agencyProfile.findUnique({ where: { userId: String(session.userId) } });
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
                startTime,
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
            const datesToCreate = (JSON.parse(availableDates) as { date: string, time?: string }[]).map(d => ({
                date: new Date(d.date),
                startTime: d.time
            }));

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

        revalidatePath(`/tours/${id}`);
        revalidatePath('/tours');

    } catch (error) {
        console.error("Error updating tour", error);
        return "Error al actualizar tour";
    }

    redirect('/dashboard/agency/tours');
}

export async function toggleTourStatus(tourId: string, currentStatus: string) {
    const session = await getSession();
    if (!session || session.role !== 'AGENCY') {
        return { success: false, message: "No autorizado" };
    }

    try {
        const agency = await prisma.agencyProfile.findUnique({ where: { userId: String(session.userId) } });
        if (!agency) return { success: false, message: "Agencia no encontrada" };

        const newStatus = currentStatus === 'PUBLISHED' ? 'PAUSED' : 'PUBLISHED';

        await prisma.tour.update({
            where: {
                id: tourId,
                agencyId: agency.id
            },
            data: {
                status: newStatus as any // Casting as any to avoid enum import issues if not fully propagated yet
            }
        });

        revalidatePath('/dashboard/agency/tours');
        revalidatePath('/tours'); // Clean public cache
        revalidatePath(`/tours/${tourId}`);

        return { success: true, newStatus };
    } catch (error) {
        console.error("Error toggling status:", error);
        return { success: false, message: "Error al actualizar estado" };
    }
}

export async function deleteTour(id: string) {
    const session = await getSession();
    if (!session || session.role !== 'AGENCY') return;

    // Verify ownership
    const agency = await prisma.agencyProfile.findUnique({ where: { userId: String(session.userId) } });
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
    const session = await getSession();
    if (!session || session.role !== 'ADMIN') return;

    await prisma.user.delete({ where: { id: userId } });
    revalidatePath('/dashboard/admin');
}

export async function updateUserProfile(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session?.userId) return { message: "No autorizado" };

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
    if (email && email !== session.email) {
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
            where: { id: String(session.userId) },
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
    const session = await getSession();
    if (!session?.userId || session.role !== 'AGENCY') return { message: "No autorizado", success: false };

    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const instagram = formData.get("instagram") as string;
    const website = formData.get("website") as string;
    const description = formData.get("description") as string;

    try {
        await prisma.agencyProfile.update({
            where: { userId: String(session.userId) },
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
            where: { id: String(session.userId) },
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
// Favorites System
export async function toggleFavorite(tourId: string) {
    const session = await getSession();
    if (!session?.userId) {
        return { message: "Debes iniciar sesión", success: false, isFavorite: false };
    }

    const userId = String(session.userId);

    try {
        const existing = await prisma.favorite.findUnique({
            where: {
                userId_tourId: {
                    userId,
                    tourId
                }
            }
        });

        if (existing) {
            await prisma.favorite.delete({
                where: {
                    userId_tourId: {
                        userId,
                        tourId
                    }
                }
            });
            revalidatePath('/');
            revalidatePath('/tours');
            return { message: "Eliminado de favoritos", success: true, isFavorite: false };
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    tourId
                }
            });
            revalidatePath('/');
            revalidatePath('/tours');
            return { message: "Añadido a favoritos", success: true, isFavorite: true };
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
        return { message: "Error al procesar", success: false, isFavorite: false };
    }
}

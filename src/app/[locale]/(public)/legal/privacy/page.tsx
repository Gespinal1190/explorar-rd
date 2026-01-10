
export const metadata = {
    title: 'Política de Privacidad | DescubreRD',
    description: 'Política de privacidad y protección de datos de DescubreRD.',
};

export default function PrivacyPage() {
    return (
        <>
            <h1 className="text-3xl font-black text-gray-900 mb-8">Política de Privacidad</h1>
            <p className="text-sm text-gray-500 mb-8">Última actualización: 10 de Enero, 2026</p>

            <section className="mb-8">
                <h2>1. Resumen</h2>
                <p>
                    En <strong>DescubreRD</strong>, nos tomamos muy en serio su privacidad. Esta política describe cómo recopilamos, usamos y compartimos su información personal
                    cuando utiliza nuestra plataforma.
                </p>
            </section>

            <section className="mb-8">
                <h2>2. Información que Recopilamos</h2>
                <h3>2.1. Información proporcionada por el usuario</h3>
                <ul>
                    <li><strong>Registro de Cuenta:</strong> Nombre, dirección de correo electrónico, contraseña.</li>
                    <li><strong>Perfil de Agencia:</strong> Nombre comercial, RNC, dirección, teléfono, logo.</li>
                    <li><strong>Reservas:</strong> Información necesaria para procesar la reserva (nombres de pasajeros, fechas, preferencias).</li>
                </ul>

                <h3>2.2. Información recopilada automáticamente</h3>
                <ul>
                    <li>Dirección IP, tipo de navegador, sistema operativo.</li>
                    <li>Páginas visitadas, tiempo de permanencia, interacciones con el sitio.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>3. Uso de la Información</h2>
                <p>Utilizamos su información para:</p>
                <ul>
                    <li>Facilitar las reservas y conectar Usuarios con Agencias.</li>
                    <li>Procesar pagos y facturación.</li>
                    <li>Mejorar y optimizar nuestra plataforma y experiencia de usuario.</li>
                    <li>Enviar notificaciones transaccionales (confirmaciones, cambios de itinerario).</li>
                    <li>Cumplir con obligaciones legales.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>4. Compartir Información</h2>
                <p>
                    No vendemos su información personal a terceros. Compartimos información solo en las siguientes circunstancias:
                </p>
                <ul>
                    <li><strong>Con Agencias:</strong> Compartimos los datos del viajero necesarios para que la Agencia pueda prestar el servicio reservado.</li>
                    <li><strong>Proveedores de Servicios:</strong> Procesadores de pagos (PayPal), servicios de alojamiento en la nube, herramientas de análisis.</li>
                    <li><strong>Requerimiento Legal:</strong> Si es requerido por ley o para proteger derechos, propiedad o seguridad.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>5. Seguridad de Datos</h2>
                <p>
                    Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra acceso no autorizado, pérdida o alteración.
                    Sin embargo, ninguna transmisión por Internet es 100% segura.
                </p>
            </section>

            <section className="mb-8">
                <h2>6. Sus Derechos</h2>
                <p>
                    Usted tiene derecho a:
                </p>
                <ul>
                    <li>Acceder a la información personal que tenemos sobre usted.</li>
                    <li>Solicitar la corrección de datos inexactos.</li>
                    <li>Solicitar la eliminación de su cuenta y datos personales ("Derecho al olvido").</li>
                    <li>Optar por no recibir comunicaciones de marketing.</li>
                </ul>
                <p>
                    Para ejercer estos derechos, contáctenos a través de nuestro correo de soporte.
                </p>
            </section>

            <section className="mb-8">
                <h2>7. Cookies</h2>
                <p>
                    Utilizamos cookies para mejorar la funcionalidad del sitio. Para más detalles, consulte nuestra <a href="/legal/cookies">Política de Cookies</a>.
                </p>
            </section>

            <section>
                <h2>8. Cambios en esta Política</h2>
                <p>
                    Podemos actualizar esta política ocasionalmente. Le notificaremos sobre cambios significativos a través de nuestro Sitio o por correo electrónico.
                </p>
            </section>
        </>
    );
}

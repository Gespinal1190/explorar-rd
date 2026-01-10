
export const metadata = {
    title: 'Términos y Condiciones | DescubreRD',
    description: 'Términos y condiciones de uso de la plataforma DescubreRD Marketplace.',
};

export default function TermsPage() {
    return (
        <>
            <h1 className="text-3xl font-black text-gray-900 mb-8">Términos y Condiciones</h1>
            <p className="text-sm text-gray-500 mb-8">Última actualización: 10 de Enero, 2026</p>

            <section className="mb-8">
                <h2>1. Introducción</h2>
                <p>
                    Bienvenido a <strong>DescubreRD</strong>. Estos Términos y Condiciones regulan el uso de nuestra plataforma web (el "Sitio"),
                    que actúa como un mercado en línea ("Marketplace") conectando a viajeros ("Usuarios") con agencias de turismo locales ("Agencias").
                </p>
                <p>
                    Al acceder o utilizar nuestro Sitio, usted acepta estar legalmente vinculado por estos términos. Si no acepta alguno de estos términos, por favor no utilice nuestros servicios.
                </p>
            </section>

            <section className="mb-8">
                <h2>2. Nuestro Rol como Intermediario</h2>
                <p>
                    DescubreRD actúa exclusivamente como una plataforma tecnológica intermediaria. <strong>No somos una agencia de viajes ni un operador turístico.</strong>
                </p>
                <ul>
                    <li>El servicio de DescubreRD se limita a facilitar la publicación de ofertas turísticas por parte de las Agencias y la reserva de las mismas por parte de los Usuarios.</li>
                    <li>El contrato de prestación del servicio turístico se establece única y exclusivamente entre el Usuario y la Agencia.</li>
                    <li>DescubreRD no es responsable de la ejecución, calidad, seguridad o idoneidad de los tours o actividades ofrecidas.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>3. Reservas y Pagos</h2>
                <h3>3.1. Proceso de Reserva</h3>
                <p>
                    Al realizar una reserva a través de DescubreRD, el Usuario ofrece contratar un servicio directamente con la Agencia seleccionada.
                    La reserva se considera confirmada únicamente cuando la Agencia acepta la solicitud y/o se procesa el pago correspondiente.
                </p>

                <h3>3.2. Pagos</h3>
                <p>
                    Los pagos se procesan de forma segura a través de pasarelas de terceros (como PayPal). DescubreRD puede actuar como agente limitado de cobro
                    en nombre de la Agencia con el único propósito de aceptar pagos de los Usuarios y transferirlos a la Agencia, descontando las comisiones aplicables.
                </p>
            </section>

            <section className="mb-8">
                <h3>4. Políticas de Cancelación y Reembolso</h3>
                <p>
                    Las políticas de cancelación y reembolso son determinadas por cada Agencia para sus respectivos tours. Es responsabilidad del Usuario revisar estas políticas antes de realizar una reserva.
                </p>
                <p>
                    En general, salvo que la Agencia especifique lo contrario:
                </p>
                <ul>
                    <li>Las cancelaciones realizadas por la Agencia (por clima o fuerza mayor) resultarán en un reembolso completo o reprogramación.</li>
                    <li>Las cancelaciones voluntarias por parte del Usuario pueden estar sujetas a penalizaciones según la antelación del aviso.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>5. Responsabilidades de las Agencias</h2>
                <p>
                    Las Agencias registradas en DescubreRD garantizan que:
                </p>
                <ul>
                    <li>Están legalmente constituidas y autorizadas para operar servicios turísticos en la República Dominicana.</li>
                    <li>La información publicada sobre sus tours (precios, itinerarios, inclusiones) es veraz y actualizada.</li>
                    <li>Cuentan con los seguros y permisos necesarios para la realización de las actividades.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>6. Limitación de Responsabilidad</h2>
                <p>
                    DescubreRD no será responsable por:
                </p>
                <ul>
                    <li>Lesiones personales, muerte, daños a la propiedad u otros daños resultantes de las actividades turísticas.</li>
                    <li>Cancelaciones, retrasos o cambios de itinerario por parte de las Agencias.</li>
                    <li>Errores u omisiones en la información proporcionada por las Agencias.</li>
                </ul>
                <p>
                    Nuestra responsabilidad máxima ante cualquier reclamación relacionada con el uso de la plataforma se limita al monto de las comisiones de servicio pagadas a DescubreRD en la transacción específica.
                </p>
            </section>

            <section className="mb-8">
                <h2>7. Propiedad Intelectual</h2>
                <p>
                    Todo el contenido del Sitio (diseño, texto, gráficos, logotipos) es propiedad de DescubreRD o de sus licenciantes y está protegido por las leyes de propiedad intelectual.
                </p>
            </section>

            <section className="mb-8">
                <h2>8. Ley Aplicable</h2>
                <p>
                    Estos Términos se regirán e interpretarán de acuerdo con las leyes de la República Dominicana. Cualquier disputa se someterá a la jurisdicción exclusiva de los tribunales de la República Dominicana.
                </p>
            </section>

            <section>
                <h2>9. Contacto</h2>
                <p>
                    Si tiene preguntas sobre estos Términos, contáctenos en: <a href="mailto:legal@descubrerd.com">legal@descubrerd.com</a>
                </p>
            </section>
        </>
    );
}

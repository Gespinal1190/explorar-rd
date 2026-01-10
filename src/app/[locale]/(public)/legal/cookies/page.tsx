
export const metadata = {
    title: 'Política de Cookies | DescubreRD',
    description: 'Información sobre el uso de cookies en DescubreRD.',
};

export default function CookiesPage() {
    return (
        <>
            <h1 className="text-3xl font-black text-gray-900 mb-8">Política de Cookies</h1>
            <p className="text-sm text-gray-500 mb-8">Última actualización: 10 de Enero, 2026</p>

            <section className="mb-8">
                <h2>1. ¿Qué son las Cookies?</h2>
                <p>
                    Las cookies son pequeños archivos de texto que los sitios web que visita colocan en su ordenador o dispositivo móvil.
                    Se utilizan ampliamente para hacer que los sitios web funcionen, o funcionen de manera más eficiente, así como para proporcionar información a los propietarios del sitio.
                </p>
            </section>

            <section className="mb-8">
                <h2>2. ¿Cómo usamos las Cookies?</h2>
                <p>
                    DescubreRD utiliza cookies para:
                </p>
                <ul>
                    <li>Mantener su sesión activa mientras navega por el sitio.</li>
                    <li>Recordar sus preferencias y configuraciones (como el idioma o moneda).</li>
                    <li>Analizar cómo utiliza nuestro sitio para mejorar la usabilidad.</li>
                    <li>Facilitar el proceso de reserva y pago.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2>3. Tipos de Cookies que utilizamos</h2>

                <h3>3.1. Cookies Estrictamente Necesarias</h3>
                <p>
                    Estas cookies son esenciales para que pueda navegar por el sitio web y utilizar sus funciones. Sin estas cookies, no se pueden proporcionar servicios como el carrito de compras o la facturación electrónica.
                </p>

                <h3>3.2. Cookies de Rendimiento y Análisis</h3>
                <p>
                    Estas cookies recopilan información sobre cómo los visitantes utilizan un sitio web, por ejemplo, qué páginas visitan con más frecuencia.
                    Utilizamos herramientas como Google Analytics para entender mejor el comportamiento de nuestros usuarios.
                </p>

                <h3>3.3. Cookies de Funcionalidad</h3>
                <p>
                    Permiten que el sitio web recuerde las elecciones que hace (como su nombre de usuario, idioma o la región en la que se encuentra) y proporcione funciones mejoradas y más personales.
                </p>
            </section>

            <section className="mb-8">
                <h2>4. Gestión de Cookies</h2>
                <p>
                    La mayoría de los navegadores web permiten cierto control de la mayoría de las cookies a través de la configuración del navegador.
                    Para obtener más información sobre las cookies, incluido cómo ver qué cookies se han establecido, visite <a href="http://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a> o <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
                </p>
                <p>
                    Tenga en cuenta que si deshabilita las cookies, es posible que algunas funciones de nuestro sitio no funcionen correctamente.
                </p>
            </section>
        </>
    );
}

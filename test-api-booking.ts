
const tourId = "cmjz0i0120004im6z24u67ctl"; // from previous step

async function testApi() {
    try {
        const res = await fetch("http://localhost:3000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Mock cookie if possible or rely on public access if I disabled auth? No, auth is required.
                // I can't easily fetch with auth from this script without a valid session cookie.
            },
            body: JSON.stringify({
                tourId,
                date: "2026-05-01",
                people: 2,
                totalPrice: 9000,
                paymentMethod: "cash"
            })
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Response:", text);
    } catch (e) {
        console.error(e);
    }
}
testApi();

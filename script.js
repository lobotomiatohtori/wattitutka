const taulukko = document.getElementById("hinnat");

// Haetaan sähkön hinnt API:sta
fetch("https://api.porssisahko.net/v1/latest-prices.json")
.then(response => response.json())
.then(data => {

    taulukko.innerHTML = "";

    //Muutetaan API:n data omaan muotoon
    const hinnat = data.prices.map(rivi => ({
        aika: rivi.startDate.substring(11, 16),
        hinta: rivi.price
    }));

    //Täytetään taulukko
    hinnat.forEach(rivi => {
        taulukko.innerHTML += `
            <tr>
                <td>${rivi.aika}</td>
                <td>${rivi.hinta}</td>
            </tr>
        `;
    });

    // Etsitään halvin hinta
    const halvin = hinnat.reduce((pienin, nykyinen) =>
    nykyinen.hinta < pienin.hinta ? nykyinen : pienin
    );

    // Näytetään halvin tunti
    document.getElementById("halvin").textContent =
    `Sähkö on halvinta tänään klo ${halvin.aika} (${halvin.hinta} snt/kWh)`;
})

.catch(error => {
    taulukko.innerHTML = `
        <tr>
            <td colspan="2">
                Hintojen lataaminen epäonnistui.
            </td>
        </tr>
    `;
});

const taulukko = document.getElementById("hinnat");
const halvinElementti = document.getElementById("halvin");

fetch("https://api.porssisahko.net/v1/latest-prices.json")
  .then(response => response.json())
  .then(data => {
    // Tyhjennetään "Ladataan tietoja..." -rivi
    taulukko.innerHTML = "";

    // Käydään läpi kaikki hinnat
    data.prices.forEach(rivi => {
      // Muotoillaan kellonaika luettavampaan muotoon (esim. 14:00)
      const aika = new Date(rivi.startDate).toLocaleTimeString("fi-FI", {
        hour: "2-digit",
        minute: "2-digit"
      });

      // Lisätään rivi taulukkoon
      taulukko.innerHTML += `
        <tr>
          <td>${aika}</td>
          <td>${rivi.price.toFixed(2)}</td>
        </tr>
      `;
    });
  })
  .catch(error => {
    console.error("Virhe:", error);
    taulukko.innerHTML = `
      <tr>
        <td colspan="2">Hintojen lataaminen epäonnistui.</td>
      </tr>
    `;
  });

const taulukko = document.getElementById("hinnat");

fetch("https://api.spot-hinta.fi/Today")
  .then(response => response.json())
  .then(data => {
    taulukko.innerHTML = "";

    data.forEach(rivi => {
      const aika = new Date(rivi.DateTime).toLocaleTimeString("fi-FI", {
        hour: "2-digit",
        minute: "2-digit"
      });

      // spot-hinta.fi palauttaa hinnan euroina/kWh (esim. 0.05), joten kerrotaan 100:lla snt/kWh-muotoon
      const hintaSnt = (rivi.PriceWithTax * 100).toFixed(2);

      taulukko.innerHTML += `
        <tr>
          <td>${aika}</td>
          <td>${hintaSnt}</td>
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

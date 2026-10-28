const taulukko = document.getElementById("hinnat");
const nykyinenHinta = document.getElementById("nykyinen-hinta");
const voimassaolo = document.getElementById("voimassaolo");

function haeHinnat() {
  
  fetch("https://api.spot-hinta.fi/Today")
    .then(response => response.json())
    .then(data => {
      
      taulukko.innerHTML = "";
      
      const nyt = new Date();
      const nykyinenRivi = data.find(rivi => {
        
        const alku = new Date(rivi.DateTime);
        const loppu = new Date(alku);
        loppu.setMinutes(loppu.getMinutes() + 15);
        
        return nyt >= alku && nyt < loppu;
      });
      
      if (nykyinenRivi) {
        const hinta = (nykyinenRivi.PriceWithTax * 100).toFixed(2);
        nykyinenHinta.innerHTML = `
        <span class="price-value">${hinta}</span>
        <span class="price-unit">snt/kWh</span>
        `;
        
        const alkuAika = new Date(nykyinenRivi.DateTime);
        const loppuAika = new Date(alkuAika);
        loppuAika.setMinutes(
          loppuAika.getMinutes() + 15
        );
        
        voimassaolo.textContent =
          `Voimassa ${alkuAika.toLocaleTimeString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit"
          })} - ${loppuAika.toLocaleTimeString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit"
          })}`;
      }
      
      data.forEach(rivi => {
        const aika =
          new Date(rivi.DateTime)
          .toLocaleTimeString("fi-FI", {
            hour: "2-digit",
            minute: "2-digit"
          });
        
        const hintaSnt =
          (rivi.PriceWithTax * 100).toFixed(2);
        
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
                    <td colspan="2">
                        Hintojen lataaminen epäonnistui.
                    </td>
                </tr>
            `;

            nykyinenHinta.textContent = "--";
            voimassaolo.textContent = "";
        });
}

haeHinnat();

setInterval(haeHinnat, 60000);

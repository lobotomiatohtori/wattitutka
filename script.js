let priceChart = null;

const nykyinenHinta = document.getElementById("nykyinen-hinta");
const voimassaolo = document.getElementById("voimassaolo");
const paivamaara = document.getElementById("paivamaara");
const varttihinnat = document.getElementById("varttihinnat");

function paivitaNykyinenHinta() {
  fetch("https://api.spot-hinta.fi/Today")
    .then(response => response.json())
    .then(data => {
      
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
        <span class="price-value">
        ${hinta}
        </span>
        
        <span class="price-unit">
        snt/kWh
        </span>
        `;
        
        const alkuAika = new Date(nykyinenRivi.DateTime);
        const loppuAika = new Date(alkuAika);
        loppuAika.setMinutes(loppuAika.getMinutes() + 15);
        voimassaolo.textContent =
          `kello ${alkuAika.toLocaleTimeString(
            "fi-FI",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          
          )} - ${loppuAika.toLocaleTimeString(
            "fi-FI",
            {
              hour: "2-digit",
              minute: "2-digit"
            }
          )}`;
      }
    });
}

function haePaivanHinnat() {
  
  fetch("https://api.spot-hinta.fi/Today")
    .then(response => response.json())
    .then(data => {
      
      // -----------------------------------
      // LUODAAN TUNTIKESKIARVO KUVAAJAA VARTEN
      // -----------------------------------
      
      const hourData = {};
      data.forEach(rivi => {
        
        const aika = new Date(rivi.DateTime);
        const tunti = aika.getHours();
        const hinta = Number((rivi.PriceWithTax * 100).toFixed(2));
        
        if (!hourData[tunti]) {hourData[tunti] = [];}
        hourData[tunti].push(hinta);
      });
      
      const labels = [];
      const prices = [];
      
      Object.keys(hourData).forEach(tunti => {
        labels.push(tunti.padStart(2, "0") + ":00");
        
        const keskiarvo =
          hourData[tunti].reduce(
            (summa, arvo) =>
              summa + arvo,
            0
          ) / hourData[tunti].length;
        
        prices.push(keskiarvo.toFixed(2));
      });
      
      // -----------------------------------
      // CHART.JS
      // -----------------------------------
      
      const ctx = document.getElementById("priceChart");
      
      if (priceChart) {priceChart.destroy();}
      priceChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: labels,
          datasets: [{
            label: "Tuntikeskiarvo",
            data: prices,
            backgroundColor: "#9EFF1F",
            hoverBackgroundColor: "#B7FF52",
            borderRadius: 4
          }]
        },
        
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: "nearest",
            intersect: true
          },
          hover: {
            mode: "nearest",
            intersect: true
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              backgroundColor: "#00272B",
              titleColor: "#9EFF1F",
              bodyColor: "#FFFFFF",
              borderColor: "#9EFF1F",
              borderWidth: 2,
              padding: 16,
              cornerRadius: 1,
              displayColors: false,
              caretSize: 0,
              
              titleFont: {
                size: 16,
                weight: "bold"
              },
              bodyFont: {
                size: 14
              },
              callbacks: {
                title: function(context) {
                  return context[0].label;
                },
                label: function() {
                  return "Keskiarvo";
                },
                afterLabel: function(context) {
                  return context.parsed.y + " snt/kWh";
                }
              }
            }
          },
          
          scales: {
            x: {
              ticks: {
                color: "#FFFFFF"
              },
              grid: {
                color: "#20454B"
              }
            },
            
            y: {
              ticks: {
                color: "#FFFFFF"
              },
              grid: {
                color: "#20454B"
              }
            }
          }
        }
      });
    
    })
    
    .catch(error => {
      console.error("Virhe:", error);
      nykyinenHinta.textContent = "--";
      voimassaolo.textContent = "";
      paivamaara.textContent = "";
    });

}

// Piirretään päivän hintakaavio
haePaivanHinnat();

// Päivitetään nykyinen hinta
paivitaNykyinenHinta();

// Päivitetään nykyinen hinta minuutin välein
setInterval(paivitaNykyinenHinta, 60000);

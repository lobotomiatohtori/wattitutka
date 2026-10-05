const taulukko = document.getElementById("hinnat");
 
fetch("https://api.porssisahko.net/v1/latest-prices.json")
.then(response => response.json())
.then(data => {
 
console.log(data);
 
taulukko.innerHTML = `
<tr>
<td colspan="2">
Data saatiin API:sta.
</td>
</tr>
`;
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
});

document.addEventListener("DOMContentLoaded", () => {
  let data, val;
  async function getData() {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
      );
      data = await response.json();
      createTable(data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  }

  //using then()
  function getDataThen() {
    fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }

  getData();
  getDataThen();
  function createTable(data) {
    const table = document.querySelector("table");
    const tbody = table.querySelector("tbody");
    const noData = document.querySelector("#no-data");

    if (data.length === 0) {
      table.style.display = "none";
      noData.textContent = "No data found.";
      return;
    } else {
      table.style.display = "table";
      noData.textContent = "";
    }
    tbody.innerHTML = "";
    data.forEach((element) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>
                <div class="img-container">
                    <img src=${element.image} />
                    <p class="coin-name">${element.name}</p>
                </div>
            </td>
            <td>${element.symbol.toUpperCase()}</td>
            <td>$${element.current_price}</td>
            <td>$${element.total_volume}</td>
            <td class="percentage">${element.price_change_percentage_24h.toFixed(
              2
            )}%</td>
            <td>Mkt Cap: $${element.market_cap}</td>`;

      const percentage = tr.querySelector(".percentage");
      percentage.style.color =
        element.price_change_percentage_24h < 0 ? "red" : "green";

      tbody.appendChild(tr);
    });
  }
  function getsearchData() {
    val = inputEle.value.trim().toLowerCase();
    return [...data].filter(
      (ele) =>
        ele.name.toLowerCase().includes(val) ||
        ele.symbol.toLowerCase().includes(val)
    );
  }
  const inputEle = document.querySelector("input");
  inputEle.addEventListener("input", (e) => {
    val = inputEle.value.trim().toLowerCase();
    if (val === "") createTable(data);
    const searchData = getsearchData();
    createTable(searchData);
  });
  const sortByMkt = document.querySelector("#byMktCap");
  const sortByPer = document.querySelector("#byPer");
  sortByMkt.addEventListener("click", () => {
    let sorted;
    if (val === "")
      sorted = [...data].sort((a, b) => a.market_cap - b.market_cap);
    else sorted = getsearchData().sort((a, b) => a.market_cap - b.market_cap);
    createTable(sorted);
  });
  sortByPer.addEventListener("click", () => {
    let sorted;
    if (val === "")
      sorted = [...data].sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
    else
      sorted = getsearchData().sort(
        (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h
      );
    createTable(sorted);
  });
});

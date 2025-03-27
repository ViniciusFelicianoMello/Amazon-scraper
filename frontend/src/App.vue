<template>
  <div class="amazon">
    <div class="amazon_top">
      <h1 class="amazon_title">Amazon</h1>
      <div class="input">
        <input
          class="amazon_input"
          type="text"
          v-model="keyword"
          placeholder="Search amazon.com"
        />
        <button class="amazon_button" @click="handleSearch">Search</button>
      </div>
    </div>
    <div id="results"></div>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      keyword: "",
    };
  },
  methods: {
    // The 'handleSearch' method is called when the user clicks the 'Search' button, send a request to the backend API with the search keyword, get the 'results' div to display the products and clear any previous search results
    async handleSearch() {
      // Check if the keyword is empty
      if (!this.keyword.trim()) {
        alert("Por favor, insira um termo de pesquisa.");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:3000/api/scrape?keyword=${encodeURIComponent(this.keyword)}`
        );

        // Check if the response is ok (status 200)
        if (!res.ok) {
          throw new Error("Erro ao buscar os dados da Amazon.");
        }

        const data = await res.json();

        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";

        // If there are products in the response, display them
        if (data.products?.length) {
          data.products.forEach((p) => {
            const div = document.createElement("div");
            div.className = "results_item";
            div.innerHTML = `
              <img class="results_img" src="${p.image}" width="100">
              <h3 class="results_title">${p.title}</h3>
              <p class="results_text">⭐ ${p.rating} | 📝 ${p.reviews}</p>
            `;
            resultsDiv.appendChild(div);
          });
        } else {
          resultsDiv.innerHTML = "<p>Nenhum resultado encontrado</p>";
        }
      } catch (error) {
        console.error(error);
        alert("Ocorreu um erro ao buscar os dados.");
      }
    },
  },
};
</script>

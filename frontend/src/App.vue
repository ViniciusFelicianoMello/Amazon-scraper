<template>
    <div>
      <h1>Amazon</h1>
      <input type="text" v-model="keyword" placeholder="Digite um termo de busca" />
      <button @click="handleSearch">Search</button>
      <div id="results"></div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App',
    // The 'data' function returns an object where we define the reactive properties of this component
    data() {
      return {
        keyword: ''
      };
    },
    methods: {
        // The 'handleSearch' method is called when the user clicks the 'Search' button, send a request to the backend API with the search keyword, get the 'results' div to display the products and clear any previous search results
      async handleSearch() {
        const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(this.keyword)}`);
        const data = await res.json();
        
        const resultsDiv = document.getElementById("results");
        resultsDiv.innerHTML = "";
  
        // If there are products in the response, display them
        if (data.products?.length) {
          data.products.forEach(p => {
            const div = document.createElement("div");
            div.innerHTML = `<h3>${p.title}</h3><p>⭐ ${p.rating} | 📝 ${p.reviews}</p><img src="${p.image}" width="100">`;
            resultsDiv.appendChild(div);
          });
        } else {
          resultsDiv.innerHTML = "<p>Nenhum resultado encontrado</p>";
        }
      }
    }
  }
  </script>
  
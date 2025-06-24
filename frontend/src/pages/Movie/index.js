import React from "react";

import './index.css';

export default function Movie() {
  return (
    <div className="movie-page">
      <h1>Detalhes do Filme</h1>
      <p>Esta página exibirá os detalhes do filme selecionado.</p>
      {/* Aqui você pode adicionar componentes para exibir informações do filme, como título, sinopse, elenco, etc. */}
    </div>
  );
}
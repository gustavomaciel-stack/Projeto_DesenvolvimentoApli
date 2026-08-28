function App() {
  function mostrarMensagem() {
    alert("As partidas serão disponibilizadas em breve!");
  }

  return (
    <div className="pagina">
      <header>
        <h1>MatchPoint</h1>
        <p>Organize suas partidas esportivas.</p>
      </header>

      <main>
        <section>
          <h2>Sobre o projeto</h2>

          <p>
            O MatchPoint será um sistema para criar partidas, controlar vagas
            e confirmar a participação dos jogadores.
          </p>

          <button onClick={mostrarMensagem}>Ver partidas</button>
        </section>

        <section>
          <h2>Tecnologias utilizadas</h2>

          <div className="tecnologias">
            <div className="card">
              <h3>Front-end</h3>
              <p>React com TypeScript</p>
            </div>

            <div className="card">
              <h3>Back-end</h3>
              <p>Node.js com Express</p>
            </div>

            <div className="card">
              <h3>ORM</h3>
              <p>Prisma ORM</p>
            </div>

            <div className="card">
              <h3>Banco de dados</h3>
              <p>MySQL</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>MatchPoint — Projeto em desenvolvimento</p>
      </footer>
    </div>
  );
}

export default App;
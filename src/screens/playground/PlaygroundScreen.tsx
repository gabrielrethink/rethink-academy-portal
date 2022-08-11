import styles from "./Playground.module.css";
import TrilhasComponent from "../home/components/trilhas/TrilhasComponent";
import CardMetas from "../../components/CardMetas/CardMetas";
function PlaygroundScreen() {
  return (
    <div className={styles.playground_container}>
      <div className={styles.main_content}>
        <h1>Manter essa tela Limpa, após criar o componente</h1>
        <h2>Playground de Componentes</h2>
        <p>Insira abaixo o seu componente:</p>

        <div className={styles.playground_container_inner}>
          <CardMetas />
        </div>
      </div>
    </div>
  );
}

export default PlaygroundScreen;

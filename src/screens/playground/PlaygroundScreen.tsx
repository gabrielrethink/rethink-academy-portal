import React, { useEffect, useState } from "react";
import styles from "./Playground.module.css";
import Label from "../../components/Label/Label";
import IconInfo from "@mui/icons-material/InfoOutlined";
import image from "../../assets/academyCardTrilhas.png";


// Simple Button
import SimpleButton from "../../components/SimpleButton/SimpleButton";
import CardTrilhas from "../trilhas/components/CardTrilhas/CardTrilhas";

function PlaygroundScreen() {

  return (
    <div className={styles.playground_container}>

      <div className={styles.playground_container_inner}>
        <h1>Manter essa tela Limpa, após criar o componente</h1>
      </div>
    </div>
  );
}

export default PlaygroundScreen;

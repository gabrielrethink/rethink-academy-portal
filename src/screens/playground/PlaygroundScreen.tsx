import React from "react";
import Button from "../../components/Button/Button";
import IconButton from "../../components/IconButton/IconButton";
import styles from "./Playground.module.css";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";

function PlaygroundScreen() {
  return (
    <div className={styles.playground_container}>
      <div className={styles.main_content}>
        <h2>Playground de Componentes</h2>
        <p>insira abaixo o seu componente:</p>
      </div>
      <div className={styles.sub_content}>
        <span>Componente IconButton</span>
        <IconButton size="big" type="primary" onClick={() => {}}>
          <AccessAlarmIcon />
        </IconButton>
        <IconButton size="small" type="primary" onClick={() => {}}>
          <AccessAlarmIcon />
        </IconButton>
        <IconButton size="big" type="secundary" onClick={() => {}}>
          <AccessAlarmIcon />
        </IconButton>
        <IconButton size="small" type="secundary" onClick={() => {}}>
          <AccessAlarmIcon />
        </IconButton>
        <IconButton size="big" type="ghost" onClick={() => {}}>
          <AccessAlarmIcon />
        </IconButton>
        <IconButton size="small" type="ghost" onClick={() => {}}>
          <AccessAlarmIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default PlaygroundScreen;

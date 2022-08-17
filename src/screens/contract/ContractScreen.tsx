import React, { useState } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import styles from "./ContractScreen.module.css";
import {
  CorporateFare,
  Schedule,
  BusinessCenter,
  DirectionsBus,
  LaptopMac,
  InfoOutlined,
} from "@mui/icons-material";
import NewDocumentCard from "./components/NewDocumentCard/NewDocumentCard";
import DocumentCard, {
  documentsList,
} from "./components/DocumentCard/DocumentCard";
import { useAuth } from "../../context/AuthContext";
import Dropdown from "./components/Dropdown/StatusDropdown";
import StatusTag from "./components/StatusTag/StatusTag";

const Info = {
  college: "Universidade do Estado de Minas Gerais",
  semester: 7,
  workStartTime: 13,
  workEndTime: 19,
  transportationVoucher: 130,
  materialsProvided: [
    "Computador",
    "Teclado",
    "Mouse",
    "Monitor",
    "Apoio ergonômico",
  ],
  statusMessage: "Envie todos os documentos necessários obter REX's."
};

const ContractScreen = () => {

  const [contractStatus, setContractStatus] = useState("");
  const { user } = useAuth();
  console.log({user})
  
  return (
    <div className={styles.contract_outer_container}>
      <div className={styles.breadcrumb}>
        <Breadcrumb
          breadcrumbItems={[
            { title: "Home", link: "/" },
            { title: "Contrato", link: "/contrato" },
          ]}
        />
      </div>
      <div className={styles.contract_title}>Contrato</div>
      <div className={styles.contract_inner_container}>
        <div className={styles.contract_status}>
          <div className={styles.contract_current_status}>
            <div className={styles.contract_current_status_text}>
              <h1>Status do Contrato</h1>
              <p>{Info.statusMessage}</p>
            </div>
            <div className={styles.contract_current_status_tag}>
              {/* <StatusTag type="active"/> */}
              <Dropdown setValue={setContractStatus} value={contractStatus} id={""} width={181}/>
            </div>
          </div>
          <h1>Documentos</h1>
          <div className={styles.cards_container}>
            {documentsList.map((content) => (
              <DocumentCard
                key={content.id}
                id={content.id}
                name={content.name}
              />
            ))}
            <NewDocumentCard />
          </div>
        </div>
        <div className={styles.contract_info}>
          <h1>Suas Informações</h1>
          <div className={styles.contract_info_card}>
            <div className={styles.contract_info_card_content}>
              <p>
                {" "}
                <CorporateFare /> Faculdade
              </p>
              <span>{Info.college}</span>
              <p>
                {" "}
                <Schedule /> Período
              </p>
              <span>{`${Info.semester}º`}</span>
              <p>
                {" "}
                <BusinessCenter /> Horário de trabalho
              </p>
              <span>{`${Info.workStartTime}h-${Info.workEndTime}h`}</span>
              <p>
                {" "}
                <DirectionsBus /> Média de gasto com Vale Transporte
              </p>
              <span>{`R$${Info.transportationVoucher}/mês`}</span>
              <p>
                {" "}
                <LaptopMac /> Materiais Fornecidos
              </p>
              <span>{Info.materialsProvided.join(", ")}</span>
              <div className={styles.card_content_line} />
              <small>
                <InfoOutlined color="disabled" /> Caso haja algum erro ou algo
                precise ser atualizado, entre em contato com o RH/Embaixador.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractScreen;

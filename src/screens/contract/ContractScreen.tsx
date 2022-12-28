import styles from "./ContractScreen.module.css";

import { useEffect, useState } from "react";

//context
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";

//components
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import NewDocumentCard from "./components/NewDocumentCard/NewDocumentCard";
import Dropdown from "./components/Dropdown/StatusDropdown";
import StatusTag from "./components/StatusTag/StatusTag";
import ButtonWithIcon from "../../components/ButtonWithIcon/ButtonWithIcon";
import DocumentCard, { fileType } from "./components/DocumentCard/DocumentCard";
import SelectionTeam from "../../components/SelectionTeam/SelectionTeam";

//libs
import {
  CorporateFare,
  Schedule,
  BusinessCenter,
  DirectionsBus,
  LaptopMac,
  InfoOutlined,
  ModeEditOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { TextField } from "@mui/material";

import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import EmblemCard from "../../components/EmblemCard/EmblemCard";
import { api } from "../../services/backend/Api";

export type infoType = {
  email: string;
  college: string;
  semester: string;
  workTime: string;
  transportationVoucher: string;
  providedEquipment: string;
  status: string;
};

const ContractScreen = () => {
  const navigate = useNavigate();
  const [allowGet, setAllowGet] = useState(false);
  const [studentEmail, setStudentEmail] = useState<any>(null);
  const [contractStatus, setContractStatus] = useState("");
  const [isDeleted, setIsDeleted] = useState("");
  const [isShown, setIsShown] = useState(true);
  const [files, setFiles] = useState<fileType[] | any>();
  const [emblemCardOpen, setEmblemCardOpen] = useState(false);
  const { notify } = useNotification();
  const [info, setInfo] = useState<infoType>();
  const { user } = useAuth();
  const editIcon = <ModeEditOutlined />;
  const saveIcon = <SaveOutlined />;

  const validateRoute = () => {
    let link = window.location.pathname.split("/");
    if (link.length < 4 && user.role === "AMBASSADOR") {
      navigate("/dashboard");
      window.location.reload();
      return false;
    }
    if (
      link.length === 4 &&
      link[link.length - 1] &&
      link[link.length - 1] != ""
    ) {
      if (user.role === "AMBASSADOR" && studentEmail === null) {
        setStudentEmail(link[link.length - 1]);
        return true;
      } else if (user.role === "STUDENT") {
        navigate("/dashboard/contrato");
        window.location.reload();
      }
    } else {
      return true;
    }
  };

  const getInfo = async (email: string) => {
    const info = await api.get(`/info/${email}`);
    info.data.info
      ? setContractStatus(info.data.info.status)
      : setContractStatus("");
    return info.data.info;
  };

  const getFiles = async () => {
    if (user.role === "AMBASSADOR" && studentEmail) {
      const fileData = await api.get<fileType>(`/bucket`, {
        params: { email: studentEmail },
      });
      setFiles(fileData.data);
      return fileData.data;
    } else {
      const fileData = await api.get<fileType>(`/bucket`, {
        params: { email: user.email },
      });
      setFiles(fileData.data);
      return fileData.data;
    }
  };

  useEffect(() => {
    if (user) {
      if (validateRoute()) {
        setAllowGet(true);
      } else {
        setAllowGet(false);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && allowGet) {
      getFiles();
    }
  }, [user, isDeleted, allowGet]);

  const getBadge = async () => {
    try {
      const badge = await api.get(`/badge/${user.email}`);
      if (!badge.data["goals"].includes("StatusDoContratoAtivo")) {
        giveBadge();
        setEmblemCardOpen(true);
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  const giveBadge = async () => {
    try {
      const badge = await api.post(`/badge`, {
        badge: "goals",
        email: user.email,
        description: "StatusDoContratoAtivo",
      });
      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      user && user.role === "STUDENT" && getBadge();
    };
  }, [info, user]);

  const handlerContractStatus = async (value: any) => {
    if (info) {
      if (studentEmail) {
        setContractStatus(value);
        await api.post(`/info/${studentEmail}`, {
          status: value,
        });
        notify({
          title: "Status do Contrato atualizado!",
          type: "success",
        });
      }
    } else {
      try {
        setContractStatus(value);
        const info = await api.post(`/info`, {
          email: studentEmail,
          status: value,
        });
        notify({
          title: "Status do Contrato atualizado!",
          type: "success",
        });
        return;
      } catch (error) {
        console.log(error);
      }
    }
  };

  const { handleSubmit, control } = useForm();

  const onSubmit = async (data: any) => {
    if (info) {
      if (studentEmail) {
        await api.post(`/info/${studentEmail}`, {
          college: data.college,
          semester: data.semester,
          workTime: data.workTime,
          transportationVoucher: data.transportationVoucher,
          providedEquipment: data.providedEquipment,
        });
        notify({
          title: "Informações atualizadas!",
          type: "success",
        });
        handleClick();
        setInfo(data);
      }
    } else {
      try {
        const info = await api.post(`/info`, {
          email: studentEmail,
          college: data.college,
          semester: data.semester,
          workTime: data.workTime,
          transportationVoucher: data.transportationVoucher,
          providedEquipment: data.providedEquipment,
        });
        notify({
          title: "Informações atualizadas!",
          type: "success",
        });
        handleClick();
        setInfo(data);
        return;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (user && allowGet) {
        if (user.role === "AMBASSADOR" && studentEmail) {
          setInfo(await getInfo(studentEmail));
          navigate("/dashboard/contrato/" + studentEmail);
          getFiles();
        } else {
          setInfo(await getInfo(user.email));
        }
      }
    })();
    return;
  }, [user, studentEmail, allowGet]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleClick = () => {
    setIsShown((current) => !current);
  };

  return (
    <div className={styles.contract_outer_container}>
      {emblemCardOpen && (
        <EmblemCard
          content={"Você enviou todos os documentos necessários!"}
          badge={"goals"}
          onClickCollect={() => setEmblemCardOpen(false)}
        />
      )}
      <div className={styles.breadcrumb}>
        {studentEmail && user.role === "AMBASSADOR" ? (
          <Breadcrumb
            breadcrumbItems={[
              { title: "Home", link: "/" },
              {
                title: `${
                  studentEmail.split(".")[0].charAt(0).toUpperCase() +
                  studentEmail.split(".")[0].slice(1)
                }`,
                link: `/dashboard/perfilDoEstagiario/${studentEmail}`,
              },
              { title: "Contrato", link: "/" },
            ]}
          />
        ) : (
          <Breadcrumb
            breadcrumbItems={[
              { title: "Home", link: "/" },
              { title: "Contrato", link: "/contrato" },
            ]}
          />
        )}
      </div>
      {user.role === "AMBASSADOR" ? (
        <div className={styles.contract_title_ambassador}>
          Contrato
          <SelectionTeam internSelected={setStudentEmail} />
        </div>
      ) : (
        <div className={styles.contract_title}>Contrato</div>
      )}

      <div className={styles.contract_inner_container}>
        <div className={styles.contract_status}>
          <div className={styles.contract_current_status}>
            <div className={styles.contract_current_status_text}>
              <h1>Status do Contrato</h1>
              {user.role === "STUDENT" ? (
                <p>Envie todos os documentos necessários obter o emblema.</p>
              ) : (
                <p>
                  Confira se o estagiário enviou todos os documentos necessários
                </p>
              )}
            </div>
            <div className={styles.contract_current_status_tag}>
              {user.role === "AMBASSADOR" ? (
                <Dropdown
                  setValue={handlerContractStatus}
                  value={contractStatus}
                  id={""}
                  width={181}
                />
              ) : info?.status === "Pendente" ? (
                <StatusTag type={"pending"} />
              ) : info?.status === "Ativo" ? (
                <StatusTag type={"active"} />
              ) : info?.status === "Encerrado" ? (
                <StatusTag type={"inactive"} />
              ) : (
                ""
              )}
            </div>
          </div>
          <h1>Documentos</h1>
          <div className={styles.cards_container}>
            {files &&
              files.map((content: any) =>
                user.role === "AMBASSADOR" ? (
                  <DocumentCard
                    isDeleted={isDeleted}
                    setIsDeleted={setIsDeleted}
                    key={content.id}
                    id={content.id}
                    title={content.title}
                    type={"embassador"}
                    url={content.url}
                    studentEmail={studentEmail}
                  />
                ) : (
                  <DocumentCard
                    isDeleted={isDeleted}
                    setIsDeleted={setIsDeleted}
                    key={content.id}
                    id={content.id}
                    title={content.title}
                    type={"student"}
                    url={content.url}
                  />
                )
              )}

            {user.role === "AMBASSADOR" ? (
              ""
            ) : (
              <NewDocumentCard setFiles={setFiles} />
            )}
          </div>
        </div>
        <div className={styles.contract_info}>
          {user.role === "AMBASSADOR" ? (
            <h1>Sobre o Estagiário </h1>
          ) : (
            <h1>Suas Informações</h1>
          )}
          {isShown && (
            <div className={styles.contract_info_card}>
              <div className={styles.contract_info_card_content}>
                <p>
                  {" "}
                  <CorporateFare /> Faculdade
                </p>
                <span>{info?.college}</span>
                <p>
                  {" "}
                  <Schedule /> Período
                </p>
                <span>{info?.semester}</span>
                <p>
                  {" "}
                  <BusinessCenter /> Horário de trabalho
                </p>
                <span>{info?.workTime}</span>
                <p>
                  {" "}
                  <DirectionsBus /> Média de gasto com Vale Transporte
                </p>
                <span>{info?.transportationVoucher}</span>
                <p>
                  {" "}
                  <LaptopMac /> Materiais Fornecidos
                </p>
                <span>{info?.providedEquipment}</span>
                {user.role === "AMBASSADOR" ? (
                  <ButtonWithIcon
                    type={"secondary"}
                    size={"block"}
                    text={"Editar"}
                    icon={editIcon}
                    position={"left"}
                    onClick={() => {
                      handleClick();
                    }}
                  />
                ) : (
                  <>
                    <div className={styles.card_content_line} />
                    <small>
                      <InfoOutlined color="disabled" /> Caso haja algum erro ou
                      algo precise ser atualizado, entre em contato com o
                      RH/Embaixador.
                    </small>
                  </>
                )}
              </div>
            </div>
          )}
          {!isShown && (
            <div className={styles.contract_info_card}>
              <form
                className={styles.contract_info_card_content}
                style={{ gap: "5px" }}
                onSubmit={handleSubmit(onSubmit)}
              >
                <p>
                  {" "}
                  <CorporateFare /> Faculdade
                </p>
                <Controller
                  name="college"
                  control={control}
                  defaultValue={info?.college}
                  render={({ field: { onChange, value } }: any) => (
                    <TextField
                      size="small"
                      value={value}
                      onChange={onChange}
                      variant="standard"
                      sx={{ mb: 1.8 }}
                    />
                  )}
                />
                <p>
                  {" "}
                  <Schedule /> Período
                </p>
                <Controller
                  name="semester"
                  control={control}
                  defaultValue={info?.semester}
                  render={({ field: { onChange, value } }: any) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      size="small"
                      variant="standard"
                      sx={{ mb: 1.8 }}
                    />
                  )}
                />
                <p>
                  {" "}
                  <BusinessCenter /> Horário de trabalho
                </p>
                <Controller
                  name="workTime"
                  control={control}
                  defaultValue={info?.workTime}
                  render={({ field: { onChange, value } }: any) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      size="small"
                      variant="standard"
                      sx={{ mb: 1.8 }}
                    />
                  )}
                />

                <p>
                  {" "}
                  <DirectionsBus /> Média de gasto com Vale Transporte
                </p>
                <Controller
                  name="transportationVoucher"
                  control={control}
                  defaultValue={info?.transportationVoucher}
                  render={({ field: { onChange, value } }: any) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      size="small"
                      variant="standard"
                      sx={{ mb: 1.8 }}
                    />
                  )}
                />
                <p>
                  {" "}
                  <LaptopMac /> Materiais Fornecidos
                </p>
                <Controller
                  name="providedEquipment"
                  control={control}
                  defaultValue={info?.providedEquipment}
                  render={({ field: { onChange, value } }: any) => (
                    <TextField
                      value={value}
                      onChange={onChange}
                      size="small"
                      variant="standard"
                      sx={{ mb: 2.6 }}
                    />
                  )}
                />
                <div className={styles.edit_buttons}>
                  <ButtonWithIcon
                    type={"primary"}
                    size={"small"}
                    width={500}
                    text={"Salvar"}
                    icon={saveIcon}
                    position={"left"}
                    onClick={() => {}}
                  />
                  <ButtonWithIcon
                    type={"outline"}
                    size={"small"}
                    width={500}
                    text={"Cancelar"}
                    icon={<p></p>}
                    position={"left"}
                    onClick={() => {
                      handleClick();
                    }}
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractScreen;

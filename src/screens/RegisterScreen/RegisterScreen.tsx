import React, { useEffect, useState } from "react";

//Components
import CalendarComponent from "../../components/DatePicker/Components/Calendar";
import AccordionMM from "../../components/AccordionMM/AccordionMM";
import AddTask from "../../components/AddTask/AddTask";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import InputSearch from "../../components/InputSearch/InputSearch";
import Note from "../../components/Note/Note";
import Toast from "../../components/Toast/Toast";
import Gamification from "./Gamification/Gamification";
import EmblemCard from "../../components/EmblemCard/EmblemCard";
import { Dayjs } from "dayjs";

//CSS
import styles from "./RegisterScreen.module.css";

// Backend
import {
  getRecordOfDay,
  removeTask,
  getHoursLastDay,
  getHoursOfMonth,
} from "../../services/backend/Tasks";
import dayjs from "dayjs";

const RegisterScreen = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [update, setUpdate] = useState(false);
  const [thereTask, setThereTask] = useState(true);
  const [time, setTime] = useState(0);
  const [controller, setController] = useState(false);
  const [prevHours, setPrevHours] = useState(0);
  const [controllerPrevHours, setControllerPrevHours] = useState(false);
  const [controllerEmblem, setControllerEmblem] = useState(false);
  const [formData, setFormData] = useState<{
    taskName: string;
    date: string;
    startTime: string;
    endTime: string;
    tag: string;
    status: string;
    description: string;
  }>({
    taskName: "",
    date: new Date().toISOString(),
    startTime: "",
    endTime: "",
    tag: "",
    status: "",
    description: "",
  });

  // type task = {
  //   name: string;
  //   description: string;
  //   taskDate: string;
  //   startDate: string;
  //   endDate: string;
  //   startTime: string;
  //   endTime: string;
  //   tags: string;
  //   status: string;
  //   userEmail: string;
  //   duration: string;
  //   time: string;
  // };

  const changeData = () => {
    setThereTask(true);
    setUpdate(true);
  };

  const thereIsTask = (filter: any[]) => {
    let exist = false;

    if (filter.length > 0) {
      filter.map((task) => {
        if (task[0]) {
          exist = true;
        }
      });
    }
    return exist;
  };

  const filterWord = (contentInput: string) => {
    const filter = tasks.map((day: any[]) =>
      day!.filter((task) =>
        task.name.toLowerCase().includes(contentInput.toLowerCase())
      )
    );

    setUpdate(false);
    setTasks(filter);

    if (thereIsTask(filter)) {
      setThereTask(true);
    } else {
      setThereTask(false);
    }
  };

  const handleDelete = (id: string) => {
    removeTask(id);
    setUpdate(true);
  };

  const getTime = async () => {
    await getRecordOfDay("fabiana.kamo@rethink.dev") // ALTERAR
      .then((response) => {
        let helper = 0;
        response.map((record: any) => {
          helper += record.time;
        });
        helper = helper / 60;
        setTime(Math.trunc(helper));
        if (Math.trunc(helper) >= 6) {
          setController(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const getPrevHours = async () => {
    await getHoursLastDay("fabiana.kamo@rethink.dev") // ALTERAR
      .then((response) => {
        setPrevHours(response);
        if (response < 6) {
          setControllerPrevHours(true);
        }
      })
      .catch((err) => console.error(err));
  };

  const getMonthHours = async () => {
    await getHoursOfMonth("fabiana.kamo@rethink.dev") // ALTERAR
      .then((response) => {
        setPrevHours(response);
        if (response >= 120) {
          setControllerEmblem(true);
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    getTime();
    getPrevHours();
    getMonthHours();
  }, []);

  // FIX:
  // Logica para perder o chapeu - 3 dias após não registrar as 6h diarias - Registrando normalmente no dia em que perdeu o chapéu, você ganhará novamente um chapéu -- PRIORITY
  // Logica para ganhar o emblema - 1 mes depois de horas registradas -- PRIORITY
  // Encontrar logica para o gif nao aparecer sempre que atualiza a pagina -- PRIORITY

  return (
    <div className={styles.register_container}>
      <div className={styles.modal_container}>
        {/* {controller && (
          <Gamification
            setActive={() => setController(false)}
            id="outside"
            type="Win"
          />
        )} */}
        {/* {controllerPrevHours && (
          <Gamification
            setActive={() => setControllerPrevHours(false)}
            id="outside"
            type="Degrading"
          />
        )} */}
        {/* {controllerPrevHours && (
          <Gamification
            setActive={() => setControllerPrevHours(false)}
            id="outside"
            type="Losing"
          />
        )} */}
        {controllerEmblem && (
          <EmblemCard
            badge="timeRecord"
            content="Teste"
            onClickCollect={() => setControllerEmblem(false)}
          />
        )}
      </div>
      <div className={styles.register_content}>
        <div className={styles.register_header}>
          <div className={styles.register_breadcrumb}>
            <Breadcrumb
              breadcrumbItems={[
                { title: "Home", link: "/" },
                { title: "Registro de Horas", link: "/dashboard/register" },
              ]}
            />
          </div>
          <div style={{ width: "450px", height: "20px" }}></div>
        </div>
        <div className={styles.register_body}>
          <div className={styles.register_registerTasks}>
            <div className={styles.container_title}>
              <p className={styles.title}>Registro de Tarefas</p>
            </div>
            <AddTask formData={formData} setFormData={setFormData} />
          </div>
          <div className={styles.register_reminders}>
            <Note />
          </div>
        </div>
      </div>
      <div className={styles.register_searchTasks}>
        <div className={styles.searchTasks_container}>
          <div className={styles.searchTasks_inputSearch}>
            <InputSearch
              hasIcon
              type="default"
              placeholder="Procurar tarefas realizadas"
              onChange={filterWord}
              changeData={changeData}
            />
          </div>
          <div className={styles.searchTasks_CalendarTitle}>
            <p>Calendário</p>
          </div>
          <div className={styles.searchTasks_Calendar}>
            <CalendarComponent setTasks={setTasks} update={update} />
          </div>
          <div className={styles.searchTasks_TasksTitle}>
            <p>Tasks e Reuniões</p>
          </div>

          <div className={styles.searchTasks_Tasks}>
            {!thereTask && (
              <Toast
                title=" Não existem tarefas cadastradas com esse nome!"
                type="error"
              />
            )}
            {tasks.length > 0 &&
              tasks.map(
                (day: any[], index) =>
                  day[0] && (
                    <div key={index}>
                      <div className={styles.searchTasks_Date}>
                        <svg
                          width="20"
                          height="21"
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M13.75 1C13.75 0.585786 13.4142 0.25 13 0.25C12.5858 0.25 12.25 0.585786 12.25 1V2.25H8.5C8.08579 2.25 7.75 2.58579 7.75 3C7.75 3.41421 8.08579 3.75 8.5 3.75H12.25V5C12.25 5.41421 12.5858 5.75 13 5.75C13.4142 5.75 13.75 5.41421 13.75 5V1ZM0.25 9V5C0.25 3.48122 1.48122 2.25 3 2.25H4.25V1C4.25 0.585786 4.58579 0.25 5 0.25C5.41421 0.25 5.75 0.585786 5.75 1V3V5C5.75 5.41421 5.41421 5.75 5 5.75C4.58579 5.75 4.25 5.41421 4.25 5V3.75H3C2.30964 3.75 1.75 4.30964 1.75 5V8.25H18.25V5C18.25 4.30964 17.6904 3.75 17 3.75H16.5C16.0858 3.75 15.75 3.41421 15.75 3C15.75 2.58579 16.0858 2.25 16.5 2.25H17C18.5188 2.25 19.75 3.48122 19.75 5V9V18C19.75 19.5188 18.5188 20.75 17 20.75H3C1.48122 20.75 0.25 19.5188 0.25 18V9ZM1.75 18V9.75H18.25V18C18.25 18.6904 17.6904 19.25 17 19.25H3C2.30964 19.25 1.75 18.6904 1.75 18Z"
                            fill="#6C6F93"
                          />
                        </svg>
                        <p> {day[0].taskDate}</p>
                      </div>
                      <div className={styles.searchTasks_Tasks}>
                        {day.map((task) => {
                          return (
                            <div className={styles.viewTasks_accordion}>
                              <AccordionMM
                                key={task.id}
                                id={task.id}
                                title={task.name}
                                duration={task.duration}
                                description={task.description}
                                tags={[task.tags]}
                                status={[task.status]}
                                time={`${task.startTime} às ${task.endTime}`}
                                size="small"
                                hasIcons={true}
                                onClickDelete={handleDelete}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;

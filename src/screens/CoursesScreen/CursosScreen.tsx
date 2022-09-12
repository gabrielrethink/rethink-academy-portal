// React
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// API
import { api } from "../../services/api";

// Styles
import styles from "./CursosScreen.module.css";

// Context
import { useAuth } from "../../context/AuthContext";

// Types
import { UserLessons, Trail, CourseResponse } from "../types/CourseTypes";

// Icons
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import IconPlan from "@mui/icons-material/CalendarTodayOutlined";
import IconProgress from "@mui/icons-material/TrendingUpOutlined";

// Components
import CardProgress from "./Components/CardProgress/CardProgress";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ButtonWithIcon from "../../components/ButtonWithIcon/ButtonWithIcon";
import CardCourse from "./Components/CardCourse/CardCourse";
import CardAddCourse from "./Components/CardAddCourse/CardAddCourse";
import CardSyllabus from "./Components/CardSyllabus/CardSyllabus";

interface CoursesWatched {
  courseStyle: "COURSE" | "WORKSHOP" | "TRAINING" | "LECTURE";
  coursecompleted: 1 | 2 | 3;
  cratedAt: string;
  description: string;
  id: string;
  imageTeacher: string;
  learning: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  name: string;
  skills: string;
  teacherDescription: string;
  teacherName: string;
  trailId: string;
  workload: number;
}

const CursosScreen = () => {
  const [intern, setIntern] = useState(false);

  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  let trailId = location.pathname.replace("/dashboard/trilhas/", "");

  const [selectedCourse, setSelectedCourse] = useState<CourseResponse>(
    {} as CourseResponse
  );

  const [addCourseIsOpen, setAddCourseIsOpen] = useState(false);
  const [syllabusIsOpen, setSyllabusIsOpen] = useState(false);
  const [progressIsOpen, setProgressIsOpen] = useState(false);
  const [editCourseIsOpen, setEditCourseIsOpen] = useState(false);

  const [courses, setCourses] = useState([]);
  const [trailName, setTrailName] = useState("");

  const [userByEmail, setUserByEMail] = useState<any>();
  const [coursesUser, setCoursesUser] = useState<CoursesWatched[]>([]);

  const getUserCourses = async () => {
    const responseCourses = await api.get(
      `/user/watched/course/${user.email}/${trailId}`
    );
    setCoursesUser(responseCourses.data.data);
    setUserByEMail(responseCourses.data.user);
  };

  const getCourseInformations = async () => {
    const responseCourse = await api.get(`/trail/course/${trailId}`);
    setTrailName(responseCourse.data.trailName.name);
    setCourses(responseCourse.data.course);
  };

  useEffect(() => {
    if (user?.email) {
      getUserCourses();
    }
  }, [user]);

  const onSubmitCourse = () => {
    if (editCourseIsOpen) {
      setEditCourseIsOpen(false);
    }
    if (addCourseIsOpen) {
      setAddCourseIsOpen(false);
    }
    getCourseInformations();
  };

  useEffect(() => {
    getCourseInformations();
  }, []);

  if (courses.length === 0) return <div>loading...</div>;

  return (
    <div className={styles.center}>
      <div className={styles.container_cursos}>
        <Breadcrumb
          breadcrumbItems={[
            { title: "Home", link: "/dashboard" },
            { title: "Cursos", link: "/dashboard/trilhas" },
            { title: `${trailName}`, link: "#" },
          ]}
        />
        <div className={styles.title}>
          <p>{`${trailName}`}</p>
          <div className={styles.title_buttons}>
            <ButtonWithIcon
              onClick={() => setSyllabusIsOpen(true)}
              icon={<IconPlan />}
              width={237}
              position="right"
              type="outline"
              text="Plano de Atividades"
              size="medium"
            />
            {!intern && (
              <>
                <ButtonWithIcon
                  onClick={() => setProgressIsOpen(true)}
                  icon={<IconProgress />}
                  width={169}
                  position="right"
                  type="outline"
                  text="Progresso"
                  size="medium"
                />
                <ButtonWithIcon
                  onClick={() => setAddCourseIsOpen(true)}
                  icon={<AddCircleOutlineIcon />}
                  width={218}
                  position="right"
                  type="primary"
                  text="Adicionar curso"
                  size="medium"
                />
              </>
            )}
          </div>
          {syllabusIsOpen && (
            <CardSyllabus
              user={userByEmail?.role.toLowerCase()}
              onClose={() => setSyllabusIsOpen(false)}
            />
          )}
          {progressIsOpen && (
            <CardProgress
              trailId={trailId}
              onClose={() => setProgressIsOpen(false)}
            />
          )}
          {addCourseIsOpen && (
            <CardAddCourse onClose={() => onSubmitCourse()} />
          )}
        </div>
        <div id="cards" className={styles.cards}>
          {!intern
            ? courses.map((course: CourseResponse, index) => (
                <CardCourse
                  intern={intern}
                  onClickIrAoCurso={() =>
                    navigate(`/dashboard/trilhas/${trailId}/curso/${course.id}`)
                  }
                  onClickColectEmblem={() => {}}
                  onClickEditCourse={() => {
                    setSelectedCourse(course);
                    setEditCourseIsOpen(true);
                  }}
                  key={index}
                  index={index}
                  title={course.name}
                  concluded={1}
                  emblem={false} //falta ver
                  type={course.courseStyle}
                />
              ))
            : coursesUser.map((course, index) => (
                <CardCourse
                  key={index}
                  index={index}
                  intern={intern}
                  onClickIrAoCurso={() =>
                    navigate(`/dashboard/trilhas/${trailId}/curso/${course.id}`)
                  }
                  onClickColectEmblem={async () => {
                    await api.post("/badge/", {
                      badge: "engineering",
                      email: `${user.email}`,
                    });
                  }}
                  onClickEditCourse={() => setEditCourseIsOpen(true)}
                  title={course.name}
                  concluded={course.coursecompleted}
                  emblem={true} //falta ver
                  type={course.courseStyle}
                />
              ))}

          {editCourseIsOpen && (
            <CardAddCourse
              course={selectedCourse}
              addCourse={false}
              onClose={() => onSubmitCourse()}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CursosScreen;

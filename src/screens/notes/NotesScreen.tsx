import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

import style from "./NotesScreen.module.css";

// Components
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import ButtonWithIcon from "../../components/ButtonWithIcon/ButtonWithIcon";
import TableContent, { noteType } from "./components/table/TableContent";
import TextEditor from "./components/textEditor/TextEditor";
import CategoryTag from "./components/CategoryTags/CategoryTag";
import PrivacyToggle from "./components/PrivacyToggle/PrivacyToggle";
import DeleteModal from "./components/DeleteModal/DeleteModal";

// Icons
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Images from "../../assets";
import { useNavigate } from "react-router-dom";

const NotesScreen = () => {
  const [state, setState] = useState<noteType | null>();

  let setCurrentNote = (note: noteType) => {
    setState(note);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const [categories, setCategories] = useState(state?.categories);
  const [isPublic, setIsPublic] = useState(state?.isPublic);
  const [title, setTitle] = useState(state?.title);
  const [content, setContent] = useState(state?.content);

  const [update, setUpdate] = useState(false);
  const [updateReturn, setUpdateReturn] = useState("");
  const [handleCreate, setHandleCreate] = useState(false);

  const [isModalOpen, setModalOpen] = useState(false);

  const [notes, setNotes] = useState<noteType[]>([]);

  const { user } = useAuth();
  // console.log(user);
  const navigate = useNavigate();

  const [studentEmail, setStudentEmail] = useState<any>(null);

  const validateRoute = () => {
    let link = window.location.pathname.split("/");
    // console.log(link);
    if (link.length === 4) {
      if (user.role === "EMBASSADOR" && studentEmail === null) {
        console.log("***");
        setStudentEmail(link[link.length - 1]);

        setUpdate((current) => !current);
        return true;
      } else if (user.role === "STUDENT") {
        navigate("/dashboard/notas");
        setUpdate((current) => !current);
        return false;
      }
    }
    return true;
  };

  const getNotes = async () => {
    if (studentEmail === null) {
      const notes = await axios.get(
        `http://localhost:4000/api/note/${user.email}`
      );
      setNotes(notes.data.notesFormated);
      return notes.data.notesFormated;
    } else {
      console.log("**");

      const notes = await axios.get(
        `http://localhost:4000/api/note/${studentEmail}`
      );

      console.log(
        notes.data.notesFormated.filter((note: any) => note.isPublic === true)
      );

      setNotes(
        notes.data.notesFormated.filter((note: any) => note.isPublic === true)
      );
      setUpdateReturn("*");

      return notes.data.notesFormated;
    }
  };

  useEffect(() => {
    if (user) {
      if (validateRoute()) {
        getNotes();

        setState(undefined);
        setCategories(undefined);
        setIsPublic(undefined);
        setTitle(undefined);
        setContent(undefined);
      }
    }
  }, [user, update, studentEmail, updateReturn, handleCreate]);

  const createNote = () => {
    console.log("create");

    const newNote = {
      email: user.email,
      title: "Sem título",
      categories: [false, false, false],
      isPublic: false,
      content: "Por favor insira seu texto aqui...",
    };

    axios.post(`http://localhost:4000/api/note`, newNote);

    setHandleCreate((current) => !current);
    // setUpdate((current) => !current);
  };

  const deleteNote = () => {
    if (state) {
      axios.delete(`http://localhost:4000/api/note/${state.id}`);
    }
    setUpdate((current) => !current);
    setModalOpen(false);
  };

  const saveNote = () => {
    const updateNote = {
      title: title,
      categories: categories,
      isPublic: isPublic,
      content: content,
    };
    if (!updateNote.title) {
      updateNote.title = "Sem título";
    }
    if (user.role === "EMBASSADOR") {
      if (studentEmail != null) {
        updateNote.isPublic = true;
      } else {
        updateNote.isPublic = false;
      }
    }
    if (state) {
      axios.post(`http://localhost:4000/api/note/${state.id}`, updateNote);
    }
    setUpdate((current) => !current);
  };

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (user) {
    return (
      <div className={style.notes_container}>
        <div className={style.container_extern}>
          <div className={style.table_header}>
            {user.role === "STUDENT" && (
              <div className={style.breadcrumb}>
                <Breadcrumb
                  breadcrumbItems={[
                    { title: "Home", link: "/" },
                    {
                      title: "Seu desenvolvimento",
                      link: "/desenvolvimentoPessoal",
                    },
                    { title: "Notas", link: "/notas" },
                  ]}
                />
              </div>
            )}

            <div className={style.table_header_inner}>
              <h1 className={style.table_header_inner_title}>Notas</h1>
              <ButtonWithIcon
                type="secondary"
                size="small"
                text="Nova nota"
                icon={<AddRoundedIcon />}
                position="left"
                width={176}
                onClick={createNote}
              />
            </div>
          </div>
          {/* --------------------Aviso sem notas---------------------- */}
          {notes.length > 0 ? (
            <div className={style.table}>
              <TableContent
                handleClick={setState}
                notes={notes}
                setNotes={setNotes}
              />
            </div>
          ) : (
            <div className={style.noNotes_container}>
              <div className={style.noNotes_warning}>
                <img src={Images.infoNotes} alt="Ícone de informação" />
                <p>Você ainda não possui nenhuma anotação.</p>
              </div>
            </div>
          )}
          {/* --------------------------------------------------------- */}
        </div>

        <div className={style.rightSideContainer}>
          {state && (
            <div className={style.textEditorContainer}>
              <div className={style.containerTop}>
                <div className={style.titleAndToggle}>
                  <div>
                    <input
                      type="text"
                      value={
                        state?.title != "Sem título" ? state?.title : "Título"
                      }
                      placeholder="Título"
                      onChange={(e) => {
                        e.preventDefault();
                        setTitle(e.target.value);
                        state.title = e.target.value;
                      }}
                    />
                  </div>
                  {user.role === "STUDENT" ? (
                    <PrivacyToggle
                      getVisibility={(isPublic) => {
                        setIsPublic(isPublic);
                      }}
                      setVisibility={state.isPublic}
                    />
                  ) : (
                    <button disabled className={style.privateBtn}>
                      <LockOutlinedIcon />
                      Privado
                    </button>
                  )}
                </div>

                <div className={style.categories}>
                  <CategoryTag
                    getCategories={(categories) => {
                      setCategories(categories);
                    }}
                    sendCategories={state.categories}
                  />
                </div>
              </div>

              <div className={style.textEditor}>
                <TextEditor
                  noteData={state}
                  getContent={(value) => {
                    setContent(value);
                  }}
                />
              </div>

              <div className={style.containerBottom}>
                <div className={style.saveDeleteButtons}>
                  <div className={style.saveButton}>
                    <ButtonWithIcon
                      type="primary"
                      size="small"
                      text="Salvar"
                      width={134}
                      position="left"
                      icon={<SaveOutlinedIcon />}
                      onClick={saveNote}
                    />
                  </div>
                  {studentEmail === null && (
                    <div className={style.deleteButton}>
                      <ButtonWithIcon
                        type="secondary"
                        size="small"
                        text="Excluir"
                        width={134}
                        position="left"
                        icon={<DeleteOutlineOutlinedIcon />}
                        onClick={() => setModalOpen(true)}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {isModalOpen && (
          <DeleteModal
            onClickConfirm={deleteNote}
            title="Tem certeza que deseja excluir a nota?"
            description="Ao confirmar essa ação, você não poderá recuperar esses dados."
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    );
  }
  return <div></div>;
};

export default NotesScreen;

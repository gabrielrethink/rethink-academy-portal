import { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown/Dropdown";
import Styles from "./HomeScreenEmabassador.module.css";
import Images from "../../assets";

const HomeScreenEmabassador = ({ user }: any) => {
  const [academyClass, setAcademyClass] = useState("1/2022");
  const [roleFilter, setRoleFilter] = useState<string[]>(["ENGINEERING"]);

  const roleClass = (role: string) => {
    const isSelected = roleFilter.find((title) => title === role);
    if (isSelected) {
      return `${Styles.role_selector_button} ${Styles.role_selector_button_active}`;
    }
    return Styles.role_selector_button;
  };

  const handlerOnClickRoleSelector = (role: string) => {
    const isSelected = roleFilter.findIndex((title) => title === role);
    console.log({ isSelected });
    if (isSelected >= 0) {
      setRoleFilter((prevValue) => prevValue.filter((title) => title !== role));
    } else {
      setRoleFilter((prevValue) => [...prevValue, role]);
    }
  };

  useEffect(() => {
    console.log(roleFilter);
  }, [roleFilter]);

  return (
    <div className={Styles.max_container}>
      <div className={Styles.home_limited_container}>
        <div className={Styles.home_container}>
          <p className={Styles.home_hello}>E ai, {user.name} 🥳</p>
          <div className={Styles.home_header}>
            <div>
              <p className={Styles.home_title}>Estagiários</p>
              <p className={Styles.home_tip}>
                Selecione uma turma para acompanhar a evolução
              </p>
            </div>
            <Dropdown
              setValue={setAcademyClass}
              value={academyClass}
              options={["1/2022"]}
              id={"Team"}
              width={185}
            />
          </div>
        </div>
        <div className={Styles.home_content}>
          <div className={Styles.home_content_header}>
            <p>
              Selecione um estagiário para ter acesso aos seus dados de
              desenvolvimento:
            </p>
            <div className={Styles.role_selector}>
              <button
                onClick={() => handlerOnClickRoleSelector("DESIGN")}
                className={roleClass("DESIGN")}
              >
                Design
              </button>
              <button
                onClick={() => handlerOnClickRoleSelector("ENGINEERING")}
                className={roleClass("ENGINEERING")}
              >
                Engenharia
              </button>
              <button
                onClick={() => handlerOnClickRoleSelector("PRODUCT")}
                className={roleClass("PRODUCT")}
              >
                Produto
              </button>
            </div>
          </div>
          <div className={Styles.cards_container}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div className={Styles.student_card}>
                <img
                  src={Images.cardArrow}
                  className={Styles.student_card_arrow}
                  alt="Rethink Arrow"
                />
                <div className={Styles.student_card_avatar}>
                  <img
                    src={user.avatarUrl}
                    className={Styles.avatar_img}
                    alt="Student Avatar Arrow"
                  />
                  <div className={Styles.avatar_level}>
                    <img
                      src={Images.icons.level_Icon}
                      className={Styles.avatar_icon}
                      alt="Rethink Arrow"
                    />
                    150
                  </div>
                </div>

                <div className={Styles.student_card_text}>
                  {user.name}
                  <button className={Styles.role_selector_button}>
                    Engenharia
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreenEmabassador;

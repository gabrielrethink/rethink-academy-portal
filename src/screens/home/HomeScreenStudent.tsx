/* eslint-disable react-hooks/exhaustive-deps */
import Styles from "./HomeStudent.module.css";
import Images from "../../assets";
import AcademyProgress from "../../components/AcademyProgress/AcademyProgress";
import LastGoalsCard from "../../components/LastGoalsCard/LastGoalsCard";
import ProgressBar from "../../components/ProgressBar/ProgressBar";
import Register from "../../components/Register/Register";
import { useAuth } from "../../context/AuthContext";

import TrilhasComponent from "./components/trilhas/TrilhasComponent";
import { getUserFromBackend } from "../../services/backend/UserService";
import { useEffect, useState } from "react";
import Emblem from "../../components/Emblem/Emblem";
import { getUserBadges } from "../../services/backend/BadgeService";

function HomeScreenStudent() {
  const { user } = useAuth();
  const [userAtt, setUserAtt] = useState<any>({});
  const [badges, setBadges] = useState<any>([]);

  const GetUser = async () => {
    const data = await getUserFromBackend(user.email);
    setUserAtt(data);
    const badgesData = await getUserBadges(user.email);

    let newBadges: any[] = [];
    for (const key in badgesData) {
      newBadges.push({ badgeNumber: badgesData[key].length, title: key });
    }
    setBadges(newBadges);
  };

  useEffect(() => {
    GetUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  const getStudentMain = () => {
    switch (user.main) {
      case "ENGINEERING":
        return "Engenharia";
      case "DESIGN":
        return "Design";
      case "PRODUCT":
        return "Produto";
    }
  };
  return (
    <div className={Styles.home_container}>
      <div className={Styles.left_content}>
        <AcademyProgress name={user.name.split(" ")[0]} />
        <LastGoalsCard />
        <Register email={user.email} />
        <TrilhasComponent />
      </div>
      <div className={Styles.user_menu}>
        <div className={Styles.user_image}>
          <img className={Styles.avatar} src={user.avatarUrl} alt="img" />
        </div>

        <p className={Styles.user_name}>{user.name}</p>
        <p className={Styles.user_title}>
          {"Estagiário(a) em " + getStudentMain()}
        </p>
        <div className={Styles.user_status}>
          <div className={Styles.user_status_content}>
            <img
              src={Images.icons.level_Icon}
              className={Styles.level_Icon}
              alt="Level Icon"
            />

            <p className={Styles.user_status_lvl}>
              lvl <strong>{userAtt.level}</strong>
            </p>
            <div className={Styles.divisor}></div>

            <p className={Styles.user_status_exp}>
              <strong>{userAtt.exp!}</strong>/48 REX'S
            </p>
          </div>
          <div className={Styles.user_progress_bar}>
            <ProgressBar
              width={190}
              totalValue={48}
              relativeValue={userAtt.exp!}
            />
          </div>
        </div>
        <div className={Styles.hr_divisor}></div>
        <div className={Styles.emblems}>
          <div className={Styles.emblems_icon}>
            <svg
              width="14"
              height="15"
              viewBox="0 0 10 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.04231 0.516369C6.14174 0.277343 6.41612 0.164182 6.65514 0.263617C6.89417 0.363052 7.00733 0.637428 6.9079 0.876454L6.2579 2.43895C6.15846 2.67798 5.88408 2.79114 5.64506 2.69171C5.40603 2.59227 5.29287 2.31789 5.39231 2.07887L6.04231 0.516369ZM8.32128 0.5071C8.42583 0.270268 8.70258 0.163036 8.93941 0.26759C9.17624 0.372144 9.28348 0.648892 9.17892 0.885723L7.03219 5.74842C8.33567 6.46623 9.21885 7.85318 9.21885 9.44641C9.21885 11.7764 7.33005 13.6652 5.0001 13.6652C2.67015 13.6652 0.781353 11.7764 0.781353 9.44641C0.781353 7.96258 1.54741 6.65767 2.70561 5.9056L0.20584 0.906043C0.090064 0.67449 0.183919 0.392925 0.415471 0.277149C0.647024 0.161373 0.928589 0.255228 1.04436 0.48678L3.54384 5.48575C3.91301 5.34997 4.30642 5.26433 4.7158 5.23709L2.6007 0.901954C2.48718 0.669286 2.58377 0.388647 2.81643 0.275129C3.0491 0.161611 3.32974 0.258201 3.44326 0.490869L5.79039 5.30156C5.91748 5.32565 6.04256 5.35543 6.16534 5.39064L8.32128 0.5071ZM8.28135 9.44641C8.28135 7.77612 7.03334 6.39732 5.41893 6.19164C5.28179 6.17417 5.142 6.16516 5.0001 6.16516C3.18792 6.16516 1.71885 7.63423 1.71885 9.44641C1.71885 11.2586 3.18792 12.7277 5.0001 12.7277C6.81229 12.7277 8.28135 11.2586 8.28135 9.44641ZM5.03135 7.50894C5.17339 7.40241 5.36343 7.38528 5.52224 7.46468C5.68104 7.54408 5.78135 7.7064 5.78135 7.88394V11.0089C5.78135 11.2678 5.57149 11.4777 5.3126 11.4777C5.05372 11.4777 4.84385 11.2678 4.84385 11.0089V8.82144L4.34385 9.19644C4.13675 9.35177 3.84294 9.3098 3.6876 9.10269C3.53227 8.89559 3.57425 8.60177 3.78135 8.44644L5.03135 7.50894Z"
                fill="white"
              />
            </svg>
          </div>
          <p className={Styles.emblems_text}>Emblemas</p>
        </div>
        <div className={Styles.emblems_icons_new_teste}>
          {badges &&
            badges.map((item: any) => (
              <div className={Styles.emblems_icons_new_teste_item}>
                <Emblem
                  badge={item.title}
                  size="default"
                  number={item.badgeNumber}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default HomeScreenStudent;

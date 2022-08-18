import styles from "./ModuleModal.module.css";
import { style } from "@mui/system";
import SimpleButton from "../../../../components/SimpleButton/SimpleButton";

type modalProps = {
  title: string;
  iconClose?: JSX.Element;
  children?: React.ReactNode;
  onClose: VoidFunction;
  id?: string;
  onClickConfirm?: VoidFunction;
  onClickCancel?: VoidFunction;
  oneButton?: boolean;
};

const ModuleModal = ({
  oneButton = false,
  children,
  iconClose,
  title,
  onClose = () => {},
  id = "outside",
  onClickConfirm,
  onClickCancel,
}: modalProps) => {
  const handleOutsideClick = (e: any) => {
    if (e.target.id === id) {
      onClose();
    }
  };

  return (
    <div id={id} className={styles.modal_outside} onClick={handleOutsideClick}>
      <div className={styles.modal_container}>
        <div className={styles.modal_header}>
          <h1 className={styles.modal_title}>{title}</h1>
          <div onClick={onClose} className={styles.modal_header_icon}>
            {iconClose}
          </div>
        </div>

        <div className={styles.modal_divider}></div>

        <div className={styles.modal_content}>{children}</div>

        <div className={styles.modal_actions}>
          {!oneButton && (
            <SimpleButton
              type="secondary"
              text="Cancelar"
              onClick={onClickCancel!}
              size={"block"}
            />
          )}
          <SimpleButton
            text="Confirmar"
            size="block"
            onClick={onClickConfirm!}
          />
        </div>
      </div>
    </div>
  );
};

export default ModuleModal;

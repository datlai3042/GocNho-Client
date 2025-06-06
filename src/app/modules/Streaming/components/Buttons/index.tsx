import React from "react";
import styles from "../../styles/styles.module.scss";
type TProps = {
  features: React.ComponentType<any>[];
};

const ButtonActions = (props: TProps) => {
  const { features } = props;

  return (
    <div className={styles.buttonActions__container}>
      {features?.map((Feature, index) => (
        <React.Fragment key={index}>
          <Feature />
        </React.Fragment>
      ))}
    </div>
  );
};

export default ButtonActions;

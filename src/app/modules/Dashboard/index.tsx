import { useGetMe } from "../User/hooks/useGetMe";
import ShowListUsers from "./components/ShowListUsers";
import styles from "./styles/styles.module.scss";
const DashboardView = () => {
  useGetMe();
 
  return (
    <div id={`${styles.dashboard__container}`}>
      <ShowListUsers />
    </div>
  );
};

export default DashboardView;

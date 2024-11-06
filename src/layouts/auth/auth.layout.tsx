import React from "react";
import style from "./auth.module.less";
import { PublicRoute } from "../../guards/app.guard";

const AuthLayout: React.FC<{ component: React.ReactNode }> = ({
  component,
}) => {
  return (
    <PublicRoute>
      <div className={style.container}>
        <div className={style.content}>{component}</div>
        <div className={style.blockBg}>
          <img src="/images/img-login.svg" />
          
        </div>
      </div>
    </PublicRoute>
  );
};

export default AuthLayout;

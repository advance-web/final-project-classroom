import { useEffect } from "react";
import { Card, Space, Button } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { setJwt } from "../../libs/utils/localStorage";
import { getMe, verify } from "../../services/auth";
import { Link } from "react-router-dom";

const LoginSuccess = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const verifyToken = searchParams.get("token");

  useEffect(() => {
    // const userToken= getMe();
    // // Set the token in local storage
    // setJwt(userToken.token);

    // Send the token to the backend using Axios
    try {
      const response = verify(verifyToken);
      response
        .then((response) => {
          console.log("Response from backend:", response.data);
          setJwt(response.data.token);
        })
        .catch((error) => {
          console.error("Error sending token to backend:", error);
        });
    } catch (error) {}
    // Redirect the user to the home page
    // window.location.href = "/";
  }, [verifyToken]);

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: "200px",
      }}
    >
      <Card
        title="Xác nhận thành công"
        size="small"
        align="center"
        style={{
          width: 600,
        }}
      >
        <Button type="primary">
          <a href="/">Trang chủ</a>
        </Button>
      </Card>
    </Space>
  );
};

export default LoginSuccess;

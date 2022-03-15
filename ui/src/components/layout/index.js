import { styled } from "@mui/material/styles";

const ContentContainer = styled("div")(() => ({
  margin: "10px",
}));

const Layout = (props) => {
  return <ContentContainer>{props.children}</ContentContainer>;
};
export default Layout;

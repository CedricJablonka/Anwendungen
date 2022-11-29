import { SideSheet, Paragraph } from "evergreen-ui";
import GeneralContext from "../context/general-context/GeneralContext";
import { useContext } from "react";
const MySideSheet = (props) => {
  const { isShown, children } = props;
  const { changeShowSideSheet, changeSelectedCompleteStreet } =
    useContext(GeneralContext);
  return (
    <>
      <SideSheet
        isShown={isShown}
        onCloseComplete={() => {
          //Todo maybe this should come from a parents component to make this component more reusable
          changeShowSideSheet(false);
          changeSelectedCompleteStreet();
        }}
        preventBodyScrolling
      >
        <Paragraph margin={40}>Basic Example</Paragraph>
        {children}
      </SideSheet>
    </>
  );
};
export default MySideSheet;

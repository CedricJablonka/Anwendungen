import { Pane, Button, Spinner, toaster } from "evergreen-ui";
import { streetFormFieldData } from "../../constants/streetFormFieldData";
import MyInput from "../inputs/myInput";
import { useContext } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";

const MyForm = (props) => {
  const { streetId } = props;
  const {
    streetDetailsData,
    isLoadingStreetDetailsData,
    sendStreetDetailsData,
    showUserMessage
  } = useContext(GeneralContext);

  console.log(streetDetailsData);

  const handleSubmit = (e) => {
    console.log("hello");
    e.preventDefault();
    sendStreetDetailsData(streetId);
    showUserMessage();
  };
  return (
    <>
      {!isLoadingStreetDetailsData ? (
        <Pane>
          <Pane display="flex" flexWrap="wrap">
            <h3>{`Street Id: ${streetId}`}</h3>
            {streetFormFieldData.map((formField) => {
              return (
                <MyInput
                  label={formField.name}
                  key={formField.name}
                  inputId={formField.id}
                  initialValue={streetDetailsData[formField.id]}
                />
              );
            })}
          </Pane>
          <Pane display="flex" justifyContent="center" marginTop={10}>
            <Button appearance="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Pane>
        </Pane>
      ) : (
        <Pane
          display="flex"
          alignItems="center"
          justifyContent="center"
          height={400}
        >
          <Spinner />
        </Pane>
      )}
    </>
  );
};
export default MyForm;

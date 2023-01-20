import { useContext } from "react";
import { TextInput, FormField, Pane } from "evergreen-ui";
import GeneralContext from "../../context/general-context/GeneralContext";

const MyInput = (props) => {
  const { label, initialValue, inputId, isDisabled, plainIndex } = props;
  const { changeStreetDetailsData, changePlainsDetailsData } =
    useContext(GeneralContext);

  const handleChange = (e) => {
    if (plainIndex !== undefined) {
      changePlainsDetailsData(plainIndex, inputId, e.target.value);
    } else {
      changeStreetDetailsData(inputId, e.target.value);
    }
  };
  return (
    <Pane marginTop={5}>
      <FormField label={label}>
        <TextInput
          onChange={handleChange}
          value={initialValue}
          disabled={isDisabled}
        />
      </FormField>
    </Pane>
  );
};
export default MyInput;

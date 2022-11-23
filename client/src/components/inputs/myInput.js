import { useState, useEffect, useContext } from "react";
import { TextInput, FormField, Pane } from "evergreen-ui";
import GeneralContext from "../../context/general-context/GeneralContext";


const MyInput = (props) => {
  const { label, initialValue, setFormData, inputId } = props;
  const {changeStreetDetailsData} = useContext(GeneralContext);

  
  

  return (
    <Pane marginTop={5}>
      <FormField label={label}>
        <TextInput onChange={(e) => changeStreetDetailsData(inputId,e.target.value)} value={initialValue} />
      </FormField>
    </Pane>
  );
};
export default MyInput;

import { useState } from "react";
import { TextInput, FormField, Pane } from "evergreen-ui";

const MyInput = (props) => {
  const { label, initialValue } = props;
  const [value, setValue] = useState(initialValue);

  return (
    <Pane marginTop={5}>
      <FormField label={label}>
        <TextInput onChange={(e) => setValue(e.target.value)} value={value} />
      </FormField>
    </Pane>
  );
};
export default MyInput;

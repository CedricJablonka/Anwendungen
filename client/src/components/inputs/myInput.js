import { TextInput, FormField, Pane } from "evergreen-ui";

const MyInput = (props) => {
  const { label, initialValue, inputId, isDisabled, plainIndex, onChange } = props;

  const handleChange = (e) => {
    onChange && onChange(e.target.value, plainIndex, inputId);
   
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

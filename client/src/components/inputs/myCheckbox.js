import React, { useState } from "react";
import { Checkbox } from "evergreen-ui";


const MyCheckbox = (props) => {
  const { label, active, onChange } = props;
  const [checked, setChecked] = useState(active);
  const handleOnChange = (e) => {
    setChecked(e.target.checked);
    onChange && onChange(label);
  };
  return (
    <>
      <Checkbox label={label} checked={checked} onChange={(e)=> {handleOnChange(e)}} />
    </>
  );
};
export default MyCheckbox;

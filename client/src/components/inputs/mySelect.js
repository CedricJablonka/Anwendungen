import { SelectField, Pane } from "evergreen-ui";
import { useContext } from "react";
import GeneralContext from "../../context/general-context/GeneralContext";
const MySelect = (props) => {
  const { optionsArray, label, inputId, index } = props;
  const { changePlainsDetailsData } = useContext(GeneralContext);
  const handleChange = (e) => {

    changePlainsDetailsData(index, inputId, e.target.value);
  };
  const unit = "m^3/t";

  return (
    <Pane marginTop={5}>
      <SelectField onChange={handleChange} label={label}>
        {optionsArray.map((option) => {
          return (
            <option
              value={option.density}
              key={option.name}
            >{`${option.name} (${option.density,unit})`}</option>
          );
        })}
      </SelectField>
    </Pane>
  );
};
export default MySelect;

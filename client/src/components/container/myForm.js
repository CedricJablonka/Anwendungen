import { Pane, Button } from "evergreen-ui";
import {streetFormFieldData} from "../../constants/streetFormFieldData";
import MyInput from "../inputs/myInput";

const MyForm = (props) => {
    const {streetId} = props
  return (
    <Pane>
      <Pane display="flex" flexWrap="wrap">
        <h3>{`Street Id: ${streetId}`}</h3>
        {streetFormFieldData.map((formField) => {
          return (
            <MyInput
              label={formField.name}
              key={formField.name}
              initialValue={formField.value}
            />
          );
        })}
      </Pane>
      <Pane display="flex" justifyContent="center" marginTop={10}>
        <Button appearance="primary">Submit</Button>
      </Pane>
    </Pane>
  );
};
export default MyForm;

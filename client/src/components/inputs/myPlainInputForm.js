import { useState, useContext } from "react";
import { Pane, AddIcon, Tooltip, majorScale, Heading } from "evergreen-ui";
import GeneralContext from "../../context/general-context/GeneralContext";
import plainFormFields from "../../constants/plainFormFields";
import MyInput from "./myInput";
import MyCollapseContainer from "../container/myCollapseContainer";

const MyPlainInputForm = () => {
  const { plainsDetailsData, changePlainsDetailsData, addPlain, deletePlain } =
    useContext(GeneralContext);

  const onAddPlain = () => {
    plainsDetailsData.length <= 10 && addPlain({ mass: "", area: "", thickness: "", layerTyp: "" });
  };

  const onChangePlain = (plaineIndex, fieldId, newValue) => {
    changePlainsDetailsData(plaineIndex, fieldId, newValue);
  };

  const onDeletePlain = (plainIndex) => {
    deletePlain(plainIndex);
  };

  return (
    <>
      <Pane>
        <Pane display="flex" justifyContent="center" flexWrap="wrap">
          <Heading is="h3" style={{ margin: "15px 0 0 0" }}>
            Ebenen
          </Heading>
        </Pane>
        {plainsDetailsData.length !== 0 ? (
          <Pane>
            {[...Array(plainsDetailsData.length)].map((n, plainIndex) => (
              <Pane key={plainIndex}>
                <MyCollapseContainer
                  status={false}
                  index={plainIndex}
                  onDelete={onDeletePlain}
                >
                  {plainFormFields.map((formField, index) => {
                    {
                      /* This is the loop for getting all the fields for one particular plane */
                    }
                    return (
                      <MyInput
                        onChange={onChangePlain}
                        label={formField.name}
                        key={formField.name}
                        inputId={formField.id}
                        plainIndex={plainIndex}
                        initialValue={
                          plainsDetailsData[plainIndex][formField.id]
                        }
                      />
                    );
                  })}
                  <MyInput
                    label="Masse"
                    key="mass"
                    inputId={"mass"}
                    initialValue={plainsDetailsData[plainIndex]["mass"]}
                    isDisabled={true}
                  />
                </MyCollapseContainer>
              </Pane>
            ))}
          </Pane>
        ) : (
          <></>
        )}
      </Pane>
      <Pane
        display="flex"
        justifyContent="center"
        marginBottom={majorScale(3)}
        marginTop={majorScale(2)}
      >
        <AddIcon size={20} onClick={onAddPlain} />
      </Pane>
    </>
  );
};
export default MyPlainInputForm;
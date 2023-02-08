import React, { useContext } from "react";
import MyCheckbox from "./inputs/myCheckbox";
import GeneralContext from "../context/general-context/GeneralContext";
import { Pane, Button, Spinner } from "evergreen-ui";

const StreetTypeSelection = () => {
  const {
    overpassHighwayTypes,
    changeHighwayTypeSelection,
    sendOverpassQuery,
    isLoadingStreetData,
  } = useContext(GeneralContext);
 

  return (
    <Pane marginBottom={20}>
      <Pane display="flex" justify="space-between" flexWrap="wrap">
        {Object.values(overpassHighwayTypes).map((type, index) => {
          return (
            <Pane key={index} marginLeft={5} marginRight={5}>
              <MyCheckbox
                label={type.name}
                active={type.active}
                onChange={changeHighwayTypeSelection}
              />
            </Pane>
          );
        })}
      </Pane>
      <Pane
        display="flex"
        justifyContent="center"
        alignItems="space-between"
        flexWrap="wrap"
      >
        {isLoadingStreetData ? (
          <Spinner />
        ) : (
          <Button appearance="primary" onClick={sendOverpassQuery}>
            Anfrage
          </Button>
        )}
      </Pane>
    </Pane>
  );
};
export default StreetTypeSelection;

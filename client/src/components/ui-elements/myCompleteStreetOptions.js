import { Pane, EyeOpenIcon, EyeOffIcon } from "evergreen-ui";
import MyIconButton from "./myIconButton";
import { TbRoadOff } from "react-icons/tb";
import { useContext } from "react";
import CompleteStreetContext from "../../context/complete-street-context/CompleteStreetContext";

const MyCompleteStreetOptions = (props) => {
  const { showCustomStreetSections } = useContext(CompleteStreetContext);
  const {
    onUnselectCompleteStreet,
    onShowAllStreetSections,
    onHideAllStreetSections,
  } = props;
  const handleShowAllStreetSections = () => {
    onShowAllStreetSections();
  };

  const handleUnselectCompleteStreet = () => {
    onUnselectCompleteStreet();
  };

  const handleHideCustomStreetSections = () => {
    onHideAllStreetSections();
  };

  return (
    <Pane display="flex" justifyContent="flex-end" marginBottom="8px">
      <MyIconButton
        tooltipContent="Remove Selected Complete Street"
        icon={<TbRoadOff size={20} />}
        onClick={handleUnselectCompleteStreet}
      />
      {showCustomStreetSections ? (
        <MyIconButton
          icon={<EyeOffIcon />}
          tooltipContent="Alle Maßnahmen verbergen"
          onClick={handleHideCustomStreetSections}
        />
      ) : (
        <MyIconButton
          icon={<EyeOpenIcon />}
          tooltipContent="Alle Maßnahmen anzeigen"
          onClick={handleShowAllStreetSections}
        />
      )}
    </Pane>
  );
};
export default MyCompleteStreetOptions;

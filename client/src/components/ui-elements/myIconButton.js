import { IconButton, Tooltip, majorScale } from "evergreen-ui";

const MyIconButton = (props) => {
    const {icon, onClick, tooltipContent} = props;

    const handleOnClick = () => {

        onClick();
    }
  return (
    <Tooltip content={tooltipContent}>
      <IconButton icon={icon} marginLeft={majorScale(2)} onClick={handleOnClick} />
    </Tooltip>
  );
};
export default MyIconButton;

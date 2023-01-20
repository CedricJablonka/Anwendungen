import { Collapse } from "react-collapse";
import {
  Pane,
  ChevronRightIcon,
  ChevronDownIcon,
  majorScale,
  Heading,
  BanCircleIcon,
  Tooltip,
} from "evergreen-ui";
import { useState } from "react";

const MyCollapseContainer = (props) => {
  const { status, children, index, onDelete } = props;
  const [isOpen, setIsOpen] = useState(status);
  const adjustedIndex = index + 1;

  const onClick = () => {
    setIsOpen(!isOpen);
  };
  const handleDelete = () => {
    onDelete(index);
  };

  return (
    <Pane>
      <Pane
        display="flex"
        justifyContent="space-between"
        marginTop={majorScale(2)}
        flexWrap="false"
        borderBottom={"1px solid #D9D9D9"}
      >
        <Pane display="flex" alignItems="center">
          {isOpen ? (
            <ChevronDownIcon onClick={onClick} color="#101840" />
          ) : (
            <ChevronRightIcon onClick={onClick} color="#101840" />
          )}
          <Heading is="h3">{`Ebene ${adjustedIndex} `}</Heading>
        </Pane>
        <Pane>
          <BanCircleIcon
            color="danger"
            marginRight={16}
            onClick={handleDelete}
          />
        </Pane>
      </Pane>

      <Collapse isOpened={isOpen}>{children}</Collapse>
    </Pane>
  );
};
export default MyCollapseContainer;

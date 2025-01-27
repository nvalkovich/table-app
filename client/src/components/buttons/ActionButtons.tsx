import { Button } from 'react-bootstrap';
// @ts-ignore
import BlockIcon from '../../assets/icons/lock.svg?react';
// @ts-ignore
import UnlockIcon from '../../assets/icons/unlock.svg?react';
// @ts-ignore
import TrashIcon from '../../assets/icons/trash.svg?react';

interface ActionButtonsProps {
    onBlock: () => void;
    onUnblock: () => void;
    onDelete: () => void;
}

const ActionButtons = ({
    onBlock,
    onUnblock,
    onDelete,
}: ActionButtonsProps) => {
    const buttonStyle = {
        width: '20px',
        height: '20px',
    };

    return (
        <div className="d-flex mb-4 justify-content-center align-items-center">
            <Button variant="light" onClick={onBlock} className="me-2">
                <BlockIcon
                    style={{
                        marginRight: '5px',
                        ...buttonStyle,
                    }}
                />
                Block
            </Button>
            <Button variant="light" onClick={onUnblock} className="me-2">
                <UnlockIcon style={buttonStyle} />
            </Button>
            <Button variant="light" onClick={onDelete}>
                <TrashIcon style={buttonStyle} />
            </Button>
        </div>
    );
};

export default ActionButtons;

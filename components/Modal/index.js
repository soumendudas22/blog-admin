import PropTypes from 'prop-types';
import { AiFillCloseCircle } from "react-icons/ai";

export default function Modal({ isOpen, extendStyle, children, setOpen }) {

  return (<>
    {
      isOpen && (
        <div className={`modal-background`}>
          <div className={`modal-wrapper ${isOpen ? "fade-in": "fade-out"}`} style={extendStyle}>
            <button id="modal-close" onClick={() => setOpen(false)}> <AiFillCloseCircle color='orange' size={25} /></button>
            {children}
          </div>
        </div>
      )
    }
  </>);
}

Modal.propTypes = {
  isOpen: PropTypes.bool,
  extendStyle: PropTypes.object
}

Modal.defaultProps = {
  isOpen: false,
  extendStyle: {}
}
import Reblend from 'reblendjs';

function DialogUX({ header, onClose, children }: any) {
  return (
    <div class="dialog-ux" style="cursor: default">
      <div class="backdrop-ux"></div>
      <div class="modal-ux">
        <div class="modal-dialog-ux">
          <div class="modal-ux-inner">
            <div class="modal-ux-header">
              <h3>{header}</h3>
              <button type="button" class="close-modal" onClick={onClose}>
                <svg width="20" height="20">
                  <use href="#close" xlink:href="#close"></use>
                </svg>
              </button>
            </div>
            <div class="modal-ux-content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DialogUX;

// DeleteConfirmationModal.jsx
import { Modal, ModalBody, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function DeleteConfirmationModal({ 
  show, 
  onClose, 
  onConfirm, 
  title,
  message,
  confirmText,
  cancelText,
}) {
  return (
    <Modal show={show} onClose={onClose} popup size="md">
      <ModalBody>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-16 w-16 text-red-500 dark:text-red-400 mb-4 mx-auto" />
          <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            {message}
          </p>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={onConfirm} className="px-6">
              {confirmText}
            </Button>
            <Button color="gray" onClick={onClose} className="px-6">
              {cancelText}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
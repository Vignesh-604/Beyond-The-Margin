// Utils/SweetAlertUtils.js
import Swal from 'sweetalert2';

/**
 * Shows a confirmation dialog before performing an action
 * @param {Object} options - Configuration options
 * @param {string} options.title - The title of the confirmation dialog
 * @param {string} options.text - The text message of the confirmation dialog
 * @param {string} options.icon - The icon type ('warning', 'error', 'success', 'info', 'question')
 * @param {string} options.confirmButtonText - Text for the confirm button
 * @param {string} options.cancelButtonText - Text for the cancel button
 * @param {Function} options.onConfirm - Callback function to execute when confirmed
 * @param {Function} options.onCancel - Optional callback function to execute when canceled
 */
export const showConfirmationAlert = ({
  title = 'Are you sure?',
  text = 'Do you want to proceed with this action?',
  icon = 'warning',
  confirmButtonText = 'Yes, proceed',
  cancelButtonText = 'Cancel',
  onConfirm,
  onCancel
}) => {
  Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText,
    cancelButtonText
  }).then((result) => {
    if (result.isConfirmed && onConfirm) {
      onConfirm();
    } else if (result.dismiss === Swal.DismissReason.cancel && onCancel) {
      onCancel();
    }
  });
};

/**
 * Shows a success message dialog
 * @param {string} title - Title of the success message
 * @param {string} text - Content of the success message
 */
export const showSuccessAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonColor: '#3085d6'
  });
};

/**
 * Shows an error message dialog
 * @param {string} title - Title of the error message
 * @param {string} text - Content of the error message
 */
export const showErrorAlert = (title, text) => {
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonColor: '#3085d6'
  });
};

/**
 * Shows a validation error message dialog
 * @param {Array} validationErrors - Array of error messages
 */
export const showValidationErrorAlert = (validationErrors) => {
  const errorList = validationErrors.map(error => `• ${error}`).join('<br>');
  
  Swal.fire({
    title: 'Form Validation Error',
    html: `Please fix the following issues:<br><br>${errorList}`,
    icon: 'error',
    confirmButtonColor: '#3085d6'
  });
};
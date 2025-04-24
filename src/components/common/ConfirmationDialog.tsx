import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string; // Optional custom confirm button text
  cancelText?: string;  // Optional custom cancel button text
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
}) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    onClose(); // Typically close after confirming
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
    >
      <DialogTitle id="confirmation-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {cancelText || t('common.cancel')}
        </Button>
        <Button onClick={handleConfirm} color="primary" autoFocus>
          {confirmText || t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog; 
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../confirmation-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {

  constructor(private modalService: NgbModal) { }

  confirm(options: {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
  }): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      centered: true,
      backdrop: 'static'
    });

    modalRef.componentInstance.title = options.title || 'Confirm';
    modalRef.componentInstance.message = options.message || 'Are you sure?';
    modalRef.componentInstance.confirmText = options.confirmText || 'Yes';
    modalRef.componentInstance.cancelText = options.cancelText || 'No';

    return modalRef.result.then(
      (result) => result === true,
      () => false
    );
  }
}

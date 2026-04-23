import { LightningElement, api, wire } from 'lwc';
import getSummary from '@salesforce/apex/EngagementController.getEngagementSummary';
import createCall from '@salesforce/apex/EngagementController.createFollowUpCall';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { refreshApex } from '@salesforce/apex';

export default class EngagementSummary extends LightningElement {
  @api recordId;

  opportunityAmount = 0;
  completedTasks = 0;
  upcomingEvents = 0;

  wiredResult;

  @wire(getSummary, { engagementId: '$recordId' })
  wiredData(result) {
    this.wiredResult = result;

    if (result.data) {
      this.opportunityAmount = result.data.opportunityAmount;
      this.completedTasks = result.data.completedTasks;
      this.upcomingEvents = result.data.upcomingEvents;
    } else if (result.error) {
      console.error(result.error);
    }
  }

  handleFollowUp() {
    createCall({ engagementId: this.recordId })
      .then(() => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: 'Success',
            message: 'Follow-up call created',
            variant: 'success'
          })
        );

        // Refresca los datos
        refreshApex(this.wiredResult);
      })
      .catch(error => {
        console.error(error);
      });
  }
}
# SongLaunch

## Current State
UploadForm has a 'Launch Track' button that directly triggers the upload flow. No payment gate exists.

## Requested Changes (Diff)

### Add
- Payment modal that appears when user clicks 'Launch Track'
- Modal shows: fee amount (₹99), UPI QR code image (Himanshu Kagra / himanshukagra07@oksbi), instructions to scan and pay
- 'I have paid' confirm button that proceeds with the actual upload
- 'Cancel' button to dismiss modal

### Modify
- UploadForm: intercept submit to show payment modal first, then upload after confirmation

### Remove
- Nothing removed

## Implementation Plan
1. Add PaymentModal component with QR code image, fee display, UPI ID, confirm/cancel buttons
2. In UploadForm, add state for showPaymentModal
3. On 'Launch Track' click (after validation), show modal instead of uploading
4. On confirm in modal, close modal and proceed with upload

# TODO: Organizer Dashboard Modifications

## Backend Changes
- [ ] Modify Tournament model (backend/src/models/Tournament.js):
  - Remove "Doubles" and "Mixed Doubles" from format enum
  - Reduce model size by removing optional fields (images, rules, requirements, rejectionReason, approvedAt, approvedBy)
  - Shorten description maxlength from 1000 to 500

## Frontend Changes
- [ ] Update OrganizerDashboard.jsx (frontend/src/pages/OrganizerDashboard.jsx):
  - Remove "Doubles" and "Mixed Doubles" options from format select
  - Implement edit functionality:
    - Add state for editing mode and selected tournament
    - Populate form with tournament data on edit click
    - Change submit button text to "Update" when editing
    - Add update API call on form submit when editing
    - Reset form after update
  - Ensure list updates immediately after add/edit/delete

## Testing
- [ ] Test add tournament functionality
- [ ] Test edit tournament functionality
- [ ] Test delete tournament functionality
- [ ] Verify format options are only "Singles"
